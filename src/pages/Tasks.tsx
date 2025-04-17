
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProperties } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types/property';
import { Check, Clock, Plus } from 'lucide-react';

const Tasks = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Recopilar todas las tareas de todas las propiedades
  const allTasks = mockProperties.reduce((tasks, property) => {
    const propertyTasks = property.tasks?.map(task => ({
      ...task,
      propertyName: property.name,
      propertyId: property.id
    })) || [];
    return [...tasks, ...propertyTasks];
  }, [] as Array<any>);

  // Filtrar tareas según el estado seleccionado y el término de búsqueda
  const filteredTasks = allTasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && !task.completed) || 
      (filter === 'completed' && task.completed);
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tareas</h1>
        <p className="text-muted-foreground">
          Administra todas las tareas de tus propiedades
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>
        <Button className="w-full sm:w-auto flex gap-2">
          <Plus className="h-4 w-4" />
          <span>Nueva Tarea</span>
        </Button>
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
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <Checkbox checked={task.completed} />
                      </TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.propertyName}</TableCell>
                      <TableCell>{task.dueDate || 'Sin fecha'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </Layout>
  );
};

export default Tasks;
