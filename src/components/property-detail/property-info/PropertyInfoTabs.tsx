
import { useState } from 'react';
import { Property, Tenant, ContactDetails, InventoryItem } from '@/types/property';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralInfoTab from './GeneralInfoTab';
import ContactsTab from './ContactsTab';
import InventoryTab from './InventoryTab';
import ContactDetailsDialog from '@/components/properties/ContactDetailsDialog';
import TenantDialog from '../dialogs/TenantDialog';
import InventoryDialog from '../dialogs/InventoryDialog';
import { useInventoryManagement } from '@/hooks/useInventoryManagement';

interface PropertyInfoTabsProps {
  property: Property;
}

const PropertyInfoTabs = ({ property }: PropertyInfoTabsProps) => {
  const [currentProperty, setCurrentProperty] = useState<Property>(property);
  const [selectedContact, setSelectedContact] = useState<{
    title: string;
    details: any;
  } | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null);

  const { handleAddInventoryItem, handleDeleteInventoryItem, handleEditInventoryItem } = useInventoryManagement(
    currentProperty,
    setCurrentProperty
  );

  const handleContactClick = (title: string, details: any) => {
    setSelectedContact({ title, details });
  };

  const handleTenantClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  const handleInventoryItemSave = (item: Omit<InventoryItem, 'id'>) => {
    if (editingInventoryItem) {
      const updatedItem = {
        ...item,
        id: editingInventoryItem.id
      };
      handleEditInventoryItem(updatedItem);
    } else {
      handleAddInventoryItem(item);
    }
    setIsInventoryDialogOpen(false);
    setEditingInventoryItem(null);
  };

  const handleEditInventoryItemClick = (item: InventoryItem) => {
    setEditingInventoryItem(item);
    setIsInventoryDialogOpen(true);
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
            onAddInventoryClick={() => {
              setEditingInventoryItem(null);
              setIsInventoryDialogOpen(true);
            }}
            onEditInventoryItem={handleEditInventoryItemClick}
            onDeleteInventoryItem={handleDeleteInventoryItem}
          />
        </TabsContent>
      </Tabs>

      {selectedContact && (
        <ContactDetailsDialog 
          isOpen={true} 
          onClose={() => setSelectedContact(null)} 
          title={selectedContact.title} 
          details={selectedContact.details || {}} 
        />
      )}

      <TenantDialog 
        tenant={selectedTenant} 
        onClose={() => setSelectedTenant(null)} 
      />

      <InventoryDialog 
        isOpen={isInventoryDialogOpen}
        onClose={() => {
          setIsInventoryDialogOpen(false);
          setEditingInventoryItem(null);
        }}
        onSave={handleInventoryItemSave}
        initialItem={editingInventoryItem}
      />
    </>
  );
};

export default PropertyInfoTabs;
