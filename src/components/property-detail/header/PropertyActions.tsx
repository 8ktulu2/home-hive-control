
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface PropertyActionsProps {
  propertyId: string;
  historicalYear?: number;
}

const PropertyActions = ({ propertyId, historicalYear }: PropertyActionsProps) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    if (historicalYear) {
      // Navigate to historical edit mode - this should open the "FICHERO" for that year
      navigate(`/property/edit/${propertyId}?year=${historicalYear}`);
    } else {
      // Navigate to current year edit mode
      navigate(`/property/edit/${propertyId}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleEdit}
        className={`flex items-center gap-1 ${
          historicalYear ? 'border-yellow-400 text-yellow-800 hover:bg-yellow-100 bg-yellow-50' : ''
        }`}
      >
        <Pencil className="h-4 w-4" />
        {historicalYear ? `Editar ${historicalYear}` : 'Editar'}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={historicalYear ? 'border-yellow-400 text-yellow-800 hover:bg-yellow-100 bg-yellow-50' : ''}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleEdit}>
            {historicalYear ? `Editar datos ${historicalYear}` : 'Editar propiedad'}
          </DropdownMenuItem>
          {!historicalYear && (
            <DropdownMenuItem onClick={() => navigate(`/property/${propertyId}/duplicate`)}>
              Duplicar propiedad
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PropertyActions;
