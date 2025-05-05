
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import YearNavigator from './YearNavigator';
import PropertySelector from './PropertySelector';
import { Property } from '@/types/property';

interface HistoricalHeaderProps {
  properties: Property[];
  selectedYear: number;
  onPreviousYear: () => void;
  onNextYear: () => void;
  selectedProperty: string;
  onPropertyChange: (value: string) => void;
}

const HistoricalHeader = ({
  properties,
  selectedYear,
  onPreviousYear,
  onNextYear,
  selectedProperty,
  onPropertyChange
}: HistoricalHeaderProps) => {
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <YearNavigator
          selectedYear={selectedYear}
          onPreviousYear={onPreviousYear}
          onNextYear={onNextYear}
        />
        <PropertySelector
          properties={properties}
          selectedProperty={selectedProperty}
          onPropertyChange={onPropertyChange}
        />
      </div>
      
      <Badge className="bg-[#8B5CF6] text-white hover:bg-[#7048e8]">
        <FileText className="h-4 w-4 mr-1" /> Datos para Declaración Fiscal
      </Badge>
    </div>
  );
};

export default HistoricalHeader;
