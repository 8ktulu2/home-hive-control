
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
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  property,
  onTenantClick,
  onContactClick,
  onAddInventoryClick,
  onEditInventoryItem,
  onDeleteInventoryItem
}) => {
  switch (activeTab) {
    case 'general':
      return <GeneralInfoTab property={property} onTenantClick={onTenantClick} />;
    case 'contacts':
      return <ContactsTab property={property} onContactClick={onContactClick} />;
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
