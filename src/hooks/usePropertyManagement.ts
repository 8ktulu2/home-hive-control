
import { useState } from 'react';
import { Property, Document } from '@/types/property';
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

  // New function to add documents
  const handleDocumentAdd = (document: Document) => {
    if (property) {
      const updatedProperty = {
        ...property,
        documents: [...(property.documents || []), document]
      };
      
      setProperty(updatedProperty);
      
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: Property) => 
          p.id === property.id ? updatedProperty : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      }
    }
  };

  return {
    property,
    setProperty,
    handleTaskToggle,
    handleTaskAdd,
    handleTaskDelete,
    handleTaskUpdate,
    handleDocumentDelete,
    handleDocumentAdd,
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
