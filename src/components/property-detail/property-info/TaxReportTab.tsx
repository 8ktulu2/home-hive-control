
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, HelpCircle, FileDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import TaxReportSummary from './tax-report/TaxReportSummary';
import { exportPropertyTaxDataToPDF } from '@/utils/pdfExport';
import TaxDataDisplay from './tax-report/TaxDataDisplay';
import InsufficientDataMessage from './tax-report/InsufficientDataMessage';
import { useTaxCalculations } from './tax-report/useTaxCalculations';

interface TaxReportTabProps {
  property: Property;
}

const TaxReportTab: React.FC<TaxReportTabProps> = ({ property }) => {
  const [activeAccordion, setActiveAccordion] = useState<string>("property");
  
  // Use the tax calculations hook
  const {
    grossIncome,
    expenses,
    netIncome,
    reductionPercentage,
    reduction,
    taxableIncome
  } = useTaxCalculations(property);

  const handleExportPDF = () => {
    toast.info("Generando informe PDF detallado...", { duration: 3000 });
    setTimeout(() => {
      try {
        const filename = `Informe_Fiscal_${property.name.replace(/\s+/g, "_")}.pdf`;
        exportPropertyTaxDataToPDF(property, filename);
        
        toast.success("Informe fiscal PDF generado correctamente", { duration: 3000 });
      } catch (error) {
        console.error("Error exporting to PDF:", error);
        toast.error("Error al exportar el informe PDF", { duration: 3000 });
      }
    }, 1500);
  };

  // Only show the tab if we have minimal financial data
  if (!property.rent && !property.mortgage?.monthlyPayment && !property.ibi) {
    return <InsufficientDataMessage property={property} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Informe para Declaración de la Renta (IRPF)
        </h2>
        <Button 
          onClick={handleExportPDF} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          title="Exportar a PDF con gráficos visuales y explicaciones detalladas"
        >
          <FileDown className="h-4 w-4" /> Generar Informe PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Datos fiscales</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>Este informe se basa en la normativa del IRPF (Ley 35/2006, Real Decreto 439/2007, y Ley 12/2023).</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaxDataDisplay
                property={property}
                netIncome={netIncome}
                reductionPercentage={reductionPercentage}
                activeAccordion={activeAccordion}
                setActiveAccordion={setActiveAccordion}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <TaxReportSummary 
            grossIncome={grossIncome}
            expenses={expenses}
            netIncome={netIncome}
            reductionPercentage={reductionPercentage}
            reduction={reduction}
            taxableIncome={taxableIncome}
          />
        </div>
      </div>
    </div>
  );
};

export default TaxReportTab;
