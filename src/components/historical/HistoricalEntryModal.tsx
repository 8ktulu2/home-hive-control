
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { History, Calendar, Euro, FileText } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    propertyId: '',
    propertyName: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    type: 'income' as HistoricalEntry['type'],
    amount: 0,
    description: '',
    category: 'rent' as HistoricalEntry['category'],
    isOccupied: true,
    tenantName: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
        category: editingEntry.category || 'rent',
        isOccupied: editingEntry.isOccupied || false,
        tenantName: editingEntry.tenantName || ''
      });
    } else {
      // Reset form for new entry
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertyId) {
      newErrors.propertyId = 'Selecciona una propiedad';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    if ((formData.type === 'income' || formData.type === 'expense') && formData.amount <= 0) {
      newErrors.amount = 'El importe debe ser mayor que 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const entryData: Omit<HistoricalEntry, 'id' | 'createdAt' | 'updatedAt' | 'isHistorical'> = {
      propertyId: formData.propertyId,
      propertyName: formData.propertyName,
      year: formData.year,
      month: formData.month,
      type: formData.type,
      description: formData.description,
      ...(formData.type === 'income' || formData.type === 'expense' ? { amount: formData.amount } : {}),
      ...(formData.type !== 'occupancy' ? { category: formData.category } : {}),
      ...(formData.type === 'occupancy' ? { 
        isOccupied: formData.isOccupied,
        tenantName: formData.isOccupied ? formData.tenantName : undefined
      } : {})
    };

    onSave(entryData);
    onClose();
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const expenseCategories = [
    { value: 'ibi', label: 'IBI' },
    { value: 'community', label: 'Comunidad' },
    { value: 'insurance', label: 'Seguros' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'repairs', label: 'Reparaciones' },
    { value: 'utilities', label: 'Suministros' },
    { value: 'legal', label: 'Gastos Legales' },
    { value: 'other', label: 'Otros' }
  ];

  const incomeCategories = [
    { value: 'rent', label: 'Alquiler' },
    { value: 'deposit', label: 'Fianza' },
    { value: 'other', label: 'Otros Ingresos' }
  ];

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
          {/* Selector de Propiedad */}
          <div className="space-y-2">
            <Label htmlFor="property">Propiedad *</Label>
            <Select value={formData.propertyId} onValueChange={handlePropertyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una propiedad" />
              </SelectTrigger>
              <SelectContent>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyId && <p className="text-sm text-red-500">{errors.propertyId}</p>}
          </div>

          {/* Fecha */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mes</Label>
              <Select value={formData.month.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, month: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                min="2000"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          {/* Tipo de Registro */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Registro</Label>
            <Select value={formData.type} onValueChange={(value: HistoricalEntry['type']) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-green-600" />
                    Ingreso
                  </div>
                </SelectItem>
                <SelectItem value="expense">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-red-600" />
                    Gasto
                  </div>
                </SelectItem>
                <SelectItem value="occupancy">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Estado de Ocupación
                  </div>
                </SelectItem>
                <SelectItem value="incident">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-600" />
                    Incidencia
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campos condicionales según el tipo */}
          {(formData.type === 'income' || formData.type === 'expense') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Importe (€) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category} onValueChange={(value: HistoricalEntry['category']) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {formData.type === 'occupancy' && (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isOccupied}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOccupied: checked }))}
                />
                <Label>¿Estaba ocupada la propiedad?</Label>
              </div>

              {formData.isOccupied && (
                <div className="space-y-2">
                  <Label htmlFor="tenantName">Nombre del inquilino</Label>
                  <Input
                    value={formData.tenantName}
                    onChange={(e) => setFormData(prev => ({ ...prev, tenantName: e.target.value }))}
                    placeholder="Nombre del inquilino"
                  />
                </div>
              )}
            </>
          )}

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={formData.type === 'income' ? 'Ej: Alquiler mensual' : 
                          formData.type === 'expense' ? 'Ej: Pago IBI anual' :
                          formData.type === 'occupancy' ? 'Ej: Inquilino Juan Pérez' :
                          'Ej: Reparación fontanería'}
              rows={2}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Botones */}
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
