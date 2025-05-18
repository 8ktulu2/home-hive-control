
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileSpreadsheet, FileText, Download, HelpCircle, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { Property } from '@/types/property';
import { PropertyHistoricalData } from './types';
import { Link } from 'react-router-dom';

interface FinancialReportsProps {
  properties: Property[];
  selectedYear: number;
  selectedPropertyId: string;
  historicalData: PropertyHistoricalData[];
  annualTotals: any;
  openFiscalInfoModal?: () => void;
}

const FinancialReports = ({
  properties,
  selectedYear,
  selectedPropertyId,
  historicalData,
  annualTotals,
  openFiscalInfoModal
}: FinancialReportsProps) => {
  const [reportType, setReportType] = useState('annual');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [includeCategories, setIncludeCategories] = useState({
    income: true,
    expenses: true,
    occupancy: true,
    metrics: true,
    transactions: true
  });
  const [generateAll, setGenerateAll] = useState(false);

  const generateReport = () => {
    // Implementación para generar y descargar el informe
    const reportName = reportType === 'annual' 
      ? `Informe_Anual_${selectedYear}_${selectedPropertyId !== 'all' ? selectedPropertyId : 'Todas'}`
      : reportType === 'quarterly' 
        ? `Informe_Trimestral_${selectedYear}_${selectedPropertyId !== 'all' ? selectedPropertyId : 'Todas'}`
        : `Informe_Mensual_${selectedYear}_${selectedPropertyId !== 'all' ? selectedPropertyId : 'Todas'}`;
    
    toast.info(`Generando informe ${reportName}.${reportFormat}`, {
      description: generateAll 
        ? "Generando informes para todas las propiedades. Esto puede tardar unos momentos." 
        : "Tu informe estará descargado en unos momentos."
    });
    
    // Simulamos la descarga después de un tiempo
    setTimeout(() => {
      toast.success(
        generateAll 
          ? `Los informes para todas las propiedades han sido descargados correctamente` 
          : `El informe ${reportName}.${reportFormat} ha sido descargado correctamente`, 
        {
          description: generateAll 
            ? "Puedes encontrar los archivos en tu carpeta de descargas." 
            : "Puedes encontrar el archivo en tu carpeta de descargas."
        }
      );
    }, generateAll ? 3000 : 2000);
  };

  return (
    <Card className="bg-[#292F3F] border-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Generación de Informes</CardTitle>
            <CardDescription className="text-[#8E9196]">
              Crea informes personalizados para análisis y declaraciones
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {openFiscalInfoModal && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#8E9196] hover:text-white hover:bg-[#3A3F4E]"
                onClick={openFiscalInfoModal}
                title="Información detallada sobre datos fiscales"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="bg-[#3A3F4E] text-white border-[#8E9196]/40 hover:bg-[#4A4F5E]"
              asChild
            >
              <Link to="/fiscal-report">
                <FileDown className="h-4 w-4 mr-2" />
                Informes Fiscales Avanzados
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type" className="text-white">Tipo de Informe</Label>
              <Select defaultValue={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type" className="bg-[#1A1F2C] border-[#8E9196]/40">
                  <SelectValue placeholder="Seleccionar tipo de informe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Informe Anual</SelectItem>
                  <SelectItem value="quarterly">Informe Trimestral</SelectItem>
                  <SelectItem value="monthly">Informe Mensual</SelectItem>
                  <SelectItem value="tax">Informe para Impuestos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="report-format" className="text-white">Formato de Informe</Label>
              <Select defaultValue={reportFormat} onValueChange={setReportFormat}>
                <SelectTrigger id="report-format" className="bg-[#1A1F2C] border-[#8E9196]/40">
                  <SelectValue placeholder="Seleccionar formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF (Presentación)</SelectItem>
                  <SelectItem value="csv">CSV (Excel/Hojas de cálculo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedPropertyId === 'all' && (
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="generate-all" 
                  checked={generateAll}
                  onCheckedChange={(checked) => setGenerateAll(!!checked)}
                />
                <Label 
                  htmlFor="generate-all" 
                  className="text-[#E5DEFF] cursor-pointer"
                >
                  Generar informes para todas las propiedades
                </Label>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <Label className="text-white">Contenido del Informe</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="income" 
                  checked={includeCategories.income}
                  onCheckedChange={(checked) => 
                    setIncludeCategories({...includeCategories, income: !!checked})
                  }
                />
                <Label htmlFor="income" className="text-[#E5DEFF]">Ingresos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="expenses" 
                  checked={includeCategories.expenses}
                  onCheckedChange={(checked) => 
                    setIncludeCategories({...includeCategories, expenses: !!checked})
                  }
                />
                <Label htmlFor="expenses" className="text-[#E5DEFF]">Gastos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="occupancy" 
                  checked={includeCategories.occupancy}
                  onCheckedChange={(checked) => 
                    setIncludeCategories({...includeCategories, occupancy: !!checked})
                  }
                />
                <Label htmlFor="occupancy" className="text-[#E5DEFF]">Datos de Ocupación</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="metrics" 
                  checked={includeCategories.metrics}
                  onCheckedChange={(checked) => 
                    setIncludeCategories({...includeCategories, metrics: !!checked})
                  }
                />
                <Label htmlFor="metrics" className="text-[#E5DEFF]">Métricas y KPIs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="transactions" 
                  checked={includeCategories.transactions}
                  onCheckedChange={(checked) => 
                    setIncludeCategories({...includeCategories, transactions: !!checked})
                  }
                />
                <Label htmlFor="transactions" className="text-[#E5DEFF]">Listado de Transacciones</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700"
            onClick={generateReport}
          >
            <Download className="h-4 w-4 mr-2" />
            {reportFormat === 'pdf' ? (
              <FileText className="h-4 w-4 mr-2" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            )}
            {generateAll ? 'Generar y Descargar Todos los Informes' : 'Generar y Descargar Informe'}
          </Button>
        </div>

        <div className="bg-[#1A1F2C] p-4 rounded-md border border-[#8E9196]/20">
          <h3 className="text-white font-medium text-sm mb-2">Vista Previa de Datos del Informe</h3>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-[#8E9196]">Año:</span>
              <span className="text-white">{selectedYear}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-[#8E9196]">Propiedad(es):</span>
              <span className="text-white">
                {selectedPropertyId === 'all' ? 'Todas las propiedades' : 
                  properties.find(p => p.id === selectedPropertyId)?.name || selectedPropertyId}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-[#8E9196]">Total Ingresos:</span>
              <span className="text-green-500">{annualTotals.totalRent.toFixed(2)}€</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-[#8E9196]">Total Gastos:</span>
              <span className="text-amber-500">{annualTotals.totalExpenses.toFixed(2)}€</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-[#8E9196]">Beneficio Neto:</span>
              <span className={annualTotals.totalProfit >= 0 ? "text-green-500" : "text-red-500"}>
                {annualTotals.totalProfit.toFixed(2)}€
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-[#8E9196]">Ocupación:</span>
              <span className="text-white">{annualTotals.occupancyRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialReports;
