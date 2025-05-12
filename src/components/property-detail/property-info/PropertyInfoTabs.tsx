
import React, { useState } from 'react';
import { Property, Tenant, InventoryItem } from '@/types/property';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import TabContent from './tabs/TabContent';

interface PropertyInfoTabsProps {
  property: Property;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTenantClick: (tenant: Tenant) => void;
  onContactClick: (title: string, details: any) => void;
  onAddInventoryClick: () => void;
  onEditInventoryItem: (item: InventoryItem) => void;
  onDeleteInventoryItem: (itemId: string) => void;
  onAddUtilityClick?: () => void;
}

const PropertyInfoTabs = ({
  property,
  activeTab,
  setActiveTab,
  onTenantClick,
  onContactClick,
  onAddInventoryClick,
  onEditInventoryItem,
  onDeleteInventoryItem,
  onAddUtilityClick
}: PropertyInfoTabsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {isMobile ? (
        <div className="space-y-2">
          <TabsList className="w-full grid grid-cols-2 h-auto">
            <TabsTrigger value="general">Información</TabsTrigger>
            <TabsTrigger value="contacts">Contactos</TabsTrigger>
          </TabsList>
          <TabsList className="w-full grid grid-cols-2 h-auto">
            <TabsTrigger value="finances">Finanzas</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
          </TabsList>
        </div>
      ) : (
        <TabsList className="w-full">
          <TabsTrigger value="general">Información</TabsTrigger>
          <TabsTrigger value="contacts">Contactos</TabsTrigger>
          <TabsTrigger value="finances">Finanzas</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
        </TabsList>
      )}
      
      <TabsContent value={activeTab} className="mt-4">
        <TabContent 
          activeTab={activeTab}
          property={property}
          onTenantClick={onTenantClick}
          onContactClick={onContactClick}
          onAddInventoryClick={onAddInventoryClick}
          onEditInventoryItem={onEditInventoryItem}
          onDeleteInventoryItem={onDeleteInventoryItem}
          onAddUtilityClick={onAddUtilityClick}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PropertyInfoTabs;
