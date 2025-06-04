
import { Property, Tenant, InventoryItem } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import PropertyInfoTabs from './property-info/PropertyInfoTabs';
import { useState, useEffect } from 'react';
import TenantDialog from './dialogs/TenantDialog';
import { usePropertyInfoDialogs } from './property-info/hooks/usePropertyInfoDialogs';
import ContactDetailsDialog from '@/components/properties/ContactDetailsDialog';
import InventoryDialog from './dialogs/InventoryDialog';

interface PropertyInfoProps {
  property: Property;
  setProperty?: (property: Property) => void;
  onInventoryAdd?: (item: any) => void;
  onInventoryEdit?: (item: any) => void;
  onInventoryDelete?: (itemId: string) => void;
  historicalYear?: number;
}

const PropertyInfo = ({ 
  property: initialProperty, 
  setProperty,
  onInventoryAdd,
  onInventoryEdit,
  onInventoryDelete,
  historicalYear
}: PropertyInfoProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const [property, setLocalProperty] = useState(initialProperty);
  
  // Update local property when the prop changes
  useEffect(() => {
    setLocalProperty(initialProperty);
  }, [initialProperty]);
  
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

  const handleAddInventoryClick = () => {
    handleInventoryDialogOpen();
  };

  const handleEditInventoryClick = (item: InventoryItem) => {
    handleEditInventoryItemClick(item);
  };

  const handleInventorySave = (item: Omit<InventoryItem, 'id'>) => {
    if (historicalYear && onInventoryAdd) {
      // For historical years, use the provided handlers
      if (editingInventoryItem && onInventoryEdit) {
        onInventoryEdit({
          ...item,
          id: editingInventoryItem.id
        });
      } else {
        onInventoryAdd(item);
      }
    } else if (setProperty) {
      // For current year, use normal property management
      const newItem: InventoryItem = {
        ...item,
        id: editingInventoryItem?.id || `inv-${Date.now()}`
      };

      if (editingInventoryItem) {
        const updatedInventory = property.inventory?.map(inv => 
          inv.id === editingInventoryItem.id ? newItem : inv
        ) || [];
        
        const updatedProperty = {
          ...property,
          inventory: updatedInventory
        };
        
        setLocalProperty(updatedProperty);
        setProperty(updatedProperty);
      } else {
        const updatedProperty = {
          ...property,
          inventory: [...(property.inventory || []), newItem]
        };
        
        setLocalProperty(updatedProperty);
        setProperty(updatedProperty);
      }
    }
    
    handleInventoryDialogClose();
  };

  const handleInventoryDelete = (itemId: string) => {
    if (historicalYear && onInventoryDelete) {
      // For historical years, use the provided handler
      onInventoryDelete(itemId);
    } else if (setProperty) {
      // For current year, use normal property management
      const updatedProperty = {
        ...property,
        inventory: property.inventory?.filter(item => item.id !== itemId) || []
      };
      
      setLocalProperty(updatedProperty);
      setProperty(updatedProperty);
    }
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
          onEditInventoryItem={handleEditInventoryClick}
          onDeleteInventoryItem={handleInventoryDelete}
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
