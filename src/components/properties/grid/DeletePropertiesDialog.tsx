
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface DeletePropertiesDialogProps {
  showDialog: boolean;
  selectedCount: number;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

const DeletePropertiesDialog = ({
  showDialog,
  selectedCount,
  onOpenChange,
  onConfirmDelete,
}: DeletePropertiesDialogProps) => {
  return (
    <AlertDialog open={showDialog} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          className="hidden"
          data-delete-trigger="true"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminarán permanentemente {selectedCount} propiedades
            y todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive hover:bg-destructive/90">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePropertiesDialog;
