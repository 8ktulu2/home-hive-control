
import { Property, Tenant, InventoryItem } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import PropertyInfoTabs from './property-info/PropertyInfoTabs';
import { useState } from 'react';
import TenantDialog from './dialogs/TenantDialog';
import { usePropertyInfoDialogs } from './property-info/hooks/usePropertyInfoDialogs';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property: initialProperty }: PropertyInfoProps) => {
  const [activeTab, setActiveTab] = useState('general');
  
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
  } = usePropertyInfoDialogs(initialProperty, () => {});

  const handleAddInventoryClick = () => {
    handleInventoryDialogOpen(null);
  };

  const handleEditInventoryItem = (item: InventoryItem) => {
    handleEditInventoryItemClick(item);
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    // Handle deleting inventory item in the future
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
          property={initialProperty} 
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
      </CardContent>
    </Card>
  );
};

export default PropertyInfo;
