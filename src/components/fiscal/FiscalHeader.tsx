
import React from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, Calculator } from 'lucide-react';

interface FiscalHeaderProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
  properties: Property[];
  selectedPropertyId: string;
  setSelectedPropertyId: (id: string) => void;
  onShowHelp: () => void;
}

const FiscalHeader: React.FC<FiscalHeaderProps> = ({
  selectedYear,
  setSelectedYear,
  availableYears,
  properties,
  selectedPropertyId,
  setSelectedPropertyId,
  onShowHelp
}) => {
  return (
    <div className="fixed top-16 left-0 right-0 bg-white border-b shadow-sm z-30">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Title and Help Button */}
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-blue-600" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Informe Fiscal</h1>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onShowHelp}
                className="h-8 w-8 p-0 rounded-full"
              >
                <HelpCircle className="h-4 w-4 text-blue-600" />
              </Button>
            </div>
          </div>
          
          {/* Selectors */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            {/* Year Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Ejercicio:
              </label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Property Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Propiedad:
              </label>
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las propiedades</SelectItem>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiscalHeader;
