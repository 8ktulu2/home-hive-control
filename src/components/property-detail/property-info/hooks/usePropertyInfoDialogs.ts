
import { useState } from 'react';
import { Property, Tenant, ContactDetails } from '@/types/property';
import { useInventoryDialog } from './useInventoryDialog';

export const usePropertyInfoDialogs = (
  currentProperty: Property,
  setCurrentProperty: React.Dispatch<React.SetStateAction<Property>>
) => {
  const [selectedContact, setSelectedContact] = useState<{
    title: string;
    details: ContactDetails;
  } | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const handleContactClick = (title: string, details: ContactDetails) => {
    setSelectedContact({ title, details });
  };

  const handleTenantClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  const {
    isInventoryDialogOpen,
    editingInventoryItem,
    handleInventoryDialogOpen,
    handleInventoryDialogClose,
    handleEditInventoryItemClick
  } = useInventoryDialog();

  return {
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
  };
};
