
import React from 'react';
import { Property } from '@/types/property';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertySelectorProps {
  value: string;
  onChange: (value: string) => void;
  properties: Property[];
  error?: string;
}

const PropertySelector: React.FC<PropertySelectorProps> = ({
  value,
  onChange,
  properties,
  error
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="property">Propiedad *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona una propiedad" />
        </SelectTrigger>
        <SelectContent>
          {properties
            .filter(property => property.id && property.id.trim() !== '') // Filter out invalid properties
            .map(property => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PropertySelector;
