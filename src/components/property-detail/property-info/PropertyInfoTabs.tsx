
import { useState } from 'react';
import { Property, InventoryItem } from '@/types/property';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralInfoTab from './GeneralInfoTab';
import ContactsTab from './ContactsTab';
import InventoryTab from './InventoryTab';
import PropertyInfoDialogs from './components/PropertyInfoDialogs';
import { usePropertyInfoDialogs } from './hooks/usePropertyInfoDialogs';
import { useInventoryManagement } from '@/hooks/useInventoryManagement';

interface PropertyInfoTabsProps {
  property: Property;
}

const PropertyInfoTabs = ({ property }: PropertyInfoTabsProps) => {
  const [currentProperty, setCurrentProperty] = useState<Property>(property);
  
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
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contacts">Contactos</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralInfoTab property={currentProperty} onTenantClick={handleTenantClick} />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsTab property={currentProperty} onContactClick={handleContactClick} />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryTab 
            property={currentProperty}
            onAddInventoryClick={handleInventoryDialogOpen}
            onEditInventoryItem={handleEditInventoryItemClick}
            onDeleteInventoryItem={handleDeleteInventoryItem}
          />
        </TabsContent>
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
