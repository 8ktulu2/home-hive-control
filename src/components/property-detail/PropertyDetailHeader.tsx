
import { Property } from '@/types/property';
import PropertyActions from './header/PropertyActions';

interface PropertyDetailHeaderProps {
  property: Property;
  onRentPaidChange: (paid: boolean) => void;
}

const PropertyDetailHeader = ({ property, onRentPaidChange }: PropertyDetailHeaderProps) => {
  return (
    <>
      <PropertyActions propertyId={property.id} />
      
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative w-20 h-20 overflow-hidden rounded-lg shrink-0">
            <img 
              src={property.image || '/placeholder.svg'} 
              alt={property.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{property.name}</h1>
            <p className="text-muted-foreground">{property.address}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetailHeader;
