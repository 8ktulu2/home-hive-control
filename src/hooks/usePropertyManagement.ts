
import { useState } from 'react';
import { Property, Task, PaymentRecord, MonthlyExpense } from '@/types/property';
import { toast } from 'sonner';

export function usePropertyManagement(initialProperty: Property | null) {
  const [property, setProperty] = useState<Property | null>(initialProperty);

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (property && property.tasks) {
      const updatedTasks = property.tasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      );
      setProperty({
        ...property,
        tasks: updatedTasks
      });
    }
  };

  const handleTaskAdd = (newTask: { title: string; description?: string; notification?: { date: string; enabled: boolean } }) => {
    if (property) {
      const task: Task = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        completed: false,
        dueDate: undefined,
        notification: newTask.notification ? {
          enabled: newTask.notification.enabled,
          date: newTask.notification.date,
        } : undefined
      };
      
      setProperty({
        ...property,
        tasks: [...(property.tasks || []), task]
      });
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (property && property.tasks) {
      setProperty({
        ...property,
        tasks: property.tasks.filter(task => task.id !== taskId)
      });
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    if (property && property.tasks) {
      const updatedTasks = property.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      setProperty({
        ...property,
        tasks: updatedTasks
      });
    }
  };

  const handleDocumentDelete = (documentId: string) => {
    if (property && property.documents) {
      setProperty({
        ...property,
        documents: property.documents.filter(doc => doc.id !== documentId)
      });
    }
  };

  const createNewProperty = (propertyData: Partial<Property>): Property => {
    // Create a new property with default values for required fields
    const newProperty: Property = {
      id: `property-${Date.now()}`,
      name: propertyData.name || "Nueva Propiedad",
      address: propertyData.address || "",
      image: propertyData.image || "/placeholder.svg", // Changed from imageUrl to image
      rent: propertyData.rent || 0,
      expenses: propertyData.expenses || 0,
      rentPaid: false,
      netIncome: (propertyData.rent || 0) - (propertyData.expenses || 0),
      // Removed propertyTax as it's not in the Property interface
      cadastralReference: propertyData.cadastralReference || "",
      communityManager: propertyData.communityManager || "", // Changed to string as per the Property type
      waterProvider: propertyData.waterProvider || "", // Changed to string as per the Property type
      electricityProvider: propertyData.electricityProvider || "", // Changed to string as per the Property type
      // Removed insuranceProvider as it's not in the Property interface
      tenants: propertyData.tenants || [],
      monthlyExpenses: propertyData.monthlyExpenses || [],
      paymentHistory: propertyData.paymentHistory || [],
      documents: propertyData.documents || [],
      tasks: propertyData.tasks || [],
      // Removed notes as it's not in the Property interface
    };

    return newProperty;
  };

  return {
    property,
    setProperty,
    handleTaskToggle,
    handleTaskAdd,
    handleTaskDelete,
    handleTaskUpdate,
    handleDocumentDelete,
    createNewProperty,
  };
}
