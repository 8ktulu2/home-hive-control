
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Plus, Calendar } from 'lucide-react';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import HistoricalYearView from './HistoricalYearView';

interface HistoricalSectionProps {
  property: Property;
}

const HistoricalSection: React.FC<HistoricalSectionProps> = ({ property }) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { getAvailableYears } = useHistoricalStorage();
  
  const currentYear = new Date().getFullYear();
  const availableYears = getAvailableYears().filter(year => year < currentYear);
  
  // Generate years from 2022 to previous year
  const historicalYears = Array.from(
    { length: currentYear - 2022 }, 
    (_, i) => currentYear - 1 - i
  );

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
  };

  const handleBackToYears = () => {
    setSelectedYear(null);
  };

  const handleAddYear = () => {
    // For now, we'll show the most recent available year for editing
    const yearToAdd = Math.max(...historicalYears);
    setSelectedYear(yearToAdd);
  };

  if (selectedYear) {
    return (
      <HistoricalYearView 
        property={property}
        year={selectedYear}
        onBack={handleBackToYears}
      />
    );
  }

  return (
    <Card className="w-full border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
          <History className="h-5 w-5" />
          Histórico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-amber-700">
              Gestiona los datos históricos de esta propiedad por año
            </p>
            <Button 
              onClick={handleAddYear}
              size="sm" 
              variant="outline"
              className="flex items-center gap-1 border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <Plus className="h-4 w-4" />
              Agregar Año
            </Button>
          </div>

          {historicalYears.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {historicalYears.map((year) => {
                const hasData = availableYears.includes(year);
                return (
                  <Button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    variant="outline"
                    className={`h-12 flex flex-col items-center justify-center space-y-1 ${
                      hasData 
                        ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100' 
                        : 'border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">{year}</span>
                    {hasData && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-600">
                        Con datos
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">No hay años históricos disponibles</p>
              <p className="text-xs text-gray-400 mt-1">
                Los años históricos aparecerán cuando el año actual termine
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalSection;
