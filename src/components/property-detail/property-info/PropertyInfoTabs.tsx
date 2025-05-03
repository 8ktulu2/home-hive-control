
import { useState } from 'react';
import { Property, InventoryItem } from '@/types/property';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyInfoDialogs from './components/PropertyInfoDialogs';
import { usePropertyInfoDialogs } from './hooks/usePropertyInfoDialogs';
import { useInventoryManagement } from '@/hooks/useInventoryManagement';
import TabContent from './tabs/TabContent';

interface PropertyInfoTabsProps {
  property: Property;
}

const PropertyInfoTabs = ({ property }: PropertyInfoTabsProps) => {
  const [currentProperty, setCurrentProperty] = useState<Property>(property);
  const [activeTab, setActiveTab] = useState("general");
  
  const { handleAddInventoryItem, handleDeleteInventoryItem, handleEditInventoryItem } = useInventoryManagement(
    currentProperty,
    setCurrentProperty
  );

  const {
    selectedContact,
    setSelectedContact,
    selectedTenant,
    setSelectedTenant,
    isInventoryDialogOpen,
    editingInventoryItem,
    handleContactClick,
    handleTenantClick,
    handleInventoryDialogOpen,
    handleInventoryDialogClose,
    handleEditInventoryItemClick
  } = usePropertyInfoDialogs(currentProperty, setCurrentProperty);

  const handleInventoryItemSave = (item: Omit<InventoryItem, 'id'>) => {
    if (editingInventoryItem) {
      handleEditInventoryItem({ ...item, id: editingInventoryItem.id });
    } else {
      handleAddInventoryItem(item);
    }
    handleInventoryDialogClose();
  };

  return (
    <>
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-3 h-auto">
          <TabsTrigger value="general" className="py-2 text-xs sm:text-sm">General</TabsTrigger>
          <TabsTrigger value="contacts" className="py-2 text-xs sm:text-sm">Contactos</TabsTrigger>
          <TabsTrigger value="inventory" className="py-2 text-xs sm:text-sm">Inventario</TabsTrigger>
        </TabsList>

        <TabContent 
          activeTab={activeTab}
          property={currentProperty}
          onTenantClick={handleTenantClick}
          onContactClick={handleContactClick}
          onAddInventoryClick={handleInventoryDialogOpen}
          onEditInventoryItem={handleEditInventoryItemClick}
          onDeleteInventoryItem={handleDeleteInventoryItem}
        />
      </Tabs>

      <PropertyInfoDialogs 
        selectedContact={selectedContact}
        selectedTenant={selectedTenant}
        isInventoryDialogOpen={isInventoryDialogOpen}
        editingInventoryItem={editingInventoryItem}
        onContactClose={() => setSelectedContact(null)}
        onTenantClose={() => setSelectedTenant(null)}
        onInventoryClose={handleInventoryDialogClose}
        onInventorySave={handleInventoryItemSave}
      />
    </>
  );
};

export default PropertyInfoTabs;
