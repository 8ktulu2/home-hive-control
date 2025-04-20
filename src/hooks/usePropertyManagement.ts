
import { useState } from 'react';
import { Property } from '@/types/property';
import { useTaskManagement } from './useTaskManagement';
import { useDocumentManagement } from './useDocumentManagement';
import { useInventoryManagement } from './useInventoryManagement';
import { usePropertyImages } from './usePropertyImages';
import { usePropertyCreation } from './usePropertyCreation';

export function usePropertyManagement(initialProperty: Property | null) {
  const [property, setProperty] = useState<Property | null>(initialProperty);

  const { handleTaskToggle, handleTaskAdd, handleTaskDelete, handleTaskUpdate } = useTaskManagement(property, setProperty);
  const { handleDocumentDelete } = useDocumentManagement(property, setProperty);
  const { handleAddInventoryItem } = useInventoryManagement(property, setProperty);
  const { updatePropertyImage } = usePropertyImages(property, setProperty);
  const { createNewProperty } = usePropertyCreation();

  return {
    property,
    setProperty,
    handleTaskToggle,
    handleTaskAdd,
    handleTaskDelete,
    handleTaskUpdate,
    handleDocumentDelete,
    handleAddInventoryItem,
    createNewProperty,
    updatePropertyImage,
  };
}
