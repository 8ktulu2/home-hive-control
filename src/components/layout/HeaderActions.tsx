
import { Plus, Trash } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const HeaderActions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleDeleteProperties = () => {
    // If we're on the home page, find the delete button in PropertyGrid and trigger it
    if (location.pathname === '/') {
      // Try to find if there are selected properties
      const deleteButton = document.querySelector('button[data-delete-properties]');
      if (deleteButton) {
        (deleteButton as HTMLButtonElement).click();
      } else {
        toast.info('Por favor, seleccione las propiedades a eliminar en la lista');
      }
    } else {
      toast.info('Solo puede eliminar propiedades desde la página principal');
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8"
        onClick={() => navigate('/property/new')}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button 
        variant="destructive" 
        size="icon" 
        className="h-8 w-8"
        onClick={handleDeleteProperties}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
