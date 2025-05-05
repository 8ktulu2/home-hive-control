
import { Property, Tenant } from '@/types/property';
import TenantsList from './components/TenantsList';
import ServiceProvidersList from './components/ServiceProvidersList';
import EmptyContactsState from './components/EmptyContactsState';

interface ContactsTabProps {
  property: Property;
  onContactClick?: (type: string) => void;
  onTenantClick?: (tenant: Tenant) => void;
}

const ContactsTab = ({ property, onContactClick, onTenantClick }: ContactsTabProps) => {
  // Check if there are any tenants
  const hasTenants = property.tenants && property.tenants.length > 0;
  
  // Check if there's any service provider data
  const hasServiceProviders = 
    property.communityManager || property.insuranceCompany || 
    property.waterProvider || property.electricityProvider ||
    property.gasProvider || property.internetProvider ||
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
    <div className="space-y-4">
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
    </div>
  );
};

export default ContactsTab;
