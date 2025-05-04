
import { useState } from 'react';
import { InventoryItem } from '@/types/property';

export const useInventoryDialog = () => {
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null);

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
    isInventoryDialogOpen,
    editingInventoryItem,
    handleInventoryDialogOpen,
    handleInventoryDialogClose,
    handleEditInventoryItemClick
  };
};
