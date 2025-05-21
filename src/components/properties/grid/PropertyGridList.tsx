
import { Property } from '@/types/property';
import PropertyButton from '../PropertyButton';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

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
  const isMobile = useIsMobile();

  const handleLongPress = () => {
    console.log('Long press detected - activating selection mode');
    setSelectionMode(true);
    // Notify user
    toast.info('Modo de selección activado. Toca las propiedades para seleccionarlas.');
  };

  const handleSelect = (propertyId: string) => {
    console.log('Selection toggle for property:', propertyId);
    onPropertySelect(propertyId);
  };

  // Reset selection mode when no properties are selected
  useEffect(() => {
    if (selectedProperties.length === 0 && selectionMode) {
      setSelectionMode(false);
      console.log('Selection mode deactivated, no properties selected');
    }
  }, [selectedProperties, selectionMode]);

  // Listen for ESC key to exit selection mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectionMode) {
        setSelectionMode(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectionMode]);

  if (properties.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-medium">No se encontraron propiedades</p>
        <p className="text-muted-foreground mt-2">Intente con otra búsqueda o agregue una nueva propiedad</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 max-w-full">
      {properties.map(property => (
        <div
          key={property.id}
          className="relative max-w-full"
          data-selected={selectedProperties.includes(property.id)}
        >
          <PropertyButton 
            property={property} 
            onPaymentUpdate={onPaymentUpdate}
            onLongPress={handleLongPress}
            onSelect={selectionMode ? handleSelect : undefined}
            isSelected={selectedProperties.includes(property.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyGridList;
