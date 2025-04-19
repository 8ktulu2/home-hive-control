import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProperties } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, Property } from '@/types/property';
import { Check, Clock, Plus, Search, Filter, CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Extender el tipo Task para incluir información adicional
interface ExtendedTask extends Task {
  propertyName: string;
  propertyId: string;
  completedDate?: string;
  createdDate: string;
}

const Tasks = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'complete' | 'incomplete'>('complete');
  const [properties, setProperties] = useState<Property[]>(() => {
    const savedProperties = localStorage.getItem('properties');
    return savedProperties ? JSON.parse(savedProperties) : mockProperties;
  });
  
  // Recopilar todas las tareas de todas las propiedades
  const allTasks: ExtendedTask[] = properties.reduce((tasks, property) => {
    const propertyTasks = property.tasks?.map(task => ({
      ...task,
      propertyName: property.name,
      propertyId: property.id,
      createdDate: task.createdDate || new Date().toISOString() // Usar fecha existente o crear una nueva
    })) || [];
    return [...tasks, ...propertyTasks];
  }, [] as ExtendedTask[]);
  
  // Obtener lista única de propiedades para el filtro
  const uniqueProperties = Array.from(
    new Set(properties.map(property => property.id))
  ).map(id => {
    const property = properties.find(p => p.id === id);
    return { id, name: property?.name || 'Unknown' };
  });

  // Filtrar tareas según los criterios seleccionados
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
  
  const handleTaskToggle = (task: ExtendedTask) => {
    setSelectedTask(task);
    setDialogAction(task.completed ? 'incomplete' : 'complete');
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
            
            // Añadir o eliminar la fecha de completado
            if (!task.completed) {
              updatedTask.completedDate = new Date().toISOString();
            } else {
              delete updatedTask.completedDate;
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
    
    setIsConfirmDialogOpen(false);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (e) {
      return 'Fecha inválida';
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

      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="w-full sm:w-[180px] gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filtrar por propiedad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las propiedades</SelectItem>
              {uniqueProperties.map(property => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button className="w-full sm:w-auto flex gap-2">
            <Plus className="h-4 w-4" />
            <span>Nueva Tarea</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setFilter} value={filter}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
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
          <CardContent>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay tareas disponibles</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Estado</TableHead>
                    <TableHead>Tarea</TableHead>
                    <TableHead>Propiedad</TableHead>
                    <TableHead>Creada</TableHead>
                    <TableHead>Completada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <Checkbox 
                          checked={task.completed} 
                          onClick={() => handleTaskToggle(task)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className={task.completed ? "line-through text-muted-foreground" : ""}>
                            {task.title}
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 truncate max-w-xs">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{task.propertyName}</TableCell>
                      <TableCell>{formatDate(task.createdDate)}</TableCell>
                      <TableCell>
                        {task.completedDate ? formatDate(task.completedDate) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Tabs>
      
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogAction === 'complete' 
                ? 'Completar Tarea' 
                : 'Marcar Tarea como Pendiente'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === 'complete' 
                ? '¿Confirmas que has completado esta tarea?' 
                : '¿Confirmas que quieres marcar esta tarea como pendiente?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTaskToggle}>
              {dialogAction === 'complete' ? 'Completar' : 'Marcar como Pendiente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Tasks;
