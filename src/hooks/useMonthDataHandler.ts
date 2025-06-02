
import { useState, useEffect } from 'react';
import { useHistoricalStorage, HistoricalRecord } from './useHistoricalStorage';
import { useDataSynchronization } from './useDataSynchronization';
import { toast } from 'sonner';

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

export const useMonthDataHandler = (
  selectedProperty: string,
  selectedYear: string,
  categoryValues: CategoryValues
) => {
  const [monthlyRecords, setMonthlyRecords] = useState<(HistoricalRecord | null)[]>(
    Array(12).fill(null)
  );
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    month: -1
  });

  const { getRecord, saveRecord } = useHistoricalStorage();
  const { syncHistoricalToProperty } = useDataSynchronization();

  // Cargar datos cuando cambian la propiedad o el año
  useEffect(() => {
    if (selectedProperty && selectedYear) {
      loadMonthlyData();
    }
  }, [selectedProperty, selectedYear]);

  const loadMonthlyData = () => {
    const year = parseInt(selectedYear);
    const newMonthlyRecords = Array(12).fill(null).map((_, index) => {
      return getRecord(selectedProperty, year, index);
    });
    setMonthlyRecords(newMonthlyRecords);
  };

  const handleMonthClick = (month: number) => {
    const existingRecord = monthlyRecords[month];
    
    if (existingRecord) {
      // Si ya existe un registro, mostrar diálogo de confirmación
      setConfirmDialog({
        open: true,
        month
      });
    } else {
      // Si no existe, crear directamente
      saveMonthData(month);
    }
  };

  const saveMonthData = (month: number) => {
    const year = parseInt(selectedYear);
    
    const success = saveRecord(selectedProperty, year, month, categoryValues);
    
    if (success) {
      // Recargar datos
      loadMonthlyData();
      
      // Sincronizar con propiedades si hay ingresos de alquiler
      if (categoryValues.alquiler > 0) {
        syncHistoricalToProperty(selectedProperty, year, month);
      }
      
      toast.success(`Datos guardados para ${getMonthName(month)} ${year}`);
    } else {
      toast.error('Error al guardar los datos');
    }
  };

  const onConfirmOverwrite = () => {
    saveMonthData(confirmDialog.month);
    setConfirmDialog({ open: false, month: -1 });
  };

  const onCancelOverwrite = () => {
    setConfirmDialog({ open: false, month: -1 });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmDialog({ open: false, month: -1 });
    }
  };

  const getMonthName = (month: number): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month];
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
