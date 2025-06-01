
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useHistoricalStorage, HistoricalRecord } from '@/hooks/useHistoricalStorage';

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

export const useMonthDataHandler = (
  selectedProperty: string,
  selectedYear: string,
  categoryValues: CategoryValues
) => {
  const [monthlyRecords, setMonthlyRecords] = useState<{ [month: number]: HistoricalRecord }>({});
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ 
    open: false,
    month: undefined
  });
  
  const { getRecord, getRecordsByPropertyYear, saveRecord } = useHistoricalStorage();

  // Load data when property or year changes
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
      
      // Update local state
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
    setConfirmDialog({ open: false, month: undefined });
  };

  const onCancelOverwrite = () => {
    setConfirmDialog({ open: false, month: undefined });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmDialog({ open: false, month: undefined });
    }
  };

  return {
    monthlyRecords,
    confirmDialog,
    handleMonthClick,
    onConfirmOverwrite,
    onCancelOverwrite,
    handleDialogOpenChange
  };
};
