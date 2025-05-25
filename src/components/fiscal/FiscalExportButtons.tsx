
import React from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, FileSpreadsheet, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface FiscalExportButtonsProps {
  properties: Property[];
  selectedYear: number;
  fiscalData: FiscalData;
}

const FiscalExportButtons: React.FC<FiscalExportButtonsProps> = ({
  properties,
  selectedYear,
  fiscalData
}) => {
  const handleExportPDF = (type: 'individual' | 'consolidated' | 'comparative') => {
    toast.info(`Generando informe PDF ${type}...`, { duration: 2000 });
    
    setTimeout(() => {
      // Aquí iría la lógica real de generación de PDF
      toast.success(`Informe PDF ${type} generado correctamente`, { duration: 3000 });
    }, 1500);
  };

  const handleExportExcel = (type: 'individual' | 'consolidated') => {
    toast.info(`Generando archivo Excel ${type}...`, { duration: 2000 });
    
    setTimeout(() => {
      // Aquí iría la lógica real de generación de Excel
      toast.success(`Archivo Excel ${type} generado correctamente`, { duration: 3000 });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Informes Fiscales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={() => handleExportPDF('individual')}
            className="flex items-center gap-2 h-12"
            variant="outline"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm">PDF Individual</span>
          </Button>
          
          <Button 
            onClick={() => handleExportPDF('consolidated')}
            className="flex items-center gap-2 h-12"
            variant="outline"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm">PDF Consolidado</span>
          </Button>
          
          <Button 
            onClick={() => handleExportPDF('comparative')}
            className="flex items-center gap-2 h-12"
            variant="outline"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm">PDF Comparativo</span>
          </Button>
          
          <Button 
            onClick={() => handleExportExcel('consolidated')}
            className="flex items-center gap-2 h-12"
            variant="outline"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="text-sm">Excel Completo</span>
          </Button>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Tipos de Informe</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Individual:</strong> Informe fiscal por cada propiedad</li>
            <li>• <strong>Consolidado:</strong> Informe fiscal de todas las propiedades</li>
            <li>• <strong>Comparativo:</strong> Evolución fiscal de los últimos 5 años</li>
            <li>• <strong>Excel:</strong> Datos detallados para análisis personalizado</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiscalExportButtons;
