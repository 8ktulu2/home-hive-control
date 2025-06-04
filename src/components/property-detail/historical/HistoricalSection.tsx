
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';

interface HistoricalSectionProps {
  property: Property;
  onYearSelect: (year: number) => void;
}

const HistoricalSection: React.FC<HistoricalSectionProps> = ({ property, onYearSelect }) => {
  const { getAvailableYears } = useHistoricalStorage();
  
  const currentYear = new Date().getFullYear();
  const availableYears = getAvailableYears().filter(year => year < currentYear);
  
  // Generate years from 2022 to previous year
  const historicalYears = Array.from(
    { length: currentYear - 2022 }, 
    (_, i) => currentYear - 1 - i
  );

  const handleAddYear = () => {
    // Add the most recent available year for editing
    const yearToAdd = currentYear - 1;
    onYearSelect(yearToAdd);
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg mb-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Histórico:</span>
        <div className="flex items-center gap-2">
          {historicalYears.map((year) => {
            const hasData = availableYears.includes(year);
            return (
              <Button
                key={year}
                onClick={() => onYearSelect(year)}
                variant="ghost"
                size="sm"
                className={`h-8 px-3 text-xs ${
                  hasData 
                    ? 'text-blue-700 hover:bg-blue-100 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {year}
              </Button>
            );
          })}
        </div>
      </div>
      
      <Button 
        onClick={handleAddYear}
        variant="outline"
        size="sm" 
        className="flex items-center gap-1 h-8 px-3 text-xs"
      >
        <Plus className="h-3 w-3" />
        Agregar Año
      </Button>
    </div>
  );
};

export default HistoricalSection;
