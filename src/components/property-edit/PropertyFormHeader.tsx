
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PropertyFormHeaderProps {
  isNewProperty: boolean;
  propertyName?: string;
}

const PropertyFormHeader = ({ isNewProperty, propertyName }: PropertyFormHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">
        {isNewProperty ? 'Nueva Propiedad' : `Editar ${propertyName}`}
      </h1>
      <p className="text-muted-foreground">
        {isNewProperty
          ? 'Crea una nueva propiedad en tu cartera'
          : 'Modifica los detalles de la propiedad'}
      </p>
    </div>
  );
};

export default PropertyFormHeader;
