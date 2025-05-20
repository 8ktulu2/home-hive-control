
import React from 'react';
import { Property } from '@/types/property';
import { Separator } from '@/components/ui/separator';

interface SelectionSummaryProps {
  properties: Property[];
  selectedPropertyIds: string[];
  selectedYears: number[];
}

const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  properties,
  selectedPropertyIds,
  selectedYears,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Propiedades seleccionadas ({selectedPropertyIds.length}):</h3>
          {selectedPropertyIds.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay propiedades seleccionadas</p>
          ) : (
            <ul className="list-disc list-inside text-sm">
              {selectedPropertyIds.map(id => {
                const property = properties.find(p => p.id === id);
                return property ? (
                  <li key={id}>{property.name}</li>
                ) : null;
              })}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Años seleccionados ({selectedYears.length}):</h3>
          {selectedYears.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay años seleccionados</p>
          ) : (
            <ul className="list-disc list-inside text-sm">
              {selectedYears.map(year => (
                <li key={year}>{year}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Separator />
    </div>
  );
};

export default SelectionSummary;
