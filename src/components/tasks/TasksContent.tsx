
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskConfirmDialog } from '@/components/tasks/TaskConfirmDialog';
import { TasksCard } from '@/components/tasks/TasksCard'; // Add this import
import { ExtendedTask } from '@/components/tasks/types';
import { useTasksList } from '@/hooks/tasks/useTasksList';

export const TasksContent = () => {
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
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

  return (
    <>
      <TaskFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        propertyFilter={propertyFilter}
        onPropertyFilterChange={setPropertyFilter}
        properties={properties}
      />

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
