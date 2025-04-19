import { useState } from 'react';
import { Property, Task, PaymentRecord, MonthlyExpense, InventoryItem } from '@/types/property';
import { toast } from 'sonner';

export function usePropertyManagement(initialProperty: Property | null) {
  const [property, setProperty] = useState<Property | null>(initialProperty);

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (property && property.tasks) {
      const updatedTasks = property.tasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, completed };
          if (completed) {
            updatedTask.completedDate = new Date().toISOString();
          } else {
            delete updatedTask.completedDate;
          }
          return updatedTask;
        }
        return task;
      });
      
      const updatedProperty = {
        ...property,
        tasks: updatedTasks
      };
      
      setProperty(updatedProperty);
      
      if (property.id) {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
      }
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
        createdDate: new Date().toISOString(),
        notification: newTask.notification ? {
          enabled: newTask.notification.enabled,
          date: newTask.notification.date,
        } : undefined
      };
      
      const updatedProperty = {
        ...property,
        tasks: [...(property.tasks || []), task]
      };
      
      setProperty(updatedProperty);
      
      if (property.id) {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
      }
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (property && property.tasks) {
      const updatedProperty = {
        ...property,
        tasks: property.tasks.filter(task => task.id !== taskId)
      };
      
      setProperty(updatedProperty);
      
      if (property.id) {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
      }
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    if (property && property.tasks) {
      const updatedTasks = property.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      
      const updatedProperty = {
        ...property,
        tasks: updatedTasks
      };
      
      setProperty(updatedProperty);
      
      if (property.id) {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
      }
    }
  };

  const handleDocumentDelete = (documentId: string) => {
    if (property && property.documents) {
      const updatedProperty = {
        ...property,
        documents: property.documents.filter(doc => doc.id !== documentId)
      };
      
      setProperty(updatedProperty);
      
      if (property.id) {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
      }
    }
  };

  const handleAddInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    if (property) {
      const newItem: InventoryItem = {
        ...item,
        id: `inventory-${Date.now()}`
      };
      
      const updatedProperty = {
        ...property,
        inventory: [...(property.inventory || []), newItem]
      };
      
      setProperty(updatedProperty);
      
      if (property.id) {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
      }
    }
  };

  const updatePropertyImage = (imageUrl: string) => {
    if (property) {
      const updatedProperty = {
        ...property,
        image: imageUrl
      };
      
      setProperty(updatedProperty);
      
      if (property.id) {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
        }
      }
    }
  };

  const createNewProperty = (propertyData: Partial<Property>): Property => {
    const newPropertyId = `property-${Date.now()}`;
    const newProperty: Property = {
      id: newPropertyId,
      name: propertyData.name || "Nueva Propiedad",
      address: propertyData.address || "",
      image: propertyData.image || "/placeholder.svg",
      rent: propertyData.rent || 0,
      expenses: propertyData.expenses || 0,
      rentPaid: false,
      netIncome: (propertyData.rent || 0) - (propertyData.expenses || 0),
      cadastralReference: propertyData.cadastralReference || "",
      communityManager: propertyData.communityManager || "",
      waterProvider: propertyData.waterProvider || "",
      electricityProvider: propertyData.electricityProvider || "",
      tenants: propertyData.tenants || [],
      monthlyExpenses: propertyData.monthlyExpenses || [],
      paymentHistory: propertyData.paymentHistory || [],
      documents: propertyData.documents || [],
      tasks: propertyData.tasks || [],
      inventory: propertyData.inventory || [],
      communityFee: propertyData.communityFee || 0,
    };
    
    const savedProperties = localStorage.getItem('properties');
    let allProperties = [];
    
    if (savedProperties) {
      allProperties = JSON.parse(savedProperties);
      allProperties.push(newProperty);
    } else {
      allProperties = [newProperty];
    }
    
    localStorage.setItem('properties', JSON.stringify(allProperties));
    toast.success(`Propiedad "${newProperty.name}" creada correctamente`);

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
    handleAddInventoryItem,
    createNewProperty,
    updatePropertyImage,
  };
}
