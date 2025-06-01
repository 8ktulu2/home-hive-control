import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import HistoricalConfiguration from './HistoricalConfiguration';
import CategoriesInput from './CategoriesInput';
import MonthCalendarGrid from './MonthCalendarGrid';
import ConfirmationDialog from './ConfirmationDialog';
import { useMonthDataHandler } from '@/hooks/useMonthDataHandler';

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

  const {
    monthlyRecords,
    confirmDialog,
    handleMonthClick,
    onConfirmOverwrite,
    onCancelOverwrite,
    handleDialogOpenChange
  } = useMonthDataHandler(selectedProperty, selectedYear, categoryValues);

  const handleCategoryChange = (category: keyof CategoryValues, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue < 0) return; // No permitir valores negativos
    
    setCategoryValues(prev => ({
      ...prev,
      [category]: numValue
    }));
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
      <ConfirmationDialog
        open={confirmDialog.open}
        month={confirmDialog.month}
        year={selectedYear}
        onConfirm={onConfirmOverwrite}
        onCancel={onCancelOverwrite}
        onOpenChange={handleDialogOpenChange}
      />
    </div>
  );
};

export default HistoricalDataInput;
