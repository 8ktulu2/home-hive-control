
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProperties } from '@/data/mockData';
import { Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskConfirmDialog } from '@/components/tasks/TaskConfirmDialog';
import { ExtendedTask } from '@/components/tasks/types';
import { useNotifications } from '@/hooks/useNotifications';

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
  
  // Sincronizar notificaciones cuando se monta el componente
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
              
              // Eliminar notificación al completar tarea
              removeTaskNotification(task.id);
            } else {
              delete updatedTask.completedDate;
              
              // Añadir notificación al marcar como pendiente
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
    
    // Recargar notificaciones después de cambiar el estado de la tarea
    loadNotifications();
    
    setIsConfirmDialogOpen(false);
  };

  // Función para eliminar notificación de tarea
  const removeTaskNotification = (taskId: string) => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const notifications = JSON.parse(savedNotifications);
        const updatedNotifications = notifications.filter(
          (n: any) => !(n.type === 'task' && n.taskId === taskId)
        );
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      }
    } catch (error) {
      console.error("Error al eliminar notificación de tarea:", error);
    }
  };

  // Función para añadir notificación de tarea
  const addTaskNotification = (propertyId: string, task: any) => {
    try {
      if (!task.completed) {
        const notification = {
          id: `notification-task-${task.id}`,
          type: 'task',
          taskId: task.id,
          propertyId: propertyId,
          message: `Tarea pendiente: ${task.title}`,
          read: false,
          createdAt: new Date().toISOString()
        };
    
        const savedNotifications = localStorage.getItem('notifications');
        let notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
        
        const existingIndex = notifications.findIndex(
          (n: any) => n.taskId === task.id
        );
        
        if (existingIndex >= 0) {
          notifications[existingIndex] = notification;
        } else {
          notifications.push(notification);
        }
        
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      }
    } catch (error) {
      console.error("Error al añadir notificación de tarea:", error);
    }
  };

  // Función para sincronizar todas las notificaciones de tareas
  const syncAllTaskNotifications = () => {
    try {
      // Obtener todas las propiedades
      const savedProperties = localStorage.getItem('properties');
      if (!savedProperties) return;
      
      const properties = JSON.parse(savedProperties);
      
      // Recolectar todas las tareas pendientes
      const pendingTasks: {task: any, propertyId: string}[] = [];
      properties.forEach((p: Property) => {
        if (p.tasks) {
          p.tasks.forEach(task => {
            if (!task.completed) {
              pendingTasks.push({task, propertyId: p.id});
            }
          });
        }
      });
      
      // Obtener notificaciones actuales
      const savedNotifications = localStorage.getItem('notifications');
      let notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
      
      // Filtrar notificaciones que no son de tareas
      const nonTaskNotifications = notifications.filter(
        (n: any) => n.type !== 'task'
      );
      
      // Crear nuevas notificaciones para todas las tareas pendientes
      const taskNotifications = pendingTasks.map(({task, propertyId}) => ({
        id: `notification-task-${task.id}`,
        type: 'task',
        taskId: task.id,
        propertyId: propertyId,
        message: `Tarea pendiente: ${task.title}`,
        read: false,
        createdAt: task.createdDate
      }));
      
      // Combinar notificaciones
      const updatedNotifications = [...nonTaskNotifications, ...taskNotifications];
      
      // Guardar notificaciones actualizadas
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      // Recargar notificaciones
      loadNotifications();
    } catch (error) {
      console.error("Error al sincronizar notificaciones de tareas:", error);
    }
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
