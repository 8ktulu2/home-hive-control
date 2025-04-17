
import { useState } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft, Edit, Trash, AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface PropertyDetailHeaderProps {
  property: Property;
  onRentPaidChange: (paid: boolean) => void;
}

const PropertyDetailHeader = ({ property, onRentPaidChange }: PropertyDetailHeaderProps) => {
  const [rentPaid, setRentPaid] = useState(property.rentPaid);

  const handleRentPaidChange = (checked: boolean) => {
    setRentPaid(checked);
    onRentPaidChange(checked);
    
    if (checked) {
      toast.success('Alquiler marcado como pagado');
    } else {
      toast.warning('Alquiler marcado como pendiente');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="sm" className="flex gap-1 items-center text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link to={`/property/${property.id}/edit`}>
            <Button variant="outline" size="sm" className="flex gap-1 items-center">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          </Link>
          <Button variant="destructive" size="sm" className="flex gap-1 items-center">
            <Trash className="h-4 w-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative w-20 h-20 overflow-hidden rounded-lg shrink-0">
          <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{property.name}</h1>
          <p className="text-muted-foreground">{property.address}</p>
        </div>
        <div className="flex items-center gap-4 pt-2 sm:pt-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Alquiler pagado</div>
            <Switch 
              checked={rentPaid}
              onCheckedChange={handleRentPaidChange}
            />
          </div>
          <div className="flex items-center gap-1">
            {rentPaid ? (
              <>
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">Pagado</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium text-warning">Pendiente</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailHeader;
