
import { useState } from 'react';
import { Property, Tenant, ContactDetails, InventoryItem } from '@/types/property';

export const usePropertyInfoDialogs = (
  currentProperty: Property,
  setCurrentProperty: React.Dispatch<React.SetStateAction<Property>>
) => {
  const [selectedContact, setSelectedContact] = useState<{
    title: string;
    details: ContactDetails;
  } | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null);

  const handleContactClick = (title: string, details: ContactDetails) => {
    setSelectedContact({ title, details });
  };

  const handleTenantClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  const handleInventoryDialogOpen = () => {
    setEditingInventoryItem(null);
    setIsInventoryDialogOpen(true);
  };

  const handleInventoryDialogClose = () => {
    setIsInventoryDialogOpen(false);
    setEditingInventoryItem(null);
  };

  const handleEditInventoryItemClick = (item: InventoryItem) => {
    setEditingInventoryItem(item);
    setIsInventoryDialogOpen(true);
  };

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
