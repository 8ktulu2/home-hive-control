
import { Property } from '@/types/property';
import { 
  Building, 
  Bed, 
  Bath, 
  Ruler, 
  Calendar, 
  Banknote, 
  FileText
} from 'lucide-react';

interface GeneralInfoTabProps {
  property: Property;
  onTenantClick?: (tenant: any) => void;
}

const GeneralInfoTab = ({ property, onTenantClick }: GeneralInfoTabProps) => {
  const hasAddress = Boolean(property.address);
  const hasCadastralRef = Boolean(property.cadastralReference);
  const hasSquareMeters = Boolean(property.squareMeters);
  const hasBedrooms = Boolean(property.bedrooms);
  const hasBathrooms = Boolean(property.bathrooms);
  const hasContract = property.contract && Object.values(property.contract).some(value => Boolean(value));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Basic Property Information - Split into Two Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hasAddress && (
            <div className="flex items-start gap-2">
              <Building className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-500" />
              <div>
                <p className="font-medium">Dirección</p>
                <p className="text-sm text-gray-600">{property.address}</p>
              </div>
            </div>
          )}
          
          {hasCadastralRef && (
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-500" />
              <div>
                <p className="font-medium">Referencia Catastral</p>
                <p className="text-sm text-gray-600">{property.cadastralReference}</p>
              </div>
            </div>
          )}
        </div>

        {/* Property Features - Always in a three-column grid on larger screens, one column on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {hasSquareMeters && (
            <div className="flex items-start gap-2">
              <Ruler className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
              <div>
                <p className="font-medium">Superficie</p>
                <p className="text-sm text-gray-600">{property.squareMeters} m²</p>
              </div>
            </div>
          )}
          
          {hasBedrooms && (
            <div className="flex items-start gap-2">
              <Bed className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
              <div>
                <p className="font-medium">Habitaciones</p>
                <p className="text-sm text-gray-600">{property.bedrooms}</p>
              </div>
            </div>
          )}
          
          {hasBathrooms && (
            <div className="flex items-start gap-2">
              <Bath className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
              <div>
                <p className="font-medium">Baños</p>
                <p className="text-sm text-gray-600">{property.bathrooms}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Contract Information */}
        {hasContract && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-800 mb-2">Contrato</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.contract?.startDate && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                  <div>
                    <p className="font-medium">Fecha inicio</p>
                    <p className="text-sm text-gray-600">{property.contract?.startDate}</p>
                  </div>
                </div>
              )}
              
              {property.contract?.endDate && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                  <div>
                    <p className="font-medium">Fecha fin</p>
                    <p className="text-sm text-gray-600">{property.contract?.endDate}</p>
                  </div>
                </div>
              )}
              
              {property.contract?.deposit && (
                <div className="flex items-start gap-2">
                  <Banknote className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                  <div>
                    <p className="font-medium">Fianza</p>
                    <p className="text-sm text-gray-600">{property.contract?.deposit} €</p>
                  </div>
                </div>
              )}
              
              {property.contract?.paymentMethod && (
                <div className="flex items-start gap-2">
                  <Banknote className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                  <div>
                    <p className="font-medium">Forma de pago</p>
                    <p className="text-sm text-gray-600">{property.contract?.paymentMethod}</p>
                  </div>
                </div>
              )}
            </div>
            
            {property.contract?.inventoryNotes && (
              <div className="mt-2">
                <p className="font-medium">Notas de inventario</p>
                <p className="text-sm text-gray-600">{property.contract?.inventoryNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralInfoTab;
