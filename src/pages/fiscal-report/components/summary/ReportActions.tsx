
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

interface ReportActionsProps {
  totalReports: number;
  isGenerating: boolean;
  onGenerate: () => Promise<void>;
  disabled: boolean;
}

const ReportActions: React.FC<ReportActionsProps> = ({
  totalReports,
  isGenerating,
  onGenerate,
  disabled
}) => {
  return (
    <div className="flex items-center justify-between pt-2">
      <div>
        <p className="text-sm font-medium">Total de informes a generar:</p>
        <p className="text-2xl font-bold">{totalReports}</p>
      </div>
      <Button
        size="lg"
        disabled={disabled || isGenerating}
        onClick={onGenerate}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <FileDown className="mr-2 h-4 w-4" />
        {isGenerating ? "Descargando..." : "Descargar Informe Consolidado"}
      </Button>
    </div>
  );
};

export default ReportActions;
