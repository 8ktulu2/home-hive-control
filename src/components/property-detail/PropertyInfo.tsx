
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

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property }: PropertyInfoProps) => {
  const [selectedContact, setSelectedContact] = useState<{
    title: string;
    details: any;
  } | null>(null);
  
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  
  const handleContactClick = (title: string, details: any) => {
    setSelectedContact({ title, details });
  };
  
  const handleTenantClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };
  
  const handleAddInventoryItem = (newItem: Omit<InventoryItem, 'id'>) => {
    toast.success(`Añadido "${newItem.name}" al inventario`);
    setIsInventoryDialogOpen(false);
  };

  return (
    <Card>
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
            <TabsTrigger value="community">Comunidad</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralInfoTab property={property} onTenantClick={handleTenantClick} />
          </TabsContent>
          
          <TabsContent value="contacts">
            <ContactsTab property={property} onContactClick={handleContactClick} />
          </TabsContent>
          
          <TabsContent value="inventory">
            <InventoryTab property={property} onAddInventoryClick={() => setIsInventoryDialogOpen(true)} />
          </TabsContent>
          
          <TabsContent value="community">
            <CommunityTab property={property} />
          </TabsContent>
        </Tabs>
      </CardContent>

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
        onClose={() => setIsInventoryDialogOpen(false)}
        onSave={handleAddInventoryItem}
      />
    </Card>
  );
};

export default PropertyInfo;
