
import { Property } from '@/types/property';
import { Checkbox } from '@/components/ui/checkbox';
import PropertyButton from '../PropertyButton';

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
        <div key={property.id} className="relative">
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={selectedProperties.includes(property.id)}
              onCheckedChange={() => onPropertySelect(property.id)}
            />
          </div>
          <PropertyButton 
            property={property} 
            onPaymentUpdate={onPaymentUpdate}
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyGridList;
