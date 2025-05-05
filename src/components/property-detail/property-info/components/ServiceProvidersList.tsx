
import { Property } from '@/types/property';
import { Building2, Shield, Droplet, Lightbulb, Flame, Wifi } from 'lucide-react';

interface ServiceProvidersListProps {
  property: Property;
  onContactClick?: (type: string) => void;
}

const ServiceProvidersList = ({ property, onContactClick }: ServiceProvidersListProps) => {
  // Check if each contact section has any data
  const hasCommunityManager = property.communityManager || 
                            (property.communityManagerDetails && 
                            Object.values(property.communityManagerDetails).some(v => Boolean(v)));
  
  const hasInsuranceCompany = property.insuranceCompany || 
                            (property.insuranceDetails && 
                            Object.values(property.insuranceDetails).some(v => Boolean(v)));
  
  const hasWaterProvider = property.waterProvider || 
                            (property.waterProviderDetails && 
                            Object.values(property.waterProviderDetails).some(v => Boolean(v)));
  
  const hasElectricityProvider = property.electricityProvider || 
                            (property.electricityProviderDetails && 
                            Object.values(property.electricityProviderDetails).some(v => Boolean(v)));
  
  const hasGasProvider = property.gasProvider || 
                        (property.gasProviderDetails && 
                        Object.values(property.gasProviderDetails).some(v => Boolean(v)));
  
  const hasInternetProvider = property.internetProvider || 
                            (property.internetProviderDetails && 
                            Object.values(property.internetProviderDetails).some(v => Boolean(v)));

  const hasAnyProvider = hasCommunityManager || hasInsuranceCompany || 
                         hasWaterProvider || hasElectricityProvider || 
                         hasGasProvider || hasInternetProvider;

  if (!hasAnyProvider) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="h-5 w-5 text-gray-500" />
        <h3 className="font-medium text-lg">Proveedores de Servicios</h3>
      </div>
      <div className="space-y-2">
        {hasCommunityManager && (
          <div 
            className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => onContactClick?.('communityManager')}
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{property.communityManager || 'Administrador de Finca'}</span>
            </div>
          </div>
        )}
        
        {hasInsuranceCompany && (
          <div 
            className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => onContactClick?.('insuranceCompany')}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{property.insuranceCompany || 'Seguro'}</span>
            </div>
          </div>
        )}
        
        {hasWaterProvider && (
          <div 
            className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => onContactClick?.('waterProvider')}
          >
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{property.waterProvider || 'Agua'}</span>
            </div>
          </div>
        )}
        
        {hasElectricityProvider && (
          <div 
            className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => onContactClick?.('electricityProvider')}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{property.electricityProvider || 'Electricidad'}</span>
            </div>
          </div>
        )}
        
        {hasGasProvider && (
          <div 
            className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => onContactClick?.('gasProvider')}
          >
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{property.gasProvider || 'Gas'}</span>
            </div>
          </div>
        )}
        
        {hasInternetProvider && (
          <div 
            className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => onContactClick?.('internetProvider')}
          >
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{property.internetProvider || 'Internet'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProvidersList;
