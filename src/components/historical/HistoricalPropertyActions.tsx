
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HistoricalPropertyActionsProps {
  propertyId: string;
  yearNumber: number;
}

const HistoricalPropertyActions: React.FC<HistoricalPropertyActionsProps> = ({ 
  propertyId, 
  yearNumber 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end mt-6">
      <Button 
        onClick={() => navigate(`/historicos/property/${propertyId}/${yearNumber}/edit`)}
        className="bg-primary hover:bg-primary/90"
      >
        <Save className="h-4 w-4 mr-2" />
        Editar Datos del Año {yearNumber}
      </Button>
    </div>
  );
};

export default HistoricalPropertyActions;
