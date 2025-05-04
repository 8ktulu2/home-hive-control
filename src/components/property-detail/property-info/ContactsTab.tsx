
import { Property, Tenant } from '@/types/property';
import { Building2, Droplet, Lightbulb, Shield, Flame, Wifi, Users, User, Phone } from 'lucide-react';

interface ContactsTabProps {
  property: Property;
  onContactClick?: (type: string) => void;
  onTenantClick?: (tenant: Tenant) => void;
}

const ContactsTab = ({ property, onContactClick, onTenantClick }: ContactsTabProps) => {
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
  
  // Check if there are any tenants
  const hasTenants = property.tenants && property.tenants.length > 0;
  
  // If no contact info and no tenants, show empty state
  const hasAnyContactInfo = hasCommunityManager || hasInsuranceCompany || 
                           hasWaterProvider || hasElectricityProvider ||
                           hasGasProvider || hasInternetProvider || hasTenants;
  
  if (!hasAnyContactInfo) {
    return (
      <div className="text-center py-6 text-gray-500">
        No hay información de contactos disponible
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Tenant information section */}
      {hasTenants && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-lg">Inquilinos</h3>
          </div>
          <div className="space-y-2">
            {property.tenants?.map((tenant) => (
              <div 
                key={tenant.id}
                className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => onTenantClick?.(tenant)}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{tenant.name}</span>
                </div>
                {tenant.phone && (
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${tenant.phone}`} className="text-sm text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      {tenant.phone}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service providers */}
      {(hasCommunityManager || hasInsuranceCompany || hasWaterProvider || 
        hasElectricityProvider || hasGasProvider || hasInternetProvider) && (
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
                {property.communityManagerDetails?.phone && (
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`tel:${property.communityManagerDetails.phone}`} 
                      className="text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {property.communityManagerDetails.phone}
                    </a>
                  </div>
                )}
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
                {property.insuranceDetails?.phone && (
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`tel:${property.insuranceDetails.phone}`} 
                      className="text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {property.insuranceDetails.phone}
                    </a>
                  </div>
                )}
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
                {property.waterProviderDetails?.phone && (
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`tel:${property.waterProviderDetails.phone}`} 
                      className="text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {property.waterProviderDetails.phone}
                    </a>
                  </div>
                )}
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
                {property.electricityProviderDetails?.phone && (
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`tel:${property.electricityProviderDetails.phone}`} 
                      className="text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {property.electricityProviderDetails.phone}
                    </a>
                  </div>
                )}
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
                {property.gasProviderDetails?.phone && (
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`tel:${property.gasProviderDetails.phone}`} 
                      className="text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {property.gasProviderDetails.phone}
                    </a>
                  </div>
                )}
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
                {property.internetProviderDetails?.phone && (
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`tel:${property.internetProviderDetails.phone}`} 
                      className="text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {property.internetProviderDetails.phone}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsTab;
