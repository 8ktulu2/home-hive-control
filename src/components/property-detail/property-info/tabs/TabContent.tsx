
import { Property, Tenant, InventoryItem } from '@/types/property';
import GeneralInfoTab from '../GeneralInfoTab';
import ContactsTab from '../ContactsTab';
import InventoryTab from '../InventoryTab';

interface TabContentProps {
  activeTab: string;
  property: Property;
  onTenantClick: (tenant: Tenant) => void;
  onContactClick: (title: string, details: any) => void;
  onAddInventoryClick: () => void;
  onEditInventoryItem: (item: InventoryItem) => void;
  onDeleteInventoryItem: (itemId: string) => void;
  onAddUtilityClick?: () => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  property,
  onTenantClick,
  onContactClick,
  onAddInventoryClick,
  onEditInventoryItem,
  onDeleteInventoryItem,
  onAddUtilityClick
}) => {
  switch (activeTab) {
    case 'general':
      return <GeneralInfoTab property={property} onTenantClick={onTenantClick} />;
    case 'contacts':
      return <ContactsTab 
        property={property} 
        onTenantClick={onTenantClick}
        onContactClick={(type) => {
          // Extract the appropriate details based on the contact type
          let title = '';
          let details = {};
          
          if (type.startsWith('otherUtility-')) {
            const utilityId = type.replace('otherUtility-', '');
            const utility = property.otherUtilities?.find(u => u.id === utilityId);
            if (utility) {
              title = utility.name || 'Otro Suministro';
              details = {
                provider: utility.provider,
                phone: utility.contactPhone,
                email: utility.contactEmail,
                contractNumber: utility.contractNumber,
                accountHolder: utility.accountHolder,
                notes: utility.notes,
              };
            }
          } else {
            switch(type) {
              case 'communityManager':
                title = 'Administrador Comunidad';
                details = property.communityManagerDetails || {};
                break;
              case 'insuranceCompany':
                title = 'Compañía de Seguros';
                details = property.insuranceDetails || {};
                break;
              case 'waterProvider':
                title = 'Proveedor de Agua';
                details = property.waterProviderDetails || {};
                break;
              case 'electricityProvider':
                title = 'Proveedor de Electricidad';
                details = property.electricityProviderDetails || {};
                break;
              case 'gasProvider':
                title = 'Proveedor de Gas';
                details = property.gasProviderDetails || {};
                break;
              case 'internetProvider':
                title = 'Proveedor de Internet';
                details = property.internetProviderDetails || {};
                break;
              default:
                title = type;
                break;
            }
          }
          
          onContactClick(title, details);
        }} 
        onAddUtilityClick={onAddUtilityClick}
      />;
    case 'inventory':
      return (
        <InventoryTab
          property={property}
          onAddInventoryClick={onAddInventoryClick}
          onEditInventoryItem={onEditInventoryItem}
          onDeleteInventoryItem={onDeleteInventoryItem}
        />
      );
    default:
      return <GeneralInfoTab property={property} onTenantClick={onTenantClick} />;
  }
};

export default TabContent;
