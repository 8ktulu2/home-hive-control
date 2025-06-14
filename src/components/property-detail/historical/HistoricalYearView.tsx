
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Check, Calendar, Euro } from 'lucide-react';
import { useHistoricalStorage, HistoricalRecord } from '@/hooks/useHistoricalStorage';
import { toast } from 'sonner';

interface HistoricalYearViewProps {
  property: Property;
  year: number;
  onBack: () => void;
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

const HistoricalYearView: React.FC<HistoricalYearViewProps> = ({ 
  property, 
  year, 
  onBack 
}) => {
  const [categoryValues, setCategoryValues] = useState<CategoryValues>({
    alquiler: property.rent || 0,
    hipoteca: property.mortgage?.monthlyPayment || 0,
    comunidad: property.communityFee || 0,
    ibi: (property.ibi || 0) / 12,
    seguroVida: (property.lifeInsurance?.cost || 0) / 12,
    seguroHogar: (property.homeInsurance?.cost || 0) / 12,
    compras: 0,
    averias: 0,
    suministros: 0
  });

  const [monthlyRecords, setMonthlyRecords] = useState<(HistoricalRecord | null)[]>(
    Array(12).fill(null)
  );
  
  const { getRecord, saveRecord, getRecordsByPropertyYear } = useHistoricalStorage();

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

  useEffect(() => {
    loadMonthlyData();
  }, [property.id, year]);

  const loadMonthlyData = () => {
    console.log('Loading monthly data for property:', property.id, 'year:', year);
    const records = getRecordsByPropertyYear(property.id, year);
    console.log('Found records:', records);
    const newMonthlyRecords = Array(12).fill(null).map((_, index) => {
      return records.find(r => r.mes === index) || null;
    });
    setMonthlyRecords(newMonthlyRecords);
  };

  const handleCategoryChange = (category: keyof CategoryValues, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCategoryValues(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const handleMonthClick = (monthIndex: number) => {
    console.log('Saving record for month:', monthIndex, 'with values:', categoryValues);
    const success = saveRecord(property.id, year, monthIndex, categoryValues);
    if (success) {
      loadMonthlyData();
      toast.success(`Datos guardados para ${months[monthIndex]} ${year}`);
    } else {
      toast.error('Error al guardar los datos');
    }
  };

  const usePresetValues = (category: keyof CategoryValues) => {
    // This would copy the preset value - for now, it's already set
    toast.info(`Valor predeterminado aplicado para ${categories.find(c => c.key === category)?.label}`);
  };

  return (
    <div className="space-y-6" style={{ 
      background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
      minHeight: '100vh',
      margin: '-1rem',
      padding: '1rem'
    }}>
      {/* Header */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
              <CardTitle className="text-xl text-amber-800">
                {property.name} - Histórico {year}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              Modo Histórico
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">
                Datos Mensuales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category) => (
                <div key={category.key} className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">
                    {category.icon} {category.label}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={categoryValues[category.key as keyof CategoryValues]}
                      onChange={(e) => handleCategoryChange(category.key as keyof CategoryValues, e.target.value)}
                      className="flex-1"
                      placeholder="0.00"
                    />
                    <Button
                      onClick={() => usePresetValues(category.key as keyof CategoryValues)}
                      size="sm"
                      variant="outline"
                      className="px-3 text-green-600 border-green-300 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendario {year}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {months.map((month, index) => {
                  const record = monthlyRecords[index];
                  const hasData = record !== null;
                  const hasIncome = record?.ingresos > 0;
                  
                  return (
                    <Button
                      key={month}
                      onClick={() => handleMonthClick(index)}
                      variant="outline"
                      className={`h-20 flex flex-col items-center justify-center space-y-1 transition-all ${
                        hasData 
                          ? hasIncome
                            ? 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100'
                            : 'border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100'
                          : 'border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-sm font-medium">{month}</span>
                      {hasData && (
                        <div className="text-xs space-y-1">
                          {record.ingresos > 0 && (
                            <div className="flex items-center gap-1">
                              <Euro className="h-3 w-3" />
                              <span>{record.ingresos.toFixed(0)}</span>
                            </div>
                          )}
                          {record.gastos > 0 && (
                            <div className="text-xs opacity-75">
                              G: {record.gastos.toFixed(0)}
                            </div>
                          )}
                        </div>
                      )}
                      {!hasData && (
                        <div className="text-xs text-gray-400">
                          Clic para guardar
                        </div>
                      )}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoricalYearView;
