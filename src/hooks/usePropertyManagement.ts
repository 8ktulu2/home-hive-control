
import { useState } from 'react';
import { Property, Document } from '@/types/property';
import { useTaskManagement } from './useTaskManagement';
import { useDocumentManagement } from './useDocumentManagement';
import { useInventoryManagement } from './useInventoryManagement';
import { usePropertyImages } from './usePropertyImages';
import { usePropertyCreation } from './usePropertyCreation';
import { useExpenseManagement } from './useExpenseManagement';
import { toast } from 'sonner';
import { calculateTotalExpenses } from '@/utils/expenseCalculations';

export function usePropertyManagement(initialProperty: Property | null) {
  const [property, setProperty] = useState<Property | null>(initialProperty);

  const { handleTaskToggle, handleTaskAdd, handleTaskDelete, handleTaskUpdate } = useTaskManagement(property, setProperty);
  const { handleDocumentDelete } = useDocumentManagement(property, setProperty);
  const { handleAddInventoryItem, handleDeleteInventoryItem, handleEditInventoryItem } = useInventoryManagement(property, setProperty);
  const { updatePropertyImage } = usePropertyImages(property, setProperty);
  const { createNewProperty } = usePropertyCreation();
  const { handleExpenseAdd, handleExpenseUpdate } = useExpenseManagement(property, setProperty);

  // New function to add documents
  const handleDocumentAdd = (document: Document) => {
    if (property) {
      const updatedProperty = {
        ...property,
        documents: [...(property.documents || []), document]
      };
      
      setProperty(updatedProperty);
      
      try {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
      } catch (error) {
        // Handle localStorage quota exceeded error
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          toast.error("No se pudo guardar el documento: cuota de almacenamiento excedida");
          console.error("LocalStorage quota exceeded:", error);
        } else {
          toast.error("Error al guardar el documento");
          console.error("Error saving document:", error);
        }
      }
    }
  };

  // New function to handle expense deletion
  const handleExpenseDelete = (expenseId: string) => {
    if (!property || !property.monthlyExpenses) return;

    // Find the expense to be deleted
    const expenseToDelete = property.monthlyExpenses.find(e => e.id === expenseId);
    if (!expenseToDelete) return;

    // Calculate new expenses total
    const newExpenses = property.expenses - expenseToDelete.amount;
    const newNetIncome = property.rent - newExpenses;
    
    // Filter out the deleted expense
    const updatedExpenses = property.monthlyExpenses.filter(e => e.id !== expenseId);
    
    const updatedProperty = {
      ...property,
      monthlyExpenses: updatedExpenses,
      expenses: newExpenses,
      netIncome: newNetIncome
    };
    
    setProperty(updatedProperty);
    
    try {
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        const updatedProperties = properties.map((p: Property) => 
          p.id === property.id ? updatedProperty : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
        toast.success('Gasto eliminado correctamente');
      }
    } catch (error) {
      console.error("Error saving properties after expense deletion:", error);
      toast.error("Error al eliminar el gasto");
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
    handleExpenseDelete,
    calculateTotalExpenses
  };
}
