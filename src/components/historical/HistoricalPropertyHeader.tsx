
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoricalPropertyHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline" 
      onClick={() => navigate('/historicos')}
      className="mb-4"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Volver a Históricos
    </Button>
  );
};

export default HistoricalPropertyHeader;
