
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ExtendedTask } from './types';

interface TaskListProps {
  tasks: ExtendedTask[];
  onTaskClick: (task: ExtendedTask) => void;
  onTaskToggle: (task: ExtendedTask) => void;
}

export const TaskList = ({ tasks, onTaskClick, onTaskToggle }: TaskListProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  return (
    <>
      {tasks.length === 0 ? (
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
            {tasks.map(task => (
              <TableRow 
                key={task.id} 
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => onTaskClick(task)}
              >
                <TableCell onClick={(e) => { e.stopPropagation(); onTaskToggle(task); }}>
                  <Checkbox checked={task.completed} />
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
    </>
  );
};
