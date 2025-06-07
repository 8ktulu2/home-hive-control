
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate, useLocation } from 'react-router-dom';

interface PropertyActionsProps {
  propertyId: string;
  historicalYear?: number;
}

const PropertyActions = ({ propertyId, historicalYear }: PropertyActionsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleEdit = () => {
    if (historicalYear) {
      // Navegación para edición histórica - contexto preservado
      navigate(`/historicos/property/${propertyId}/${historicalYear}/edit`);
    } else {
      // Navegación normal para año actual
      navigate(`/property/edit/${propertyId}`);
    }
  };

  const handleDuplicate = () => {
    if (historicalYear) {
      // No permitir duplicación desde contexto histórico
      return;
    }
    navigate(`/property/${propertyId}/duplicate`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleEdit}
        className="flex items-center gap-1"
      >
        <Pencil className="h-4 w-4" />
        Editar
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleEdit}>
            Editar propiedad
          </DropdownMenuItem>
          {!historicalYear && (
            <DropdownMenuItem onClick={handleDuplicate}>
              Duplicar propiedad
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PropertyActions;
