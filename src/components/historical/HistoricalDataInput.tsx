
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { HistoricalEntry } from '@/types/historical';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { historicalCategories } from './historicalCategories';
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

interface HistoricalDataInputProps {
  properties: Property[];
  onSaveData: (entry: Omit<HistoricalEntry, 'id' | 'createdAt' | 'updatedAt' | 'isHistorical'>) => void;
  onUpdateData: (id: string, updates: Partial<HistoricalEntry>) => void;
  existingEntries: HistoricalEntry[];
}

interface CategoryValues {
  [key: string]: number;
}

interface MonthData {
  totalIncome: number;
  totalExpenses: number;
  categories: CategoryValues;
}

const HistoricalDataInput: React.FC<HistoricalDataInputProps> = ({
  properties,
  onSaveData,
  existingEntries
}) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(2020);
  const [categoryValues, setCategoryValues] = useState<CategoryValues>({});
  const [monthlyData, setMonthlyData] = useState<{ [month: number]: MonthData }>({});
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    month: number;
    monthName: string;
  }>({ open: false, month: -1, monthName: '' });

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Load existing data when property or year changes
  useEffect(() => {
    if (selectedProperty && selectedYear) {
      const filteredEntries = existingEntries.filter(
        entry => entry.propertyId === selectedProperty && entry.year === selectedYear
      );
      
      // Reset monthly data
      const newMonthlyData: { [month: number]: MonthData } = {};
      
      // Group entries by month
      for (let month = 0; month < 12; month++) {
        const monthEntries = filteredEntries.filter(entry => entry.month === month);
        
        if (monthEntries.length > 0) {
          const categories: CategoryValues = {};
          let totalIncome = 0;
          let totalExpenses = 0;
          
          monthEntries.forEach(entry => {
            if (entry.amount) {
              const categoryKey = historicalCategories.find(cat => 
                cat.type === entry.type && cat.category === entry.category
              )?.key;
              
              if (categoryKey) {
                categories[categoryKey] = entry.amount;
                
                if (entry.type === 'income') {
                  totalIncome += entry.amount;
                } else {
                  totalExpenses += entry.amount;
                }
              }
            }
          });
          
          newMonthlyData[month] = {
            totalIncome,
            totalExpenses,
            categories
          };
        }
      }
      
      setMonthlyData(newMonthlyData);
    }
  }, [selectedProperty, selectedYear, existingEntries]);

  const handleCategoryChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCategoryValues(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const calculateTotals = (values: CategoryValues) => {
    const income = historicalCategories
      .filter(cat => cat.type === 'income')
      .reduce((sum, cat) => sum + (values[cat.key] || 0), 0);
    
    const expenses = historicalCategories
      .filter(cat => cat.type === 'expense')
      .reduce((sum, cat) => sum + (values[cat.key] || 0), 0);

    return { income, expenses };
  };

  const handleMonthClick = (month: number) => {
    if (!selectedProperty) {
      toast.error('Selecciona primero una propiedad');
      return;
    }

    const hasValues = Object.values(categoryValues).some(value => value > 0);
    if (!hasValues) {
      toast.error('Introduce al menos un valor antes de guardar');
      return;
    }

    // Check if month already has data
    if (monthlyData[month]) {
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
    const property = properties.find(p => p.id === selectedProperty);
    if (!property) return;

    const { income, expenses } = calculateTotals(categoryValues);

    // Save to monthlyData state
    setMonthlyData(prev => ({
      ...prev,
      [month]: {
        totalIncome: income,
        totalExpenses: expenses,
        categories: { ...categoryValues }
      }
    }));

    // Save individual entries to the backend
    historicalCategories.forEach(category => {
      const value = categoryValues[category.key] || 0;
      if (value > 0) {
        onSaveData({
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

    toast.success(`Datos guardados para ${months[month]}: +${income.toFixed(2)}€ / -${expenses.toFixed(2)}€`);
    
    // Clear input values after saving
    setCategoryValues({});
  };

  const confirmOverwrite = () => {
    saveDataForMonth(confirmDialog.month);
    setConfirmDialog({ open: false, month: -1, monthName: '' });
  };

  const formatCurrency = (amount: number): string => {
    return amount.toFixed(2);
  };

  const toggleDetails = (month: number) => {
    setShowDetails(showDetails === month ? null : month);
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
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
          {/* Categories Column */}
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
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
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
                    const hasData = !!monthlyData[index];
                    const data = monthlyData[index];

                    return (
                      <div key={index} className="space-y-2">
                        <Button
                          variant="outline"
                          onClick={() => handleMonthClick(index)}
                          disabled={!selectedProperty}
                          className={`h-auto p-4 flex flex-col items-center gap-2 w-full transition-all hover:scale-105 ${
                            hasData ? 'bg-green-50 border-green-300 hover:bg-green-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-medium text-sm">{monthName}</span>
                          {hasData && (
                            <div className="w-full space-y-1 text-xs">
                              <div className="text-green-600">
                                📈 +{formatCurrency(data.totalIncome)}€
                              </div>
                              <div className="text-red-600">
                                📉 -{formatCurrency(data.totalExpenses)}€
                              </div>
                            </div>
                          )}
                        </Button>
                        
                        {hasData && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDetails(index)}
                            className="w-full text-xs"
                          >
                            🔍 Detalles
                            {showDetails === index ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                          </Button>
                        )}

                        {showDetails === index && hasData && (
                          <div className="p-3 bg-gray-50 rounded-md space-y-1 text-xs">
                            {Object.entries(data.categories).map(([key, value]) => {
                              if (value > 0) {
                                const category = historicalCategories.find(c => c.key === key);
                                return (
                                  <div key={key} className="flex justify-between">
                                    <span>{category?.icon} {category?.label}:</span>
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

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sobrescribir datos existentes</AlertDialogTitle>
            <AlertDialogDescription>
              Ya hay datos guardados para {confirmDialog.monthName}. ¿Quieres sobrescribirlos con los nuevos valores?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmOverwrite}>
              Sí, sobrescribir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HistoricalDataInput;
