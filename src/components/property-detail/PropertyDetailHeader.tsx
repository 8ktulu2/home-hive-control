
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
    <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-start space-y-2 pb-2`}>
      <div className="flex flex-row gap-4 items-center">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg shrink-0">
          <img 
            src={property.image || '/placeholder.svg'} 
            alt={property.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold">{property.name}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{property.address}</p>
        </div>
      </div>
      <PropertyActions propertyId={property.id} />
    </div>
  );
};

export default PropertyDetailHeader;
