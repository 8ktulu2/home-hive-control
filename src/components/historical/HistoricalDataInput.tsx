
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Save, AlertCircle, Search, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useHistoricalStorage, HistoricalRecord } from '@/hooks/useHistoricalStorage';
import { useDataSynchronization } from '@/hooks/useDataSynchronization';

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

interface HistoricalDataInputProps {
  properties: Property[];
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

  const [monthlyRecords, setMonthlyRecords] = useState<{ [month: number]: HistoricalRecord }>({});
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    month: -1
  });

  const { getRecord, saveRecord, deleteRecord, getRecordsByPropertyYear } = useHistoricalStorage();
  const { syncHistoricalToProperty } = useDataSynchronization();

  // Generar años históricos: desde 2022 hasta el año anterior al actual
  const currentYear = new Date().getFullYear();
  const historicalYears = Array.from({ length: currentYear - 2022 }, (_, i) => currentYear - 1 - i);

  // Establecer año por defecto al año anterior
  useEffect(() => {
    if (!selectedYear && historicalYears.length > 0) {
      setSelectedYear(historicalYears[0].toString());
    }
  }, []);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const categories = [
    { key: 'alquiler', label: 'Alquiler', color: 'bg-green-100 text-green-800', icon: '🏠' },
    { key: 'hipoteca', label: 'Hipoteca', color: 'bg-red-100 text-red-800', icon: '🏦' },
    { key: 'comunidad', label: 'Comunidad', color: 'bg-blue-100 text-blue-800', icon: '🏢' },
    { key: 'ibi', label: 'IBI', color: 'bg-yellow-100 text-yellow-800', icon: '📄' },
    { key: 'seguroVida', label: 'Seguro Vida', color: 'bg-purple-100 text-purple-800', icon: '💼' },
    { key: 'seguroHogar', label: 'Seguro Hogar', color: 'bg-pink-100 text-pink-800', icon: '🛡️' },
    { key: 'compras', label: 'Compras', color: 'bg-orange-100 text-orange-800', icon: '🛒' },
    { key: 'averias', label: 'Averías', color: 'bg-red-100 text-red-800', icon: '🔧' },
    { key: 'suministros', label: 'Suministros', color: 'bg-indigo-100 text-indigo-800', icon: '⚡' }
  ];

  // Cargar datos cuando cambian la propiedad o el año
  useEffect(() => {
    if (selectedProperty && selectedYear) {
      loadMonthlyData();
    }
  }, [selectedProperty, selectedYear]);

  const loadMonthlyData = () => {
    if (!selectedProperty || !selectedYear) return;
    
    const year = parseInt(selectedYear);
    const records = getRecordsByPropertyYear(selectedProperty, year);
    
    const monthlyData: { [month: number]: HistoricalRecord } = {};
    records.forEach(record => {
      monthlyData[record.mes] = record;
    });
    
    setMonthlyRecords(monthlyData);
  };

  const handleValueChange = (category: keyof CategoryValues, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setCategoryValues(prev => ({
      ...prev,
      [category]: numericValue
    }));
  };

  const clearValues = () => {
    setCategoryValues({
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
  };

  const hasData = () => {
    return Object.values(categoryValues).some(value => value > 0);
  };

  const handleMonthClick = (monthIndex: number) => {
    if (!hasData()) {
      toast.error('Introduce valores en las categorías antes de aplicar a un mes');
      return;
    }

    const existingRecord = monthlyRecords[monthIndex];
    
    if (existingRecord) {
      // Si ya existe un registro, mostrar diálogo de confirmación
      setConfirmDialog({
        open: true,
        month: monthIndex
      });
    } else {
      // Si no existe, crear directamente
      saveMonthData(monthIndex);
    }
  };

  const saveMonthData = (month: number) => {
    if (!selectedProperty || !selectedYear) return;
    
    const year = parseInt(selectedYear);
    
    const success = saveRecord(selectedProperty, year, month, categoryValues);
    
    if (success) {
      // Recargar datos
      loadMonthlyData();
      
      // Sincronizar con propiedades si hay ingresos de alquiler
      if (categoryValues.alquiler > 0) {
        syncHistoricalToProperty(selectedProperty, year, month);
      }
      
      toast.success(`Datos guardados para ${months[month]} ${year}`);
      clearValues();
    } else {
      toast.error('Error al guardar los datos');
    }
  };

  const handleDeleteMonth = (month: number) => {
    if (!selectedProperty || !selectedYear) return;
    
    const year = parseInt(selectedYear);
    const success = deleteRecord(selectedProperty, year, month);
    
    if (success) {
      loadMonthlyData();
      toast.success(`Datos eliminados para ${months[month]} ${year}`);
    } else {
      toast.error('Error al eliminar los datos');
    }
  };

  const onConfirmOverwrite = () => {
    saveMonthData(confirmDialog.month);
    setConfirmDialog({ open: false, month: -1 });
  };

  const onCancelOverwrite = () => {
    setConfirmDialog({ open: false, month: -1 });
  };

  const toggleExpandMonth = (month: number) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getMonthStatus = (monthIndex: number) => {
    const record = monthlyRecords[monthIndex];
    if (!record) return null;

    const hasIncome = record.ingresos > 0;
    const hasExpenses = record.gastos > 0;

    if (hasIncome && hasExpenses) return 'complete';
    if (hasIncome || hasExpenses) return 'partial';
    return 'empty';
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'complete': return 'bg-green-500 hover:bg-green-600 text-white';
      case 'partial': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'empty': return 'bg-gray-300 hover:bg-gray-400 text-gray-700';
      default: return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  const isCalendarEnabled = selectedProperty && hasData();

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Datos Históricos</CardTitle>
          <p className="text-sm text-muted-foreground">
            Gestiona datos de años anteriores (2022 - {currentYear - 1})
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property">Propiedad</Label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Año Histórico</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un año" />
                </SelectTrigger>
                <SelectContent>
                  {historicalYears.map((year) => (
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

      {/* Formulario de valores por categoría */}
      {selectedProperty && selectedYear && (
        <Card>
          <CardHeader>
            <CardTitle>Valores por Categoría</CardTitle>
            <p className="text-sm text-muted-foreground">
              Introduce los valores y luego aplícalos a los meses deseados
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {categories.map((category) => (
                <div key={category.key} className="space-y-2">
                  <Label htmlFor={category.key}>
                    <Badge className={`mr-2 ${category.color}`}>
                      {category.icon} {category.label}
                    </Badge>
                  </Label>
                  <Input
                    id={category.key}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={categoryValues[category.key as keyof CategoryValues] || ''}
                    onChange={(e) => handleValueChange(category.key as keyof CategoryValues, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearValues}>
                Limpiar Valores
              </Button>
              <div className="text-sm text-muted-foreground flex items-center">
                {hasData() ? 
                  '✅ Valores listos para aplicar a los meses' : 
                  '⚠️ Introduce valores para continuar'
                }
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendario de meses */}
      {selectedProperty && selectedYear && (
        <Card>
          <CardHeader>
            <CardTitle>Calendario {selectedYear}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Haz clic en un mes para aplicar los valores introducidos
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {months.map((monthName, index) => {
                const record = monthlyRecords[index];
                const hasRecord = !!record;
                const status = getMonthStatus(index);
                const statusColor = getStatusColor(status);

                return (
                  <div key={index} className="space-y-1">
                    <Button
                      variant="outline"
                      onClick={() => handleMonthClick(index)}
                      disabled={!isCalendarEnabled}
                      className={`h-auto p-3 flex flex-col items-center gap-2 w-full transition-all hover:scale-105 ${statusColor} border-none`}
                    >
                      <span className="font-medium text-sm">📆 {monthName}</span>
                      {hasRecord ? (
                        <div className="w-full space-y-1 text-xs">
                          <div className="text-green-200">
                            📈 +{formatCurrency(record.ingresos)}€
                          </div>
                          <div className="text-red-200">
                            📉 -{formatCurrency(record.gastos)}€
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs opacity-75 w-full text-center">
                          {isCalendarEnabled ? 'Clic para guardar' : 'Introduce valores'}
                        </div>
                      )}
                    </Button>
                    
                    {hasRecord && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpandMonth(index)}
                          className="flex-1 text-xs p-1 h-7"
                        >
                          <Search className="h-3 w-3 mr-1" />
                          {expandedMonth === index ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMonth(index)}
                          className="text-xs p-1 h-7 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {expandedMonth === index && hasRecord && (
                      <div className="p-3 bg-gray-50 rounded-md space-y-2 text-xs border">
                        <div className="font-medium text-gray-800 border-b pb-1">
                          Detalle de {monthName} {selectedYear}
                        </div>
                        {categories.map(category => {
                          const value = record.categorias[category.key as keyof typeof record.categorias];
                          if (value > 0) {
                            return (
                              <div key={category.key} className="flex justify-between items-center">
                                <span className="flex items-center gap-1">
                                  <span>{category.icon}</span>
                                  <span>{category.label}:</span>
                                </span>
                                <span className="font-medium">{formatCurrency(value)}€</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Balance:</span>
                          <span className={record.ingresos - record.gastos >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(record.ingresos - record.gastos)}€
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Completo (ingresos + gastos)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Parcial (solo ingresos o gastos)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Vacío</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Nuevo (sin datos)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de confirmación */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && onCancelOverwrite()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Confirmar Sobrescritura
            </DialogTitle>
            <DialogDescription>
              Ya existen datos para {confirmDialog.month >= 0 ? months[confirmDialog.month] : ''} de {selectedYear}. 
              ¿Deseas sobrescribir los datos existentes?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={onCancelOverwrite}>
              Cancelar
            </Button>
            <Button onClick={onConfirmOverwrite} className="bg-yellow-500 hover:bg-yellow-600">
              Sobrescribir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoricalDataInput;
