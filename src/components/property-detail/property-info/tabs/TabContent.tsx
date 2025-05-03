
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import GeneralInfoTab from '../GeneralInfoTab';
import ContactsTab from '../ContactsTab';
import InventoryTab from '../InventoryTab';
import TaxReportTab from '../TaxReportTab';
import { Property, InventoryItem, Tenant } from '@/types/property';

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
  return (
    <>
      <TabsContent value="general">
        <GeneralInfoTab 
          property={property} 
          onTenantClick={onTenantClick} 
        />
      </TabsContent>

      <TabsContent value="contacts">
        <ContactsTab 
          property={property} 
          onContactClick={(type) => onContactClick(type, property[`${type}Details`])} 
        />
      </TabsContent>

      <TabsContent value="inventory">
        <InventoryTab 
          property={property}
          onAddInventoryClick={onAddInventoryClick}
          onEditInventoryItem={onEditInventoryItem}
          onDeleteInventoryItem={onDeleteInventoryItem}
        />
      </TabsContent>
      
      <TabsContent value="taxreport">
        <TaxReportTab 
          property={property}
        />
      </TabsContent>
    </>
  );
};

export default TabContent;
