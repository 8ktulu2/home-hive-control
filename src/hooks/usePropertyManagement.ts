
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

  return {
    property,
    setProperty,
    handleTaskToggle,
    handleTaskAdd,
    handleTaskDelete,
    handleTaskUpdate,
    handleDocumentDelete,
  };
}
