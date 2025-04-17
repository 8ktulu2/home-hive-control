
import { useState } from 'react';
import { Task, TaskNotification } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Circle, CheckCircle, Plus, Calendar, Trash, Bell, BellOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface PropertyTasksProps {
  tasks: Task[];
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onTaskAdd: (task: { title: string; description?: string; notification?: { date: string; enabled: boolean } }) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

const PropertyTasks = ({ tasks, onTaskToggle, onTaskAdd, onTaskDelete, onTaskUpdate }: PropertyTasksProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [notificationDate, setNotificationDate] = useState<string>('');
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onTaskAdd({ 
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsAddingTask(false);
      toast.success('Tarea añadida');
    }
  };

  const toggleTaskStatus = (task: Task) => {
    onTaskToggle(task.id, !task.completed);
    toast(`Tarea ${!task.completed ? 'completada' : 'pendiente'}`, {
      icon: !task.completed ? '✅' : '⭕',
    });
  };

  const openNotificationDialog = (task: Task) => {
    setCurrentTask(task.id);
    setNotificationEnabled(task.notification?.enabled || false);
    setNotificationDate(task.notification?.date || '');
    setIsNotificationDialogOpen(true);
  };

  const saveNotification = () => {
    if (currentTask) {
      const notification: TaskNotification = {
        enabled: notificationEnabled,
        date: notificationDate,
      };
      
      onTaskUpdate(currentTask, { notification });
      setIsNotificationDialogOpen(false);
      
      if (notificationEnabled) {
        toast.success('Notificación configurada', {
          description: `Te notificaremos el ${new Date(notificationDate).toLocaleDateString()}`,
        });
      } else {
        toast.info('Notificación desactivada');
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          <span>Tareas</span>
        </CardTitle>
        {!isAddingTask && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Añadir</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddingTask && (
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Escriba el título de la tarea..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="border"
              autoFocus
            />
            <Textarea
              placeholder="Descripción (opcional)..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="border"
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-1">
              <Button variant="outline" size="sm" onClick={() => setIsAddingTask(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                Añadir
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No hay tareas todavía</p>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className="flex items-start p-2 rounded-md hover:bg-accent/20"
              >
                <div 
                  className="flex-shrink-0 cursor-pointer mt-0.5" 
                  onClick={() => toggleTaskStatus(task)}
                >
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={`text-xs text-muted-foreground mt-0.5 ${task.completed ? 'line-through' : ''}`}>
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center mt-1 space-x-3">
                    {task.dueDate && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {task.notification?.enabled && (
                      <div className="flex items-center text-xs text-primary">
                        <Bell className="h-3 w-3 mr-1" />
                        <span>Recordatorio: {new Date(task.notification.date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 ${task.notification?.enabled ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => openNotificationDialog(task)}
                    title="Configurar notificación"
                  >
                    {task.notification?.enabled ? (
                      <Bell className="h-4 w-4" />
                    ) : (
                      <BellOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => onTaskDelete(task.id)}
                    title="Eliminar tarea"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar Notificación</DialogTitle>
              <DialogDescription>
                Establece un recordatorio para esta tarea
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={notificationEnabled}
                  onCheckedChange={setNotificationEnabled}
                  id="notification-switch"
                />
                <Label htmlFor="notification-switch">
                  {notificationEnabled ? 'Notificación activada' : 'Notificación desactivada'}
                </Label>
              </div>
              
              {notificationEnabled && (
                <div className="grid gap-2">
                  <Label htmlFor="notification-date">Fecha de recordatorio</Label>
                  <Input
                    id="notification-date"
                    type="datetime-local"
                    value={notificationDate}
                    onChange={(e) => setNotificationDate(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Recibirás una notificación en la fecha indicada</span>
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveNotification}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PropertyTasks;
