
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { HistoricalEntry } from '@/types/historical';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { History } from 'lucide-react';
import { HistoricalFormData, FormErrors } from './types';
import { validateHistoricalForm } from './HistoricalFormValidation';
import PropertySelector from './PropertySelector';
import DateSelector from './DateSelector';
import TypeSelector from './TypeSelector';
import AmountCategoryFields from './AmountCategoryFields';
import OccupancyFields from './OccupancyFields';

interface HistoricalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<HistoricalEntry, 'id' | 'createdAt' | 'updatedAt' | 'isHistorical'>) => void;
  properties: Property[];
  editingEntry?: HistoricalEntry | null;
}

const HistoricalEntryModal: React.FC<HistoricalEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  properties,
  editingEntry
}) => {
  const [formData, setFormData] = useState<HistoricalFormData>({
    propertyId: '',
    propertyName: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    type: 'income',
    amount: 0,
    description: '',
    category: 'rent',
    isOccupied: true,
    tenantName: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        propertyId: editingEntry.propertyId,
        propertyName: editingEntry.propertyName,
        year: editingEntry.year,
        month: editingEntry.month,
        type: editingEntry.type,
        amount: editingEntry.amount || 0,
        description: editingEntry.description,
        category: editingEntry.category || (editingEntry.type === 'income' ? 'rent' : 'ibi'),
        isOccupied: editingEntry.isOccupied || false,
        tenantName: editingEntry.tenantName || ''
      });
    } else {
      setFormData({
        propertyId: '',
        propertyName: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        type: 'income',
        amount: 0,
        description: '',
        category: 'rent',
        isOccupied: true,
        tenantName: ''
      });
    }
    setErrors({});
  }, [editingEntry, isOpen]);

  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    setFormData(prev => ({
      ...prev,
      propertyId,
      propertyName: property?.name || ''
    }));
  };

  const handleTypeChange = (value: HistoricalEntry['type']) => {
    let defaultCategory: HistoricalEntry['category'] = 'rent';
    if (value === 'expense') {
      defaultCategory = 'ibi';
    } else if (value === 'income') {
      defaultCategory = 'rent';
    }
    
    setFormData(prev => ({ 
      ...prev, 
      type: value,
      category: defaultCategory
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateHistoricalForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const entryData: Omit<HistoricalEntry, 'id' | 'createdAt' | 'updatedAt' | 'isHistorical'> = {
      propertyId: formData.propertyId,
      propertyName: formData.propertyName,
      year: formData.year,
      month: formData.month,
      type: formData.type,
      description: formData.description,
      ...(formData.type === 'income' || formData.type === 'expense' ? { amount: formData.amount } : {}),
      ...(formData.type === 'income' || formData.type === 'expense' ? { category: formData.category } : {}),
      ...(formData.type === 'occupancy' ? { 
        isOccupied: formData.isOccupied,
        tenantName: formData.isOccupied ? formData.tenantName : undefined
      } : {})
    };

    onSave(entryData);
    onClose();
  };

  const getDescriptionPlaceholder = () => {
    switch (formData.type) {
      case 'income': return 'Ej: Alquiler mensual';
      case 'expense': return 'Ej: Pago IBI anual';
      case 'occupancy': return 'Ej: Inquilino Juan Pérez';
      default: return 'Ej: Reparación fontanería';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            {editingEntry ? 'Editar Registro Histórico' : 'Añadir Datos Históricos'}
          </DialogTitle>
          <DialogDescription>
            {editingEntry ? 'Modifica los datos del registro histórico' : 'Registra datos de años anteriores para completar el historial'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PropertySelector
            value={formData.propertyId}
            onChange={handlePropertyChange}
            properties={properties}
            error={errors.propertyId}
          />

          <DateSelector
            month={formData.month}
            year={formData.year}
            onMonthChange={(month) => setFormData(prev => ({ ...prev, month }))}
            onYearChange={(year) => setFormData(prev => ({ ...prev, year }))}
          />

          <TypeSelector
            value={formData.type}
            onChange={handleTypeChange}
          />

          <AmountCategoryFields
            type={formData.type}
            amount={formData.amount}
            category={formData.category}
            onAmountChange={(amount) => setFormData(prev => ({ ...prev, amount }))}
            onCategoryChange={(category) => setFormData(prev => ({ ...prev, category }))}
            amountError={errors.amount}
          />

          {formData.type === 'occupancy' && (
            <OccupancyFields
              isOccupied={formData.isOccupied}
              tenantName={formData.tenantName}
              onOccupiedChange={(isOccupied) => setFormData(prev => ({ ...prev, isOccupied }))}
              onTenantNameChange={(tenantName) => setFormData(prev => ({ ...prev, tenantName }))}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={getDescriptionPlaceholder()}
              rows={2}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingEntry ? 'Actualizar' : 'Guardar'} Registro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HistoricalEntryModal;
