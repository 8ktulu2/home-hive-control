
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info, Plus } from 'lucide-react';

interface HistoricalHeaderProps {
  openImportModal: () => void;
  openHelpModal: () => void;
}

const HistoricalHeader = ({ openImportModal, openHelpModal }: HistoricalHeaderProps) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-1">Histórico</h1>
        <p className="text-muted-foreground">
          Datos históricos y declaración fiscal
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={openImportModal}
        >
          <Plus className="h-4 w-4" />
          <span>Añadir Datos</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={openHelpModal}
        >
          <Info className="h-4 w-4" />
          <span>Guía IRPF</span>
        </Button>
      </div>
    </div>
  );
};

export default HistoricalHeader;
