
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Property } from '@/types/property';

interface HistoricalHeaderProps {
  property: Property;
  year: number;
  onBack: () => void;
}

const HistoricalHeader: React.FC<HistoricalHeaderProps> = ({ 
  property, 
  year, 
  onBack 
}) => {
  return (
    <div className="flex items-center gap-3 mb-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg p-2 shadow-md">
      <Button
        onClick={onBack}
        variant="outline"
        size="sm"
        className="border-yellow-400 text-yellow-800 hover:bg-yellow-200 font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Actual
      </Button>
      <div className="flex items-center gap-2 text-sm overflow-hidden">
        <span className="font-bold text-yellow-900 bg-yellow-200 px-2 py-1 rounded whitespace-nowrap">
          Histórico: {year}
        </span>
        <span className="text-yellow-700">|</span>
        <span className="font-medium text-yellow-800 truncate">{property.name}</span>
      </div>
    </div>
  );
};

export default HistoricalHeader;
