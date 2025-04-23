
import { useState } from 'react';
import { Property } from '@/types/property';
import { useTaskManagement } from './useTaskManagement';
import { useDocumentManagement } from './useDocumentManagement';
import { useInventoryManagement } from './useInventoryManagement';
import { usePropertyImages } from './usePropertyImages';
import { usePropertyCreation } from './usePropertyCreation';
import { useExpenseManagement } from './useExpenseManagement';

export function usePropertyManagement(initialProperty: Property | null) {
  const [property, setProperty] = useState<Property | null>(initialProperty);

  const { handleTaskToggle, handleTaskAdd, handleTaskDelete, handleTaskUpdate } = useTaskManagement(property, setProperty);
  const { handleDocumentDelete } = useDocumentManagement(property, setProperty);
  const { handleAddInventoryItem, handleDeleteInventoryItem, handleEditInventoryItem } = useInventoryManagement(property, setProperty);
  const { updatePropertyImage } = usePropertyImages(property, setProperty);
  const { createNewProperty } = usePropertyCreation();
  const { handleExpenseAdd, handleExpenseUpdate, calculateTotalExpenses } = useExpenseManagement(property, setProperty);

  return {
    property,
    setProperty,
    handleTaskToggle,
    handleTaskAdd,
    handleTaskDelete,
    handleTaskUpdate,
    handleDocumentDelete,
    handleAddInventoryItem,
    handleDeleteInventoryItem,
    handleEditInventoryItem,
    createNewProperty,
    updatePropertyImage,
    handleExpenseAdd,
    handleExpenseUpdate,
    calculateTotalExpenses
  };
}
