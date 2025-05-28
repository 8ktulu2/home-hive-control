
import { Plus, Trash } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const HeaderActions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleDeleteProperties = () => {
    if (location.pathname === '/') {
      // Buscar si hay propiedades seleccionadas
      const selectedProperties = document.querySelectorAll('[data-selected="true"]');
      
      if (selectedProperties.length > 0) {
        // Buscar el botón de eliminación en PropertyGridHeader y simulamos un clic
        const deleteButton = document.querySelector('[data-delete-trigger="true"]');
        if (deleteButton) {
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          deleteButton.dispatchEvent(clickEvent);
        } else {
          toast.error('No se pudo encontrar el botón de eliminar');
        }
      } else {
        toast.info('Mantén pulsada una propiedad para seleccionarla primero');
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
        className="h-8 w-8 bg-white border-gray-300 hover:bg-[#2ecc71] hover:border-[#2ecc71] group transition-all duration-200"
        onClick={() => navigate('/property/new')}
      >
        <Plus className="h-4 w-4 text-[#2ecc71] group-hover:text-white transition-colors duration-200" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8 bg-white border-gray-300 hover:bg-[#e74c3c] hover:border-[#e74c3c] group transition-all duration-200"
        onClick={handleDeleteProperties}
        aria-label="Delete properties"
      >
        <Trash className="h-4 w-4 text-[#e74c3c] group-hover:text-white transition-colors duration-200" />
      </Button>
    </div>
  );
};
