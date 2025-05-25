
import { Property, Tenant } from '@/types/property';
import { Building, MapPin, Ruler, Bed, Bath, Euro } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ImageGalleryViewer from './ImageGalleryViewer';

interface GeneralInfoTabProps {
  property: Property;
  onTenantClick?: (tenant: Tenant) => void;
}

const GeneralInfoTab = ({ property, onTenantClick }: GeneralInfoTabProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span>{property.address}</span>
        </div>
        
        {property.squareMeters && (
          <div className="flex items-center gap-2 text-sm">
            <Ruler className="h-4 w-4 text-gray-500" />
            <span>{property.squareMeters} m²</span>
          </div>
        )}
        
        <div className="flex gap-4">
          {property.bedrooms && (
            <div className="flex items-center gap-1 text-sm">
              <Bed className="h-4 w-4 text-gray-500" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="flex items-center gap-1 text-sm">
              <Bath className="h-4 w-4 text-gray-500" />
              <span>{property.bathrooms}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Euro className="h-4 w-4 text-gray-500" />
          <span>Alquiler: {formatCurrency(property.rent)}</span>
        </div>

        {property.cadastralReference && (
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-gray-500" />
            <span>Ref. Catastral: {property.cadastralReference}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Image Gallery */}
      <ImageGalleryViewer property={property} />
    </div>
  );
};

export default GeneralInfoTab;
