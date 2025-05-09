
import { Property, Tenant, InventoryItem, ContactDetails } from '@/types/property';
import ContactDetailsDialog from '@/components/properties/ContactDetailsDialog';
import TenantDialog from '../../dialogs/TenantDialog';
import InventoryDialog from '../../dialogs/InventoryDialog';

interface PropertyInfoDialogsProps {
  selectedContact: { title: string; details: ContactDetails } | null;
  selectedTenant: Tenant | null;
  isInventoryDialogOpen: boolean;
  editingInventoryItem: InventoryItem | null;
  onContactClose: () => void;
  onTenantClose: () => void;
  onInventoryClose: () => void;
  onInventorySave: (item: Omit<InventoryItem, 'id'>) => void;
}

const PropertyInfoDialogs = ({
  selectedContact,
  selectedTenant,
  isInventoryDialogOpen,
  editingInventoryItem,
  onContactClose,
  onTenantClose,
  onInventoryClose,
  onInventorySave,
}: PropertyInfoDialogsProps) => {
  return (
    <>
      {selectedContact && (
        <ContactDetailsDialog 
          isOpen={true} 
          onClose={onContactClose}
          title={selectedContact.title} 
          details={selectedContact.details || {}} 
        />
      )}

      <TenantDialog 
        tenant={selectedTenant} 
        onClose={onTenantClose}
      />

      <InventoryDialog 
        isOpen={isInventoryDialogOpen}
        onClose={onInventoryClose}
        onSave={onInventorySave}
        initialItem={editingInventoryItem}
      />
    </>
  );
};

export default PropertyInfoDialogs;
