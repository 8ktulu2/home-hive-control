
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Save, AlertCircle, Search, ChevronDown, ChevronUp, Trash2, Euro } from 'lucide-react';
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

  // Dividir categorías en dos columnas para mejor visualización
  const categoriesColumn1 = [
    { key: 'alquiler', label: 'Alquiler', color: 'bg-green-100 text-green-800', icon: '🏠' },
    { key: 'hipoteca', label: 'Hipoteca', color: 'bg-red-100 text-red-800', icon: '🏦' },
    { key: 'comunidad', label: 'Comunidad', color: 'bg-blue-100 text-blue-800', icon: '🏢' },
    { key: 'ibi', label: 'IBI', color: 'bg-yellow-100 text-yellow-800', icon: '📄' },
    { key: 'seguroVida', label: 'Seguro Vida', color: 'bg-purple-100 text-purple-800', icon: '💼' }
  ];

  const categoriesColumn2 = [
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
      toast.error('Introduce valores en las categorías antes de aplicar a un mes', {
        description: 'Rellena al menos una categoría con un valor mayor a 0'
      });
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
      
      toast.success(`Datos guardados para ${months[month]} ${year}`, {
        description: 'Los datos se han sincronizado correctamente'
      });
      
      // Mantener los valores para permitir aplicar a múltiples meses
      // clearValues(); - Comentado para mantener valores temporalmente
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
      case 'complete': return 'bg-green-500 hover:bg-green-600 text-white shadow-lg';
      case 'partial': return 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md';
      case 'empty': return 'bg-gray-300 hover:bg-gray-400 text-gray-700 shadow-sm';
      default: return 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all';
    }
  };

  const isCalendarEnabled = selectedProperty && hasData();

  return (
    <div className="space-y-6">
      {/* Filtros mejorados */}
      <Card className="border-2 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-blue-800">⚙️ Configuración de Datos Históricos</CardTitle>
          <p className="text-sm text-blue-600">
            Gestiona datos de años anteriores ({historicalYears[historicalYears.length - 1]} - {historicalYears[0]})
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="property" className="text-gray-700 font-medium">🏠 Propiedad</Label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="border-2 hover:border-blue-300 transition-colors">
                  <SelectValue placeholder="Selecciona una propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      🏠 {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-gray-700 font-medium">📅 Año Histórico</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="border-2 hover:border-blue-300 transition-colors">
                  <SelectValue placeholder="Selecciona un año" />
                </SelectTrigger>
                <SelectContent>
                  {historicalYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      📅 {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de valores por categoría mejorado con dos columnas */}
      {selectedProperty && selectedYear && (
        <Card className="border-2 border-green-100">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-green-800">💰 Valores por Categoría</CardTitle>
            <p className="text-sm text-green-600">
              Introduce los valores y luego aplícalos a los meses deseados haciendo clic en el calendario
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              {/* Columna 1: Ingresos y Gastos Principales */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">📊 Ingresos y Gastos Principales</h3>
                {categoriesColumn1.map((category) => (
                  <div key={category.key} className="space-y-2">
                    <Label htmlFor={category.key} className="flex items-center gap-2">
                      <Badge className={`${category.color} text-xs px-2 py-1`}>
                        {category.icon} {category.label}
                      </Badge>
                    </Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id={category.key}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={categoryValues[category.key as keyof CategoryValues] || ''}
                        onChange={(e) => handleValueChange(category.key as keyof CategoryValues, e.target.value)}
                        className="pl-10 border-2 hover:border-green-300 focus:border-green-500 transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Columna 2: Seguros y Otros Gastos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">🛡️ Seguros y Otros Gastos</h3>
                {categoriesColumn2.map((category) => (
                  <div key={category.key} className="space-y-2">
                    <Label htmlFor={category.key} className="flex items-center gap-2">
                      <Badge className={`${category.color} text-xs px-2 py-1`}>
                        {category.icon} {category.label}
                      </Badge>
                    </Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id={category.key}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={categoryValues[category.key as keyof CategoryValues] || ''}
                        onChange={(e) => handleValueChange(category.key as keyof CategoryValues, e.target.value)}
                        className="pl-10 border-2 hover:border-green-300 focus:border-green-500 transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 items-center p-4 bg-gray-50 rounded-lg">
              <Button variant="outline" onClick={clearValues} className="hover:bg-red-50 hover:border-red-200">
                🗑️ Limpiar Valores
              </Button>
              <div className="text-sm flex items-center gap-2">
                {hasData() ? (
                  <span className="text-green-600 font-medium">✅ Valores listos para aplicar a los meses</span>
                ) : (
                  <span className="text-amber-600 font-medium">⚠️ Introduce valores para continuar</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendario de meses mejorado */}
      {selectedProperty && selectedYear && (
        <Card className="border-2 border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-purple-800">📅 Calendario {selectedYear}</CardTitle>
            <p className="text-sm text-purple-600">
              Haz clic en un mes para aplicar los valores introducidos. Los valores se mantienen para aplicar a múltiples meses.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {months.map((monthName, index) => {
                const record = monthlyRecords[index];
                const hasRecord = !!record;
                const status = getMonthStatus(index);
                const statusColor = getStatusColor(status);

                return (
                  <div key={index} className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => handleMonthClick(index)}
                      disabled={!isCalendarEnabled}
                      className={`h-auto p-4 flex flex-col items-center gap-3 w-full transition-all duration-200 hover:scale-105 ${statusColor} border-2`}
                    >
                      <span className="font-bold text-base">📆 {monthName}</span>
                      {hasRecord ? (
                        <div className="w-full space-y-2 text-xs">
                          <div className="bg-white/20 rounded p-2">
                            <div className="text-green-100 font-medium">
                              💰 +{formatCurrency(record.ingresos)}€
                            </div>
                            <div className="text-red-100 font-medium">
                              💸 -{formatCurrency(record.gastos)}€
                            </div>
                            <div className="text-white font-bold border-t border-white/30 pt-1 mt-1">
                              💼 {formatCurrency(record.ingresos - record.gastos)}€
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs opacity-75 w-full text-center bg-white/20 rounded p-2">
                          {isCalendarEnabled ? '👆 Clic para guardar' : '⚠️ Introduce valores'}
                        </div>
                      )}
                    </Button>
                    
                    {hasRecord && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpandMonth(index)}
                          className="flex-1 text-xs p-2 h-8 hover:bg-blue-50"
                        >
                          <Search className="h-3 w-3 mr-1" />
                          {expandedMonth === index ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMonth(index)}
                          className="text-xs p-2 h-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {expandedMonth === index && hasRecord && (
                      <div className="p-4 bg-white border-2 border-blue-200 rounded-lg shadow-lg space-y-3 text-sm">
                        <div className="font-bold text-blue-800 border-b border-blue-200 pb-2 text-center">
                          📊 Detalle de {monthName} {selectedYear}
                        </div>
                        <div className="space-y-2">
                          {[...categoriesColumn1, ...categoriesColumn2].map(category => {
                            const value = record.categorias[category.key as keyof typeof record.categorias];
                            if (value > 0) {
                              return (
                                <div key={category.key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                  <span className="flex items-center gap-2">
                                    <Badge className={`${category.color} text-xs px-2 py-1`}>
                                      {category.icon} {category.label}
                                    </Badge>
                                  </span>
                                  <span className="font-bold text-blue-600">{formatCurrency(value)}€</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                          <span>💰 Balance Final:</span>
                          <span className={`${record.ingresos - record.gastos >= 0 ? 'text-green-600' : 'text-red-600'} text-xl`}>
                            {formatCurrency(record.ingresos - record.gastos)}€
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="font-medium text-green-800">Completo</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="font-medium text-yellow-800">Parcial</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="font-medium text-gray-600">Vacío</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="font-medium text-blue-800">Nuevo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de confirmación mejorado */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && onCancelOverwrite()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Confirmar Sobrescritura
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Ya existen datos para <strong>{confirmDialog.month >= 0 ? months[confirmDialog.month] : ''}</strong> de <strong>{selectedYear}</strong>. 
              <br />
              ¿Deseas sobrescribir los datos existentes con los nuevos valores?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onCancelOverwrite} className="hover:bg-gray-50">
              ❌ Cancelar
            </Button>
            <Button onClick={onConfirmOverwrite} className="bg-amber-500 hover:bg-amber-600 text-white">
              ✅ Sobrescribir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoricalDataInput;
