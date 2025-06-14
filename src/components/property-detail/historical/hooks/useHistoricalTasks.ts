
import { Property } from '@/types/property';
import { useHistoricalDataIsolation } from '@/hooks/useHistoricalDataIsolation';
import { toast } from 'sonner';

export const useHistoricalTasks = (
  property: Property, 
  year: number,
  historicalProperty: Property | null,
  setHistoricalProperty: (property: Property) => void
) => {
  const { 
    getHistoricalTasks,
    saveHistoricalTasks
  } = useHistoricalDataIsolation();

  // ISOLATED task management - affects ONLY the historical year
  const handleHistoricalTaskAdd = (task: { title: string; description?: string }) => {
    const newTask = {
      id: `hist-task-${Date.now()}`,
      title: task.title,
      description: task.description,
      completed: false,
      createdDate: new Date().toISOString(),
      year
    };

    const existingTasks = getHistoricalTasks(property.id, year);
    const saved = saveHistoricalTasks(property.id, year, [...existingTasks, newTask]);
    
    if (saved && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: [...(historicalProperty.tasks || []), newTask]
      });
      toast.success('Tarea añadida al histórico');
    }
  };

  const handleHistoricalTaskToggle = (taskId: string, completed: boolean) => {
    const existingTasks = getHistoricalTasks(property.id, year);
    const updatedTasks = existingTasks.map(task => 
      task.id === taskId ? { ...task, completed, completedDate: completed ? new Date().toISOString() : undefined } : task
    );
    const saved = saveHistoricalTasks(property.id, year, updatedTasks);
    
    if (saved && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: historicalProperty.tasks?.map(task => 
          task.id === taskId ? { ...task, completed, completedDate: completed ? new Date().toISOString() : undefined } : task
        ) || []
      });
      toast.success('Estado de tarea actualizado');
    }
  };

  const handleHistoricalTaskDelete = (taskId: string) => {
    const existingTasks = getHistoricalTasks(property.id, year);
    const updatedTasks = existingTasks.filter(task => task.id !== taskId);
    const saved = saveHistoricalTasks(property.id, year, updatedTasks);
    
    if (saved && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: historicalProperty.tasks?.filter(task => task.id !== taskId) || []
      });
      toast.success('Tarea eliminada del histórico');
    }
  };

  const handleHistoricalTaskUpdate = (taskId: string, updates: any) => {
    const existingTasks = getHistoricalTasks(property.id, year);
    const updatedTasks = existingTasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    const saved = saveHistoricalTasks(property.id, year, updatedTasks);
    
    if (saved && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: historicalProperty.tasks?.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        ) || []
      });
      toast.success('Tarea actualizada');
    }
  };

  return {
    handleHistoricalTaskAdd,
    handleHistoricalTaskToggle,
    handleHistoricalTaskDelete,
    handleHistoricalTaskUpdate
  };
};
