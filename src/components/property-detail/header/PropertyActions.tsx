
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface PropertyActionsProps {
  propertyId: string;
}

const PropertyActions = ({ propertyId }: PropertyActionsProps) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/property/edit/${propertyId}`);
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
          <DropdownMenuItem onClick={() => navigate(`/property/${propertyId}/duplicate`)}>
            Duplicar propiedad
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PropertyActions;
