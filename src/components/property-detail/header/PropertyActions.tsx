
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash } from 'lucide-react';

interface PropertyActionsProps {
  propertyId: string;
}

const PropertyActions: React.FC<PropertyActionsProps> = ({ propertyId }) => {
  return (
    <div className="flex items-center justify-between">
      <Link to="/">
        <Button variant="ghost" size="sm" className="flex gap-1 items-center text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>
      </Link>
      <div className="flex gap-2">
        <Link to={`/property/${propertyId}/edit`}>
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
  );
};

export default PropertyActions;
