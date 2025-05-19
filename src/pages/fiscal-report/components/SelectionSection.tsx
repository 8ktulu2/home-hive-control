
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle, Search } from 'lucide-react';
import { Property } from '@/types/property';
import { Input } from '@/components/ui/input';

interface SelectionSectionProps {
  properties: Property[];
  selectedPropertyIds: string[];
  availableYears: number[];
  selectedYears: number[];
  onPropertyToggle: (propertyId: string) => void;
  onYearToggle: (year: number) => void;
  onSelectAllProperties: () => void;
  onSelectAllYears: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SelectionSection = ({
  properties,
  selectedPropertyIds,
  availableYears,
  selectedYears,
  onPropertyToggle,
  onYearToggle,
  onSelectAllProperties,
  onSelectAllYears,
  searchQuery,
  onSearchChange
}: SelectionSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Selector de propiedades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Propiedades</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSelectAllProperties}
              className="text-xs h-8"
            >
              {selectedPropertyIds.length === properties.length ? "Deseleccionar todo" : "Seleccionar todo"}
            </Button>
          </div>
          <div className="relative mt-2">
            <Input
              placeholder="Buscar propiedades..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pr-8"
            />
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="max-h-[300px] overflow-y-auto">
          {properties.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No hay propiedades disponibles
            </div>
          ) : (
            <div className="space-y-2">
              {properties.map(property => (
                <div key={property.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`property-${property.id}`}
                    checked={selectedPropertyIds.includes(property.id)}
                    onCheckedChange={() => onPropertyToggle(property.id)}
                  />
                  <Label 
                    htmlFor={`property-${property.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    {property.name}
                  </Label>
                  {selectedPropertyIds.includes(property.id) && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selector de años */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Años Fiscales</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSelectAllYears}
              className="text-xs h-8"
            >
              {selectedYears.length === availableYears.length ? "Deseleccionar todo" : "Seleccionar todo"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableYears.map(year => (
              <div key={year} className="flex items-center space-x-2">
                <Checkbox 
                  id={`year-${year}`}
                  checked={selectedYears.includes(year)}
                  onCheckedChange={() => onYearToggle(year)}
                />
                <Label 
                  htmlFor={`year-${year}`}
                  className="cursor-pointer"
                >
                  {year}
                </Label>
                {selectedYears.includes(year) && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectionSection;
