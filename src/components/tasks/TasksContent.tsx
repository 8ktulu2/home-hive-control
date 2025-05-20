
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskConfirmDialog } from '@/components/tasks/TaskConfirmDialog';
import { TasksCard } from '@/components/tasks/TasksCard';
import { ExtendedTask } from '@/components/tasks/types';
import { useTasksList } from '@/hooks/tasks/useTasksList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const TasksContent = () => {
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const {
    properties,
    filteredTasks,
    handleTaskClick,
    handleTaskToggle,
    handleConfirmTaskToggle
  } = useTasksList(filter, searchTerm, propertyFilter);

  const onTaskToggle = (task: ExtendedTask) => {
    setSelectedTask(task);
    setIsConfirmDialogOpen(true);
  };
  
  const onConfirmTaskToggle = () => {
    if (selectedTask) {
      handleConfirmTaskToggle(selectedTask);
      setIsConfirmDialogOpen(false);
    }
  };
  
  const handleAddNewTask = () => {
    if (propertyFilter === 'all') {
      toast.error('Por favor, selecciona una propiedad para añadir una tarea');
      return;
    }
    
    const property = properties.find(p => p.id === propertyFilter);
    if (!property) {
      toast.error('Propiedad no encontrada');
      return;
    }
    
    // Redirigir al usuario a la página de detalle de la propiedad con el foco en tareas
    window.location.href = `/property/${propertyFilter}#tasks`;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <TaskFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          propertyFilter={propertyFilter}
          onPropertyFilterChange={setPropertyFilter}
          properties={properties}
        />
        
        <Button
          onClick={handleAddNewTask}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nueva tarea
        </Button>
      </div>

      <div className="h-[calc(100vh-280px)] overflow-hidden">
        <Tabs defaultValue="pending" onValueChange={setFilter} value={filter}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="completed">Completadas</TabsTrigger>
            <TabsTrigger value="all">Todas</TabsTrigger>
          </TabsList>

          <TasksCard 
            filter={filter} 
            filteredTasks={filteredTasks} 
            onTaskClick={handleTaskClick} 
            onTaskToggle={onTaskToggle} 
          />
        </Tabs>
      </div>
      
      <TaskConfirmDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        selectedTask={selectedTask}
        onConfirm={onConfirmTaskToggle}
      />
    </>
  );
};
