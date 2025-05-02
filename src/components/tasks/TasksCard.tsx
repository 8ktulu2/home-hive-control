
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock } from 'lucide-react';
import { TaskList } from '@/components/tasks/TaskList';
import { ExtendedTask } from '@/components/tasks/types';

interface TasksCardProps {
  filter: string;
  filteredTasks: ExtendedTask[];
  onTaskClick: (task: ExtendedTask) => void;
  onTaskToggle: (task: ExtendedTask) => void;
}

export const TasksCard = ({ filter, filteredTasks, onTaskClick, onTaskToggle }: TasksCardProps) => {
  return (
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
          onTaskClick={onTaskClick}
          onTaskToggle={onTaskToggle}
        />
      </CardContent>
    </Card>
  );
};
