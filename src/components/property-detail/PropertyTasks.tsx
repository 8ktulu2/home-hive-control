
import { useState } from 'react';
import { Task } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TaskItem } from './task/TaskItem';
import { TaskForm } from './task/TaskForm';
import { TaskNotificationDialog } from './task/TaskNotificationDialog';

interface PropertyTasksProps {
  tasks: Task[];
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onTaskAdd: (task: { title: string; description?: string; notification?: { date: string; enabled: boolean } }) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

const PropertyTasks = ({ tasks, onTaskToggle, onTaskAdd, onTaskDelete, onTaskUpdate }: PropertyTasksProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const handleTaskToggle = (task: Task) => {
    onTaskToggle(task.id, !task.completed);
    toast(`Tarea ${!task.completed ? 'completada' : 'pendiente'}`, {
      icon: !task.completed ? '✅' : '⭕',
    });
  };

  const handleAddTask = (newTask: { title: string; description?: string }) => {
    onTaskAdd(newTask);
    setIsAddingTask(false);
    toast.success('Tarea añadida');
  };

  const handleOpenNotificationDialog = (task: Task) => {
    setCurrentTask(task);
    setIsNotificationDialogOpen(true);
  };

  const handleSaveNotification = (notification: { enabled: boolean; date: string }) => {
    if (currentTask) {
      onTaskUpdate(currentTask.id, { notification });
      setIsNotificationDialogOpen(false);
      
      if (notification.enabled) {
        toast.success('Notificación configurada', {
          description: `Te notificaremos el ${new Date(notification.date).toLocaleDateString()}`,
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
          <TaskForm
            onTaskAdd={handleAddTask}
            onCancel={() => setIsAddingTask(false)}
          />
        )}

        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No hay tareas todavía</p>
          ) : (
            tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskToggle={handleTaskToggle}
                onTaskDelete={onTaskDelete}
                onOpenNotificationDialog={handleOpenNotificationDialog}
              />
            ))
          )}
        </div>

        <TaskNotificationDialog
          isOpen={isNotificationDialogOpen}
          onClose={() => setIsNotificationDialogOpen(false)}
          onSave={handleSaveNotification}
          currentNotification={currentTask?.notification}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyTasks;
