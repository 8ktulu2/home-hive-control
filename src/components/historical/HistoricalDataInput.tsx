
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useHistoricalStorage, HistoricalRecord } from '@/hooks/useHistoricalStorage';
import HistoricalConfiguration from './HistoricalConfiguration';
import CategoriesInput from './CategoriesInput';
import MonthCalendarGrid from './MonthCalendarGrid';

interface HistoricalDataInputProps {
  properties: Property[];
}

interface CategoryValues {
  alquiler: number;
  hipoteca: number;
  comunidad: number;
  ibi: number;
  seguroVida: number;
  seguroHogar: number;
  compras: number;
  averias: number;
  suministros: number;
}

interface ConfirmDialogState {
  open: boolean;
  month?: string;
}

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const HistoricalDataInput: React.FC<HistoricalDataInputProps> = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [categoryValues, setCategoryValues] = useState<CategoryValues>({
    alquiler: 0,
    hipoteca: 0,
    comunidad: 0,
    ibi: 0,
    seguroVida: 0,
    seguroHogar: 0,
    compras: 0,
    averias: 0,
    suministros: 0
  });
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ open: false });

  const { getRecord, getRecordsByPropertyYear, saveRecord } = useHistoricalStorage();
  const [monthlyRecords, setMonthlyRecords] = useState<{ [month: number]: HistoricalRecord }>({});

  // Cargar datos cuando cambia propiedad o año
  useEffect(() => {
    if (selectedProperty && selectedYear) {
      const yearNumber = parseInt(selectedYear);
      const records = getRecordsByPropertyYear(selectedProperty, yearNumber);
      
      const recordsMap: { [month: number]: HistoricalRecord } = {};
      records.forEach(record => {
        recordsMap[record.mes] = record;
      });
      
      setMonthlyRecords(recordsMap);
    } else {
      setMonthlyRecords({});
    }
  }, [selectedProperty, selectedYear, getRecordsByPropertyYear]);

  const handleCategoryChange = (category: keyof CategoryValues, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue < 0) return; // No permitir valores negativos
    
    setCategoryValues(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const validateValues = (): boolean => {
    const hasAnyValue = Object.values(categoryValues).some(value => value > 0);
    if (!hasAnyValue) {
      toast.error('Introduce al menos un valor mayor que 0');
      return false;
    }
    return true;
  };

  const saveDataForMonth = (month: number) => {
    if (!selectedProperty || !selectedYear) return;

    const yearNumber = parseInt(selectedYear);
    const success = saveRecord(selectedProperty, yearNumber, month, categoryValues);
    
    if (success) {
      toast.success(`Datos guardados para ${months[month]}`);
      
      // Actualizar el estado local
      const newRecord = getRecord(selectedProperty, yearNumber, month);
      if (newRecord) {
        setMonthlyRecords(prev => ({
          ...prev,
          [month]: newRecord
        }));
      }
    }
  };

  const handleMonthClick = (month: number) => {
    if (!selectedProperty || !selectedYear) {
      toast.error('Selecciona primero una propiedad y un año');
      return;
    }

    if (!validateValues()) {
      return;
    }

    const existingRecord = monthlyRecords[month];
    
    if (existingRecord) {
      setConfirmDialog({
        open: true,
        month: months[month]
      });
    } else {
      saveDataForMonth(month);
    }
  };

  const onConfirmOverwrite = () => {
    if (confirmDialog.month) {
      const monthIndex = months.indexOf(confirmDialog.month);
      if (monthIndex !== -1) {
        saveDataForMonth(monthIndex);
      }
    }
    setConfirmDialog({ open: false });
  };

  const onCancelOverwrite = () => {
    setConfirmDialog({ open: false });
  };

  const toggleExpanded = (month: number) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toFixed(2);
  };

  const isCalendarEnabled = selectedProperty && selectedYear;

  return (
    <div className="space-y-6">
      {/* Configuración */}
      <HistoricalConfiguration
        properties={properties}
        selectedProperty={selectedProperty}
        selectedYear={selectedYear}
        onPropertyChange={setSelectedProperty}
        onYearChange={setSelectedYear}
      />

      {!isCalendarEnabled && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Selecciona una propiedad y un año para habilitar el calendario.
          </AlertDescription>
        </Alert>
      )}

      {isCalendarEnabled && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna de categorías */}
          <div className="lg:col-span-1">
            <CategoriesInput
              categoryValues={categoryValues}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Calendario */}
          <div className="lg:col-span-2">
            <MonthCalendarGrid
              selectedYear={selectedYear}
              monthlyRecords={monthlyRecords}
              expandedMonth={expandedMonth}
              onMonthClick={handleMonthClick}
              onToggleExpanded={toggleExpanded}
              formatCurrency={formatCurrency}
              isCalendarEnabled={isCalendarEnabled}
            />
          </div>
        </div>
      )}

      {/* Diálogo de confirmación */}
      <AlertDialog 
        open={confirmDialog.open} 
        onOpenChange={(open: boolean) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ya hay datos en {confirmDialog.month} de {selectedYear}</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Quieres sobreescribirlos?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancelOverwrite}>No</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmOverwrite}>
              Sí, sobreescribir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HistoricalDataInput;
