
import { Plus, Trash } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const HeaderActions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleDeleteProperties = () => {
    if (location.pathname === '/') {
      const selectedProperties = document.querySelectorAll('[data-selected="true"]');
      
      if (selectedProperties.length > 0) {
        // Find the delete dialog trigger and click it
        const deleteButton = document.querySelector('[data-delete-trigger="true"]');
        if (deleteButton) {
          // Simulate a click on the element
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          deleteButton.dispatchEvent(clickEvent);
        } else {
          toast.info('Seleccione propiedades para eliminar y haga clic en el botón de eliminar');
        }
      } else {
        toast.info('Por favor, seleccione las propiedades a eliminar manteniendo pulsada una propiedad');
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
        aria-label="Delete properties"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
