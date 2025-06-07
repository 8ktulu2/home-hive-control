
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface HistoricalPropertyFormActionsProps {
  historicalYear: number;
  propertyId: string;
}

const HistoricalPropertyFormActions = ({ 
  historicalYear, 
  propertyId 
}: HistoricalPropertyFormActionsProps) => {
  const navigate = useNavigate();
  
  const handleCancel = () => {
    navigate(`/historicos/property/${propertyId}/${historicalYear}`);
  };
  
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        type="button" 
        onClick={handleCancel}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al Histórico
      </Button>
      <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
        Guardar Cambios Históricos
      </Button>
    </div>
  );
};

export default HistoricalPropertyFormActions;
