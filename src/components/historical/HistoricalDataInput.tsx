
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useMonthDataHandler } from '@/hooks/useMonthDataHandler';

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
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
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

  const {
    monthlyRecords,
    confirmDialog,
    handleMonthClick,
    onConfirmOverwrite,
    onCancelOverwrite,
    handleDialogOpenChange
  } = useMonthDataHandler(selectedProperty, selectedYear, categoryValues);

  // Generar opciones de años (últimos 5 años + año actual + próximo año)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const categories = [
    { key: 'alquiler', label: 'Alquiler', color: 'bg-green-100 text-green-800' },
    { key: 'hipoteca', label: 'Hipoteca', color: 'bg-red-100 text-red-800' },
    { key: 'comunidad', label: 'Comunidad', color: 'bg-blue-100 text-blue-800' },
    { key: 'ibi', label: 'IBI', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'seguroVida', label: 'Seguro Vida', color: 'bg-purple-100 text-purple-800' },
    { key: 'seguroHogar', label: 'Seguro Hogar', color: 'bg-pink-100 text-pink-800' },
    { key: 'compras', label: 'Compras', color: 'bg-orange-100 text-orange-800' },
    { key: 'averias', label: 'Averías', color: 'bg-red-100 text-red-800' },
    { key: 'suministros', label: 'Suministros', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const handleValueChange = (category: keyof CategoryValues, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setCategoryValues(prev => ({
      ...prev,
      [category]: numericValue
    }));
  };

  const hasData = () => {
    return Object.values(categoryValues).some(value => value > 0);
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
      case 'complete': return 'bg-green-500 hover:bg-green-600';
      case 'partial': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'empty': return 'bg-gray-300 hover:bg-gray-400';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Datos Históricos</CardTitle>
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
              <Label htmlFor="year">Año</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un año" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
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

      {/* Formulario de valores */}
      {selectedProperty && (
        <Card>
          <CardHeader>
            <CardTitle>Valores por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.key} className="space-y-2">
                  <Label htmlFor={category.key}>
                    <Badge className={`mr-2 ${category.color}`}>
                      {category.label}
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
          </CardContent>
        </Card>
      )}

      {/* Calendario de meses */}
      {selectedProperty && hasData() && (
        <Card>
          <CardHeader>
            <CardTitle>Aplicar a Meses - {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {months.map((month, index) => {
                const status = getMonthStatus(index);
                const statusColor = getStatusColor(status);
                
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-20 flex flex-col items-center justify-center ${statusColor} text-white border-none`}
                    onClick={() => handleMonthClick(index)}
                  >
                    <span className="text-sm font-medium">{month}</span>
                    {status && (
                      <span className="text-xs mt-1">
                        {status === 'complete' ? 'Completo' : 
                         status === 'partial' ? 'Parcial' : 'Vacío'}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Completo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Parcial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Vacío</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Nuevo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de confirmación */}
      <Dialog open={confirmDialog.open} onOpenChange={handleDialogOpenChange}>
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
