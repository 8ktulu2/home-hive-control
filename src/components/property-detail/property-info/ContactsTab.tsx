
import { Property, Tenant, Utility } from '@/types/property';
import TenantsList from './components/TenantsList';
import ServiceProvidersList from './components/ServiceProvidersList';
import EmptyContactsState from './components/EmptyContactsState';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContactsTabProps {
  property: Property;
  onContactClick?: (type: string) => void;
  onTenantClick?: (tenant: Tenant) => void;
  onAddUtilityClick?: () => void;
}

const ContactsTab = ({ 
  property, 
  onContactClick, 
  onTenantClick,
  onAddUtilityClick
}: ContactsTabProps) => {
  // Check if there are any tenants
  const hasTenants = property.tenants && property.tenants.length > 0;
  
  // Check if there's any service provider data
  const hasServiceProviders = 
    property.communityManager || property.insuranceCompany || 
    property.waterProvider || property.electricityProvider ||
    property.gasProvider || property.internetProvider ||
    (property.otherUtilities && property.otherUtilities.length > 0) ||
    Object.values(property.communityManagerDetails || {}).some(Boolean) ||
    Object.values(property.insuranceDetails || {}).some(Boolean) ||
    Object.values(property.waterProviderDetails || {}).some(Boolean) ||
    Object.values(property.electricityProviderDetails || {}).some(Boolean) ||
    Object.values(property.gasProviderDetails || {}).some(Boolean) ||
    Object.values(property.internetProviderDetails || {}).some(Boolean);
  
  // If no contact info at all, show empty state
  if (!hasTenants && !hasServiceProviders) {
    return <EmptyContactsState />;
  }
  
  return (
    <div className="space-y-6">
      {/* Tenant information section */}
      <TenantsList 
        tenants={property.tenants} 
        onTenantClick={onTenantClick}
      />

      {/* Service providers */}
      <ServiceProvidersList 
        property={property}
        onContactClick={onContactClick}
      />

      {/* Add other utility button - only shown in edit mode */}
      {onAddUtilityClick && (
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onAddUtilityClick}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Añadir otro suministro
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactsTab;
