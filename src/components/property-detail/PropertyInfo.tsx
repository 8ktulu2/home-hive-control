
import { useState } from 'react';
import { Property, Tenant, ContactDetails, InventoryItem } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import ContactDetailsDialog from '@/components/properties/ContactDetailsDialog';
import TenantDialog from './dialogs/TenantDialog';
import InventoryDialog from './dialogs/InventoryDialog';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import ContactsTab from './tabs/ContactsTab';
import InventoryTab from './tabs/InventoryTab';
import CommunityTab from './tabs/CommunityTab';
import { useInventoryManagement } from '@/hooks/useInventoryManagement';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({
  property: initialProperty
}: PropertyInfoProps) => {
  const [property, setProperty] = useState<Property>(initialProperty);
  const [selectedContact, setSelectedContact] = useState<{
    title: string;
    details: any;
  } | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null);

  const { handleAddInventoryItem, handleDeleteInventoryItem, handleEditInventoryItem } = useInventoryManagement(
    property,
    setProperty
  );

  const handleContactClick = (title: string, details: any) => {
    setSelectedContact({
      title,
      details
    });
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

  return <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span>Información General</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contacts">Contactos</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            
          </TabsList>
          
          <TabsContent value="general">
            <GeneralInfoTab property={property} onTenantClick={handleTenantClick} />
          </TabsContent>
          
          <TabsContent value="contacts">
            <ContactsTab property={property} onContactClick={handleContactClick} />
          </TabsContent>
          
          <TabsContent value="inventory">
            <InventoryTab 
              property={property} 
              onAddInventoryClick={() => {
                setEditingInventoryItem(null);
                setIsInventoryDialogOpen(true);
              }}
              onEditInventoryItem={handleEditInventoryItemClick}
              onDeleteInventoryItem={handleDeleteInventoryItem}
            />
          </TabsContent>
          
          <TabsContent value="community">
            <CommunityTab property={property} />
          </TabsContent>
        </Tabs>
      </CardContent>

      {selectedContact && <ContactDetailsDialog isOpen={true} onClose={() => setSelectedContact(null)} title={selectedContact.title} details={selectedContact.details || {}} />}
      
      <TenantDialog tenant={selectedTenant} onClose={() => setSelectedTenant(null)} />
      
      <InventoryDialog 
        isOpen={isInventoryDialogOpen} 
        onClose={() => {
          setIsInventoryDialogOpen(false);
          setEditingInventoryItem(null);
        }} 
        onSave={handleInventoryItemSave}
        initialItem={editingInventoryItem} 
      />
    </Card>;
};
export default PropertyInfo;
