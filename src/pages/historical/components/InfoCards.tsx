
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Download, FileSpreadsheet, FileText, Info } from 'lucide-react';

interface InfoCardsProps {
  openHelpModal: () => void;
}

const InfoCards = ({ openHelpModal }: InfoCardsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card className="lg:col-span-2 border-violet-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-violet-500" />
            <CardTitle>Declaración de la Renta</CardTitle>
          </div>
          <CardDescription>
            Información para optimizar tu declaración IRPF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            La sección "Datos IRPF" incluye el desglose completo de ingresos y gastos deducibles para la 
            declaración de la renta. Todos los datos son exportables a CSV.
          </p>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={openHelpModal}
            >
              <Info className="h-4 w-4" />
              <span>Ver Guía IRPF Completa</span>
            </Button>
          </div>
        </CardContent>
      </Card>

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
                  <FileText className="h-4 w-4 mr-2 text-sky-700" />
                  <span className="text-sm font-medium">Informe Anual</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-sky-700" />
                  <span className="text-sm font-medium">Informe Fiscal</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-sky-700" />
                  <span className="text-sm font-medium">Datos Para Excel</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">
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
