
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { HistoricalEntry } from '@/types/historical';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
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

    const existingDataForMonth = getMonthData(month);
    
    if (existingDataForMonth.length > 0) {
      // Mostrar confirmación para sobrescribir
      const shouldOverwrite = confirm(`El mes ${getMonthName(month)} ya tiene datos. ¿Deseas sobrescribirlos?`);
      if (!shouldOverwrite) {
        return;
      }
    }

    saveDataForMonth(month);
  };

  const saveDataForMonth = (month: number) => {
    const property = properties.find(p => p.id === selectedProperty);
    if (!property) return;

    // Verificar que hay al menos un valor
    const hasAnyValue = Object.values(categoryValues).some(value => value > 0);
    if (!hasAnyValue) {
      toast.error('Introduce al menos un valor para guardar');
      return;
    }

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

    // Guardar todas las entradas
    entries.forEach(entry => {
      onSaveData(entry);
    });

    const totalAmount = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    const incomeTotal = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + (e.amount || 0), 0);
    const expenseTotal = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + (e.amount || 0), 0);
    
    toast.success(
      `Datos guardados para ${getMonthName(month)}: +${formatCurrency(incomeTotal)} / -${formatCurrency(expenseTotal)}`
    );
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

  const getMonthStatus = (month: number): 'empty' | 'hasData' => {
    const hasData = getMonthData(month).length > 0;
    return hasData ? 'hasData' : 'empty';
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

      {!selectedProperty && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Selecciona una propiedad para comenzar a introducir datos históricos.
          </AlertDescription>
        </Alert>
      )}

      {selectedProperty && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna de categorías editables */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Valores de Categorías</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Introduce los valores y haz clic en un mes para guardar
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
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600">Ingresos:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          historicalCategories
                            .filter(cat => cat.type === 'income')
                            .reduce((sum, cat) => sum + (categoryValues[cat.key] || 0), 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-red-600">Gastos:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          historicalCategories
                            .filter(cat => cat.type === 'expense')
                            .reduce((sum, cat) => sum + (categoryValues[cat.key] || 0), 0)
                        )}
                      </span>
                    </div>
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
                  Haz clic en un mes para aplicar los valores introducidos
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
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalDataInput;
