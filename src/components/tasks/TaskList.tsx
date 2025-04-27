
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
        <div className="text-center py-4">
          <p className="text-muted-foreground">No hay tareas disponibles</p>
        </div>
      ) : (
        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">Estado</TableHead>
                <TableHead className="max-w-[30%]">Tarea</TableHead>
                <TableHead className="max-w-[20%]">Propiedad</TableHead>
                <TableHead className="w-[100px]">Creada</TableHead>
                <TableHead className="w-[100px]">Completada</TableHead>
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
                  <TableCell className="max-w-[30%]">
                    <div className="min-w-0">
                      <div className={`truncate ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[20%]">
                    <div className="truncate">
                      {task.propertyName}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(task.createdDate)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {task.completedDate ? formatDate(task.completedDate) : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};
