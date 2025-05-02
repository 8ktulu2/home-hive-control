
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ExtendedTask } from './types';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskListProps {
  tasks: ExtendedTask[];
  onTaskClick: (task: ExtendedTask) => void;
  onTaskToggle: (task: ExtendedTask) => void;
}

export const TaskList = ({ tasks, onTaskClick, onTaskToggle }: TaskListProps) => {
  const isMobile = useIsMobile();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No hay tareas disponibles</p>
      </div>
    );
  }

  // Vista móvil: mostrar tarjetas en lugar de tabla
  if (isMobile) {
    return (
      <div className="space-y-4 px-1">
        {tasks.map(task => (
          <div 
            key={task.id}
            className="border rounded-lg p-3 cursor-pointer hover:bg-accent/10"
            onClick={() => onTaskClick(task)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div onClick={(e) => { e.stopPropagation(); onTaskToggle(task); }}>
                <Checkbox checked={task.completed} className="h-5 w-5 min-w-[20px]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {task.propertyName}
                </p>
              </div>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <div className="flex items-center">
                <span className="font-medium mr-1">Creada:</span> {formatDate(task.createdDate)}
              </div>
              {task.completedDate && (
                <div className="flex items-center">
                  <span className="font-medium mr-1">Completada:</span> {formatDate(task.completedDate)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Vista escritorio: tabla
  return (
    <ScrollArea className="w-full">
      <div className="min-w-full">
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
    </ScrollArea>
  );
};
