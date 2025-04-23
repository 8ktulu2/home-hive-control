
import { File, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document } from '@/types/property';

interface PrimaryContractProps {
  contract: Document;
  onDownload: (document: Document) => void;
}

export const PrimaryContract = ({ contract, onDownload }: PrimaryContractProps) => {
  return (
    <div className="mb-4 p-3 bg-primary/10 rounded-lg">
      <div className="flex items-start gap-3">
        <File className="h-10 w-10 text-primary" />
        <div className="flex-1">
          <h3 className="font-medium mb-1">Contrato Principal</h3>
          <p className="text-sm text-muted-foreground mb-2">{contract.name}</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-primary flex items-center gap-1"
              onClick={() => onDownload(contract)}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="text-xs">Descargar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
