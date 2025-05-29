
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
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

const categories = [
  { key: 'alquiler', label: 'Alquiler', icon: '🏠', type: 'income' },
  { key: 'hipoteca', label: 'Hipoteca', icon: '🏦', type: 'expense' },
  { key: 'comunidad', label: 'Comunidad', icon: '🏢', type: 'expense' },
  { key: 'ibi', label: 'IBI', icon: '📄', type: 'expense' },
  { key: 'seguroVida', label: 'Seguro de Vida', icon: '💼', type: 'expense' },
  { key: 'seguroHogar', label: 'Seguro de Hogar', icon: '🛡️', type: 'expense' },
  { key: 'compras', label: 'Compras', icon: '🛒', type: 'expense' },
  { key: 'averias', label: 'Averías', icon: '🔧', type: 'expense' },
  { key: 'suministros', label: 'Suministros', icon: '⚡', type: 'expense' }
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
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    month: number;
    monthName: string;
  }>({ open: false, month: -1, monthName: '' });

  const { getRecord, getRecordsByPropertyYear, saveRecord } = useHistoricalStorage();

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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
        month,
        monthName: months[month]
      });
    } else {
      saveDataForMonth(month);
    }
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

  const confirmOverwrite = () => {
    saveDataForMonth(confirmDialog.month);
    setConfirmDialog({ open: false, month: -1, monthName: '' });
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
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Propiedad *</Label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {properties.length > 0 ? (
                    properties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-properties" disabled>
                      No hay propiedades disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Año *</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un año" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <Card>
              <CardHeader>
                <CardTitle>Valores de Categorías</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Introduce los valores y haz clic en un mes para guardar
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map(category => (
                  <div key={category.key} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span className={category.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {category.icon}
                      </span>
                      {category.label}
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={categoryValues[category.key as keyof CategoryValues] || ''}
                      onChange={(e) => handleCategoryChange(category.key as keyof CategoryValues, e.target.value)}
                      placeholder="0.00"
                      className="text-right"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Calendario */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendario {selectedYear}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Haz clic en un mes para aplicar los valores introducidos
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {months.map((monthName, index) => {
                    const record = monthlyRecords[index];
                    const hasData = !!record;

                    return (
                      <div key={index} className="space-y-2">
                        <Button
                          variant="outline"
                          onClick={() => handleMonthClick(index)}
                          className={`h-auto p-4 flex flex-col items-center gap-2 w-full transition-all hover:scale-105 ${
                            hasData ? 'bg-green-50 border-green-300 hover:bg-green-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-medium text-sm">📆 {monthName}</span>
                          {hasData ? (
                            <div className="w-full space-y-1 text-xs">
                              <div className="text-green-600">
                                📈 Ingresos: +{formatCurrency(record.ingresos)}€
                              </div>
                              <div className="text-red-600">
                                📉 Gastos: -{formatCurrency(record.gastos)}€
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500 w-full text-center">
                              Haz clic para guardar datos
                            </div>
                          )}
                        </Button>
                        
                        {hasData && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(index)}
                            className="w-full text-xs"
                          >
                            🔍 Detalles
                            {expandedMonth === index ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                          </Button>
                        )}

                        {expandedMonth === index && hasData && (
                          <div className="p-3 bg-gray-50 rounded-md space-y-1 text-xs">
                            {categories.map(category => {
                              const value = record.categorias[category.key as keyof CategoryValues];
                              if (value > 0) {
                                return (
                                  <div key={category.key} className="flex justify-between">
                                    <span>{category.icon} {category.label}:</span>
                                    <span>{formatCurrency(value)}€</span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ya hay datos en {confirmDialog.monthName} de {selectedYear}</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Quieres sobreescribirlos?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={confirmOverwrite}>
              Sí, sobreescribir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HistoricalDataInput;
