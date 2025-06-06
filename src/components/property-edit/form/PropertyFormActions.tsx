
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PropertyFormActionsProps {
  isNewProperty: boolean;
  historicalYear?: number;
}

const PropertyFormActions = ({ isNewProperty, historicalYear }: PropertyFormActionsProps) => {
  const navigate = useNavigate();
  
  const getButtonText = () => {
    if (isNewProperty) return 'Crear Propiedad';
    if (historicalYear) return `Guardar Cambios (${historicalYear})`;
    return 'Guardar Cambios';
  };
  
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" type="button" onClick={() => navigate(-1)}>
        Cancelar
      </Button>
      <Button type="submit">
        {getButtonText()}
      </Button>
    </div>
  );
};

export default PropertyFormActions;
