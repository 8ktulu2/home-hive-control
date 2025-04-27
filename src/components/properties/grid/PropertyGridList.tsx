
import { Property } from '@/types/property';
import PropertyButton from '../PropertyButton';
import { useState } from 'react';

interface PropertyGridListProps {
  properties: Property[];
  selectedProperties: string[];
  onPropertySelect: (propertyId: string) => void;
  onPaymentUpdate: (propertyId: string, month: number, year: number, isPaid: boolean) => void;
}

const PropertyGridList = ({
  properties,
  selectedProperties,
  onPropertySelect,
  onPaymentUpdate,
}: PropertyGridListProps) => {
  const [selectionMode, setSelectionMode] = useState(false);

  const handleLongPress = (propertyId: string) => {
    setSelectionMode(true);
    onPropertySelect(propertyId);
  };

  const handleClick = (propertyId: string) => {
    if (selectionMode || selectedProperties.length > 0) {
      onPropertySelect(propertyId);
    }
  };

  // Reset selection mode when no properties are selected
  if (selectedProperties.length === 0 && selectionMode) {
    setSelectionMode(false);
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-medium">No se encontraron propiedades</p>
        <p className="text-muted-foreground mt-2">Intente con otra búsqueda o agregue una nueva propiedad</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {properties.map(property => (
        <div
          key={property.id}
          className="relative"
          onClick={() => handleClick(property.id)}
        >
          <PropertyButton 
            property={property} 
            onPaymentUpdate={onPaymentUpdate}
            onLongPress={() => handleLongPress(property.id)}
            isSelected={selectedProperties.includes(property.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyGridList;
