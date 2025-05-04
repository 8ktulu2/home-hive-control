
import { Property, Tenant } from '@/types/property';
import { Building2, Droplet, Lightbulb, Shield, Flame, Wifi, Users, User } from 'lucide-react';

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
      {/* Tenant information section - new section added */}
      {hasTenants && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-lg">Inquilinos</h3>
          </div>
          <div className="space-y-3">
            {property.tenants?.map((tenant) => (
              <div 
                key={tenant.id}
                className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => onTenantClick?.(tenant)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <h3 className="font-medium">{tenant.name}</h3>
                </div>
                {tenant.phone && (
                  <p className="text-sm text-gray-600 ml-6">Tel: {tenant.phone}</p>
                )}
                {tenant.email && (
                  <p className="text-sm text-gray-600 ml-6">Email: {tenant.email}</p>
                )}
                {tenant.identificationNumber && (
                  <p className="text-sm text-gray-600 ml-6">DNI/NIE: {tenant.identificationNumber}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service providers */}
      {(hasCommunityManager || hasInsuranceCompany || hasWaterProvider || 
        hasElectricityProvider || hasGasProvider || hasInternetProvider) && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-lg">Proveedores de Servicios</h3>
          </div>
        </div>
      )}
      
      {hasCommunityManager && (
        <div 
          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
          onClick={() => onContactClick?.('communityManager')}
        >
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium">{property.communityManager || 'Administrador'}</h3>
          </div>
          {property.communityManagerDetails?.phone && (
            <p className="text-sm text-gray-600 ml-6">Tel: {property.communityManagerDetails.phone}</p>
          )}
          {property.communityManagerDetails?.email && (
            <p className="text-sm text-gray-600 ml-6">Email: {property.communityManagerDetails.email}</p>
          )}
        </div>
      )}
      
      {hasInsuranceCompany && (
        <div 
          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
          onClick={() => onContactClick?.('insuranceCompany')}
        >
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium">{property.insuranceCompany || 'Seguro'}</h3>
          </div>
          {property.insuranceDetails?.phone && (
            <p className="text-sm text-gray-600 ml-6">Tel: {property.insuranceDetails.phone}</p>
          )}
          {property.insuranceDetails?.email && (
            <p className="text-sm text-gray-600 ml-6">Email: {property.insuranceDetails.email}</p>
          )}
        </div>
      )}
      
      {hasWaterProvider && (
        <div 
          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
          onClick={() => onContactClick?.('waterProvider')}
        >
          <div className="flex items-center gap-2 mb-1">
            <Droplet className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium">{property.waterProvider || 'Agua'}</h3>
          </div>
          {property.waterProviderDetails?.phone && (
            <p className="text-sm text-gray-600 ml-6">Tel: {property.waterProviderDetails.phone}</p>
          )}
          {property.waterProviderDetails?.email && (
            <p className="text-sm text-gray-600 ml-6">Email: {property.waterProviderDetails.email}</p>
          )}
        </div>
      )}
      
      {hasElectricityProvider && (
        <div 
          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
          onClick={() => onContactClick?.('electricityProvider')}
        >
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium">{property.electricityProvider || 'Electricidad'}</h3>
          </div>
          {property.electricityProviderDetails?.phone && (
            <p className="text-sm text-gray-600 ml-6">Tel: {property.electricityProviderDetails.phone}</p>
          )}
          {property.electricityProviderDetails?.email && (
            <p className="text-sm text-gray-600 ml-6">Email: {property.electricityProviderDetails.email}</p>
          )}
        </div>
      )}
      
      {hasGasProvider && (
        <div 
          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
          onClick={() => onContactClick?.('gasProvider')}
        >
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium">{property.gasProvider || 'Gas'}</h3>
          </div>
          {property.gasProviderDetails?.phone && (
            <p className="text-sm text-gray-600 ml-6">Tel: {property.gasProviderDetails.phone}</p>
          )}
          {property.gasProviderDetails?.email && (
            <p className="text-sm text-gray-600 ml-6">Email: {property.gasProviderDetails.email}</p>
          )}
        </div>
      )}
      
      {hasInternetProvider && (
        <div 
          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
          onClick={() => onContactClick?.('internetProvider')}
        >
          <div className="flex items-center gap-2 mb-1">
            <Wifi className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium">{property.internetProvider || 'Internet'}</h3>
          </div>
          {property.internetProviderDetails?.phone && (
            <p className="text-sm text-gray-600 ml-6">Tel: {property.internetProviderDetails.phone}</p>
          )}
          {property.internetProviderDetails?.email && (
            <p className="text-sm text-gray-600 ml-6">Email: {property.internetProviderDetails.email}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactsTab;
