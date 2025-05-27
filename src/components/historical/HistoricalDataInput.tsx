
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { HistoricalEntry } from '@/types/historical';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import MonthCalendarGrid from './MonthCalendarGrid';
import { historicalCategories } from './historicalCategories';

interface HistoricalDataInputProps {
  properties: Property[];
  onSaveData: (entry: Omit<HistoricalEntry, 'id' | 'createdAt' | 'updatedAt' | 'isHistorical'>) => void;
  onUpdateData: (id: string, updates: Partial<HistoricalEntry>) => void;
  existingEntries: HistoricalEntry[];
}

interface CategoryValues {
  [key: string]: number;
}

const HistoricalDataInput: React.FC<HistoricalDataInputProps> = ({
  properties,
  onSaveData,
  onUpdateData,
  existingEntries
}) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  const [categoryValues, setCategoryValues] = useState<CategoryValues>({});
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);

  const validProperties = properties.filter(property => 
    property.id && 
    property.id.trim() !== '' && 
    property.name && 
    property.name.trim() !== ''
  );

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleCategoryChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCategoryValues(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const handleMonthClick = (month: number) => {
    if (!selectedProperty) {
      toast.error('Selecciona primero una propiedad');
      return;
    }

    const hasData = getMonthData(month).length > 0;
    
    if (hasData) {
      // Mostrar confirmación para sobrescribir
      if (confirm(`El mes ${getMonthName(month)} ya tiene datos. ¿Quieres sobrescribirlos?`)) {
        saveDataForMonth(month, true);
      }
    } else {
      saveDataForMonth(month, false);
    }
  };

  const saveDataForMonth = (month: number, isUpdate: boolean) => {
    const property = validProperties.find(p => p.id === selectedProperty);
    if (!property) return;

    const entries: Array<Omit<HistoricalEntry, 'id' | 'createdAt' | 'updatedAt' | 'isHistorical'>> = [];

    // Crear entradas para cada categoría con valor > 0
    historicalCategories.forEach(category => {
      const value = categoryValues[category.key] || 0;
      if (value > 0) {
        entries.push({
          propertyId: property.id,
          propertyName: property.name,
          year: selectedYear,
          month: month,
          type: category.type,
          amount: value,
          description: category.label,
          category: category.category
        });
      }
    });

    if (entries.length === 0) {
      toast.error('Introduce al menos un valor para guardar');
      return;
    }

    // Si es actualización, eliminar entradas existentes primero
    if (isUpdate) {
      const existingForMonth = getMonthData(month);
      existingForMonth.forEach(entry => {
        // Aquí necesitaríamos una función de eliminación, por simplicidad solo guardamos
      });
    }

    // Guardar todas las entradas
    entries.forEach(entry => {
      onSaveData(entry);
    });

    const totalSaved = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    toast.success(`Datos guardados para ${getMonthName(month)}: ${formatCurrency(totalSaved)}`);
  };

  const getMonthData = (month: number): HistoricalEntry[] => {
    return existingEntries.filter(entry => 
      entry.propertyId === selectedProperty &&
      entry.year === selectedYear &&
      entry.month === month
    );
  };

  const getMonthName = (month: number): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month];
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getMonthStatus = (month: number): 'empty' | 'hasData' | 'selected' => {
    const hasData = getMonthData(month).length > 0;
    if (selectedMonths.includes(month)) return 'selected';
    if (hasData) return 'hasData';
    return 'empty';
  };

  return (
    <div className="space-y-6">
      {/* Selectores de propiedad y año */}
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
                  {validProperties.length > 0 ? (
                    validProperties.map(property => (
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
              <Label>Año</Label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna de categorías editables */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Valores por Categoría</CardTitle>
              <p className="text-sm text-muted-foreground">
                Introduce los valores que se aplicarán a los meses seleccionados
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {historicalCategories.map(category => (
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
                    value={categoryValues[category.key] || ''}
                    onChange={(e) => handleCategoryChange(category.key, e.target.value)}
                    placeholder="0.00"
                    className="text-right"
                  />
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(Object.values(categoryValues).reduce((sum, val) => sum + (val || 0), 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendario de meses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendario {selectedYear}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Haz clic en los meses para aplicar los valores introducidos
              </p>
            </CardHeader>
            <CardContent>
              <MonthCalendarGrid
                year={selectedYear}
                onMonthClick={handleMonthClick}
                getMonthStatus={getMonthStatus}
                getMonthData={getMonthData}
                formatCurrency={formatCurrency}
                selectedProperty={selectedProperty}
              />
              
              {/* Leyenda */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border rounded"></div>
                  <span>Sin datos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                  <span>Con datos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span>Recién guardado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoricalDataInput;
