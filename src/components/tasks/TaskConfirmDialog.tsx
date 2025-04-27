
import { ExtendedTask } from './types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface TaskConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: ExtendedTask | null;
  onConfirm: () => void;
}

export const TaskConfirmDialog = ({
  isOpen,
  onOpenChange,
  selectedTask,
  onConfirm
}: TaskConfirmDialogProps) => {
  const dialogAction = selectedTask?.completed ? 'incomplete' : 'complete';

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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
          <AlertDialogAction onClick={onConfirm}>
            {dialogAction === 'complete' ? 'Completar' : 'Marcar como Pendiente'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
