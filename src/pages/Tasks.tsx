import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskConfirmDialog } from '@/components/tasks/TaskConfirmDialog';
import { ExtendedTask } from '@/components/tasks/types';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  removeTaskNotification, 
  addTaskNotification, 
  syncAllTaskNotifications 
} from '@/utils/taskNotificationUtils';
import { mockProperties } from '@/data/mockData';

const Tasks = () => {
  const [filter, setFilter] = useState('pending'); // Set default to pending
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const navigate = useNavigate();
  const { loadNotifications } = useNotifications();
  
  useEffect(() => {
    const loadProperties = () => {
      const savedProperties = localStorage.getItem('properties');
      return savedProperties ? JSON.parse(savedProperties) : mockProperties;
    };
    
    setProperties(loadProperties());
  }, []);
  
  // Sync notifications when component mounts
  useEffect(() => {
    syncAllTaskNotifications();
  }, []);
  
  const allTasks: ExtendedTask[] = properties.reduce((tasks, property) => {
    if (!property.tasks) return tasks;
    
    const propertyTasks = property.tasks.map(task => ({
      ...task,
      propertyName: property.name,
      propertyId: property.id,
      createdDate: task.createdDate || new Date().toISOString()
    }));
    
    return [...tasks, ...propertyTasks];
  }, [] as ExtendedTask[]);
  
  const filteredTasks = allTasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && !task.completed) || 
      (filter === 'completed' && task.completed);
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPropertyFilter = 
      propertyFilter === 'all' || task.propertyId === propertyFilter;
    
    return matchesFilter && matchesSearch && matchesPropertyFilter;
  });
  
  const handleTaskClick = (task: ExtendedTask) => {
    navigate(`/property/${task.propertyId}#tasks`);
  };
  
  const handleTaskToggle = (task: ExtendedTask) => {
    setSelectedTask(task);
    setIsConfirmDialogOpen(true);
  };
  
  const handleConfirmTaskToggle = () => {
    if (!selectedTask) return;
    
    const updatedProperties = properties.map(property => {
      if (property.id === selectedTask.propertyId) {
        const updatedTasks = property.tasks?.map(task => {
          if (task.id === selectedTask.id) {
            const updatedTask = { 
              ...task, 
              completed: !task.completed
            };
            
            if (!task.completed) {
              updatedTask.completedDate = new Date().toISOString();
              
              // Remove notification when completing task
              removeTaskNotification(task.id);
            } else {
              delete updatedTask.completedDate;
              
              // Add notification when marking as pending
              addTaskNotification(property.id, updatedTask);
            }
            
            return updatedTask;
          }
          return task;
        });
        
        return {
          ...property,
          tasks: updatedTasks
        };
      }
      return property;
    });
    
    setProperties(updatedProperties);
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    
    const actionText = selectedTask.completed ? 'pendiente' : 'completada';
    toast.success(`Tarea marcada como ${actionText}`);
    
    // Reload notifications after changing task state
    loadNotifications();
    
    setIsConfirmDialogOpen(false);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tareas</h1>
        <p className="text-muted-foreground">
          Administra todas las tareas de tus propiedades
        </p>
      </div>

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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {filter === 'pending' ? (
                  <Clock className="h-5 w-5" />
                ) : filter === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : null}
                {filter === 'all' 
                  ? 'Todas las tareas' 
                  : filter === 'pending' 
                    ? 'Tareas pendientes' 
                    : 'Tareas completadas'}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100vh-430px)] overflow-auto">
              <TaskList
                tasks={filteredTasks}
                onTaskClick={handleTaskClick}
                onTaskToggle={handleTaskToggle}
              />
            </CardContent>
          </Card>
        </Tabs>
      </div>
      
      <TaskConfirmDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        selectedTask={selectedTask}
        onConfirm={handleConfirmTaskToggle}
      />
    </Layout>
  );
};

export default Tasks;
