
import { Property } from '@/types/property';
import PropertyActions from './header/PropertyActions';
import { useIsMobile } from '@/hooks/use-mobile';

interface PropertyDetailHeaderProps {
  property: Property;
  onRentPaidChange: (paid: boolean) => void;
}

const PropertyDetailHeader = ({ property }: PropertyDetailHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center pb-2">
      <div className="flex flex-row gap-4 items-center">
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 overflow-hidden rounded-lg shrink-0">
          <img 
            src={property.image || '/placeholder.svg'} 
            alt={property.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold">{property.name}</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">{property.address}</p>
        </div>
      </div>
      <PropertyActions propertyId={property.id} />
    </div>
  );
};

export default PropertyDetailHeader;
