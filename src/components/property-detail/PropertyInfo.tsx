
import { Property, Tenant, InventoryItem } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import PropertyInfoTabs from './property-info/PropertyInfoTabs';
import { useState } from 'react';
import TenantDialog from './dialogs/TenantDialog';
import { usePropertyInfoDialogs } from './property-info/hooks/usePropertyInfoDialogs';
import ContactDetailsDialog from '@/components/properties/ContactDetailsDialog';
import InventoryDialog from './dialogs/InventoryDialog';
import { useInventoryManagement } from '@/hooks/useInventoryManagement';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property: initialProperty }: PropertyInfoProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const [property, setProperty] = useState(initialProperty);
  
  const {
    selectedTenant,
    setSelectedTenant,
    selectedContact,
    setSelectedContact,
    isInventoryDialogOpen,
    editingInventoryItem,
    handleContactClick,
    handleTenantClick,
    handleInventoryDialogOpen,
    handleInventoryDialogClose,
    handleEditInventoryItemClick
  } = usePropertyInfoDialogs();

  const { 
    handleAddInventoryItem, 
    handleDeleteInventoryItem, 
    handleEditInventoryItem 
  } = useInventoryManagement(property, (updatedProperty) => {
    setProperty(updatedProperty);
    // Propagate changes to parent components if needed
  });

  const handleAddInventoryClick = () => {
    handleInventoryDialogOpen();
  };

  const handleEditInventoryItem = (item: InventoryItem) => {
    handleEditInventoryItemClick(item);
  };

  const handleInventorySave = (item: Omit<InventoryItem, 'id'>) => {
    if (editingInventoryItem) {
      handleEditInventoryItem({
        ...item,
        id: editingInventoryItem.id
      });
    } else {
      handleAddInventoryItem(item);
    }
    handleInventoryDialogClose();
  };

  const handleCloseContactDialog = () => {
    setSelectedContact(null);
  };

  const handleCloseTenantDialog = () => {
    setSelectedTenant(null);
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span className="truncate">Información General</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <PropertyInfoTabs 
          property={property} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTenantClick={handleTenantClick}
          onContactClick={handleContactClick}
          onAddInventoryClick={handleAddInventoryClick}
          onEditInventoryItem={handleEditInventoryItem}
          onDeleteInventoryItem={handleDeleteInventoryItem}
        />

        {/* Dialogs */}
        <TenantDialog 
          tenant={selectedTenant} 
          onClose={handleCloseTenantDialog} 
        />

        {selectedContact && (
          <ContactDetailsDialog
            isOpen={!!selectedContact}
            onClose={handleCloseContactDialog}
            title={selectedContact.title}
            details={selectedContact.details}
          />
        )}

        <InventoryDialog
          isOpen={isInventoryDialogOpen}
          onClose={handleInventoryDialogClose}
          onSave={handleInventorySave}
          initialItem={editingInventoryItem}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyInfo;
