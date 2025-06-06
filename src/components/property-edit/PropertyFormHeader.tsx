
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PropertyFormHeaderProps {
  isNewProperty: boolean;
  propertyName?: string;
  historicalYear?: number;
}

const PropertyFormHeader = ({ isNewProperty, propertyName, historicalYear }: PropertyFormHeaderProps) => {
  const getTitle = () => {
    if (isNewProperty) return 'Nueva Propiedad';
    if (historicalYear) return `Editar ${propertyName} (Histórico ${historicalYear})`;
    return `Editar ${propertyName}`;
  };

  const getDescription = () => {
    if (isNewProperty) return 'Crea una nueva propiedad en tu cartera';
    if (historicalYear) return `Modifica los detalles de la propiedad para el año ${historicalYear}`;
    return 'Modifica los detalles de la propiedad';
  };

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">
        {getTitle()}
      </h1>
      <p className="text-muted-foreground">
        {getDescription()}
      </p>
    </div>
  );
};

export default PropertyFormHeader;
