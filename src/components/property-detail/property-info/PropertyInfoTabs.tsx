
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TabContent from './tabs/TabContent';
import { Property, Tenant, InventoryItem } from '@/types/property';
import { FileText, Users, Box, Euro } from 'lucide-react';

interface PropertyInfoTabsProps {
  property: Property;
  activeTab: string;
  setActiveTab: (value: string) => void;
  onTenantClick: (tenant: Tenant) => void;
  onContactClick: (title: string, details: any) => void;
  onAddInventoryClick: () => void;
  onEditInventoryItem: (item: InventoryItem) => void;
  onDeleteInventoryItem: (itemId: string) => void;
}

const PropertyInfoTabs: React.FC<PropertyInfoTabsProps> = ({
  property,
  activeTab,
  setActiveTab,
  onTenantClick,
  onContactClick,
  onAddInventoryClick,
  onEditInventoryItem,
  onDeleteInventoryItem
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="border-b mb-4">
        <TabsList className="bg-transparent h-auto p-0 w-full rounded-none flex flex-nowrap overflow-auto">
          <TabsTrigger 
            value="general" 
            className="data-[state=active]:border-b-primary data-[state=active]:border-b-2 border-b-transparent rounded-none flex items-center gap-1 pb-2 px-2 whitespace-nowrap text-xs sm:text-sm"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" /> Información
          </TabsTrigger>
          <TabsTrigger 
            value="contacts" 
            className="data-[state=active]:border-b-primary data-[state=active]:border-b-2 border-b-transparent rounded-none flex items-center gap-1 pb-2 px-2 whitespace-nowrap text-xs sm:text-sm" 
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4" /> Contactos
          </TabsTrigger>
          <TabsTrigger 
            value="finances" 
            className="data-[state=active]:border-b-primary data-[state=active]:border-b-2 border-b-transparent rounded-none flex items-center gap-1 pb-2 px-2 whitespace-nowrap text-xs sm:text-sm" 
          >
            <Euro className="h-3 w-3 sm:h-4 sm:w-4" /> Finanzas
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            className="data-[state=active]:border-b-primary data-[state=active]:border-b-2 border-b-transparent rounded-none flex items-center gap-1 pb-2 px-2 whitespace-nowrap text-xs sm:text-sm" 
          >
            <Box className="h-3 w-3 sm:h-4 sm:w-4" /> Inventario
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabContent 
        activeTab={activeTab}
        property={property}
        onTenantClick={onTenantClick}
        onContactClick={onContactClick}
        onAddInventoryClick={onAddInventoryClick}
        onEditInventoryItem={onEditInventoryItem}
        onDeleteInventoryItem={onDeleteInventoryItem}
      />
    </Tabs>
  );
};

export default PropertyInfoTabs;
