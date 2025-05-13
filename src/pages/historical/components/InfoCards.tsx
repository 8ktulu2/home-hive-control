
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Download } from 'lucide-react';
import { toast } from 'sonner';

interface InfoCardsProps {
  openHelpModal: () => void;
}

const InfoCards = ({ openHelpModal }: InfoCardsProps) => {
  const handleDownloadReport = (reportType: string) => {
    toast.info(`Descargando ${reportType}...`, { duration: 3000 });
    
    setTimeout(() => {
      toast.success(`El informe ${reportType} ha sido descargado correctamente`, { duration: 3000 });
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <Card className="border-violet-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-violet-500" />
            <CardTitle>Informes Financieros</CardTitle>
          </div>
          <CardDescription>
            Descarga informes para análisis y gestión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              Genera informes personalizados para tus necesidades específicas de análisis, gestión o trámites fiscales.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-sky-700" />
                  <span className="text-sm font-medium">Informe Anual</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={() => handleDownloadReport('Anual')}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-sky-700" />
                  <span className="text-sm font-medium">Informe Fiscal</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={() => handleDownloadReport('Fiscal')}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-sky-700" />
                  <span className="text-sm font-medium">Datos Para Excel</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={() => handleDownloadReport('Excel')}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-muted-foreground">
              También puedes crear informes personalizados desde la pestaña de Informes.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCards;
