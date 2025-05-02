
import { Task } from '@/types/property';
import { CheckCircle, Circle, Bell, BellOff, Trash, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';

interface TaskItemProps {
  task: Task;
  onTaskToggle: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onOpenNotificationDialog: (task: Task) => void;
}

export const TaskItem = ({
  task,
  onTaskToggle,
  onTaskDelete,
  onOpenNotificationDialog
}: TaskItemProps) => {
  // Add useNotifications to reload notifications when task state changes
  const { loadNotifications } = useNotifications();
  
  const handleTaskToggle = (task: Task) => {
    onTaskToggle(task);
    // Reload notifications to update UI immediately
    setTimeout(loadNotifications, 100);
  };

  return (
    <div className="flex items-start p-2 rounded-md hover:bg-accent/20">
      <div 
        className="flex-shrink-0 cursor-pointer mt-0.5" 
        onClick={(e) => {
          e.stopPropagation();
          handleTaskToggle(task);
        }}
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
        <TaskDates task={task} />
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-6 w-6 ${!task.completed ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenNotificationDialog(task);
          }}
          title="Configurar notificación"
        >
          {!task.completed ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onTaskDelete(task.id);
            // Reload notifications after deleting task
            setTimeout(loadNotifications, 100);
          }}
          title="Eliminar tarea"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const TaskDates = ({ task }: { task: Task }) => {
  if (!task.dueDate && !task.notification?.enabled) return null;
  
  return (
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
  );
};
