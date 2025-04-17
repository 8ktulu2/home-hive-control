
import { useState } from 'react';
import { Task } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Circle, CheckCircle, Plus, Calendar, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface PropertyTasksProps {
  tasks: Task[];
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onTaskAdd: (task: { title: string; description?: string }) => void;
  onTaskDelete: (taskId: string) => void;
}

const PropertyTasks = ({ tasks, onTaskToggle, onTaskAdd, onTaskDelete }: PropertyTasksProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onTaskAdd({ title: newTaskTitle.trim() });
      setNewTaskTitle('');
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
                  {task.dueDate && (
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => onTaskDelete(task.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyTasks;
