
import { Property } from '@/types/property';
import { 
  Building, 
  Bed, 
  Bath, 
  Ruler, 
  Calendar, 
  Banknote, 
  FileText,
  Droplet,
  Lightbulb,
  Flame,
  Wifi
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
  const hasWaterProvider = Boolean(property.waterProvider);
  const hasElectricityProvider = Boolean(property.electricityProvider);
  const hasGasProvider = Boolean(property.gasProvider);
  const hasInternetProvider = Boolean(property.internetProvider);
  const hasOtherUtilities = property.otherUtilities && property.otherUtilities.length > 0;

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
        
        {/* Utilities */}
        {(hasWaterProvider || hasElectricityProvider || hasGasProvider || hasInternetProvider || hasOtherUtilities) && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-800 mb-2">Suministros</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hasWaterProvider && (
                <div className="flex items-start gap-2">
                  <Droplet className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                  <div>
                    <p className="font-medium">Agua</p>
                    <p className="text-sm text-gray-600">{property.waterProvider}</p>
                    {property.waterProviderDetails?.contactPerson && (
                      <p className="text-sm text-gray-500">
                        Contacto: {property.waterProviderDetails.contactPerson}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {hasElectricityProvider && (
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                  <div>
                    <p className="font-medium">Electricidad</p>
                    <p className="text-sm text-gray-600">{property.electricityProvider}</p>
                    {property.electricityProviderDetails?.contactPerson && (
                      <p className="text-sm text-gray-500">
                        Contacto: {property.electricityProviderDetails.contactPerson}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {hasGasProvider && (
                <div className="flex items-start gap-2">
                  <Flame className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                  <div>
                    <p className="font-medium">Gas</p>
                    <p className="text-sm text-gray-600">{property.gasProvider}</p>
                    {property.gasProviderDetails?.contactPerson && (
                      <p className="text-sm text-gray-500">
                        Contacto: {property.gasProviderDetails.contactPerson}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {hasInternetProvider && (
                <div className="flex items-start gap-2">
                  <Wifi className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                  <div>
                    <p className="font-medium">Internet</p>
                    <p className="text-sm text-gray-600">{property.internetProvider}</p>
                    {property.internetProviderDetails?.contactPerson && (
                      <p className="text-sm text-gray-500">
                        Contacto: {property.internetProviderDetails.contactPerson}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {hasOtherUtilities && property.otherUtilities?.map(utility => (
                <div key={utility.id} className="flex items-start gap-2">
                  <div>
                    <p className="font-medium">{utility.name}</p>
                    {utility.provider && <p className="text-sm text-gray-600">{utility.provider}</p>}
                    {utility.contactPhone && (
                      <p className="text-sm text-gray-500">
                        Teléfono: {utility.contactPhone}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralInfoTab;
