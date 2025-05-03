
import React, { useState } from 'react';
import { PropertyHistoricalData, FiscalData } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FiscalDetailForm from './FiscalDetailForm';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { exportFiscalDataToExcel } from '@/utils/excelExport';
import { exportFiscalDataToPDF } from '@/utils/pdfExport';
import { toast } from 'sonner';

interface FiscalDetailContentProps {
  filteredData: PropertyHistoricalData[];
  selectedYear: number;
}

const FiscalDetailContent = ({ filteredData, selectedYear }: FiscalDetailContentProps) => {
  const isMobile = useIsMobile();
  const [fiscalData, setFiscalData] = useState<Record<string, FiscalData>>(() => {
    // Initialize with default data for each property
    const initialData: Record<string, FiscalData> = {};
    
    filteredData.forEach(property => {
      // Calculate some initial values based on the monthly data
      const totalRent = property.months.reduce((sum, month) => sum + month.rentAmount, 0);
      const totalExpenses = property.months.reduce((sum, month) => sum + month.totalExpenses, 0);
      const netProfit = totalRent - totalExpenses;
      
      // Default reduction is 50%
      const reducedNetProfit = netProfit > 0 ? netProfit * 0.5 : netProfit;
      
      initialData[property.propertyId] = {
        // Ingresos
        rentalIncome: totalRent,
        subsidies: 0,
        otherIncome: 0,
        
        // Gastos deducibles
        ibi: Math.round(totalRent * 0.05), // Estimated IBI
        communityFees: Math.round(totalRent * 0.1), // Estimated community fees
        mortgageInterest: Math.round(totalRent * 0.2), // Estimated mortgage interest
        homeInsurance: Math.round(totalRent * 0.03), // Estimated insurance
        maintenance: Math.round(totalRent * 0.05), // Estimated maintenance
        agencyFees: 0,
        administrativeFees: 0,
        propertyDepreciation: 0,
        buildingDepreciation: Math.round(totalRent * 0.15), // Estimated building depreciation (3%)
        furnitureDepreciation: Math.round(totalRent * 0.05), // Estimated furniture depreciation (10%)
        utilities: 0,
        municipalTaxes: Math.round(totalRent * 0.02), // Estimated municipal taxes
        legalFees: 0,
        badDebts: 0,
        otherExpenses: 0,
        
        // Totales calculados
        totalIncome: totalRent,
        totalExpenses: Math.round(totalRent * 0.6), // Estimated total expenses
        netProfit: Math.round(totalRent * 0.4), // Estimated net profit
        
        // Reducciones
        applicableReduction: 50, // Default 50%
        reducedNetProfit: Math.round(totalRent * 0.4 * 0.5), // Estimated reduced net profit
        
        // Información adicional
        inTensionedArea: false,
        rentLoweredFromPrevious: false,
        youngTenant: false,
        recentlyRenovated: false
      };
    });
    
    return initialData;
  });
  
  const handleSaveFiscalData = (propertyId: string, data: FiscalData) => {
    setFiscalData(prev => ({
      ...prev,
      [propertyId]: data
    }));
  };

  const handleExportExcel = (propertyId: string) => {
    const data = fiscalData[propertyId];
    if (!data) {
      toast.error("No hay datos fiscales disponibles para exportar.");
      return;
    }
    
    const property = filteredData.find(p => p.propertyId === propertyId);
    if (!property) {
      toast.error("No se encontró la propiedad seleccionada.");
      return;
    }
    
    toast.info("Preparando exportación a Excel...", { duration: 2000 });
    
    setTimeout(() => {
      try {
        const filename = `Datos_Fiscales_${property.propertyName.replace(/\s+/g, "_")}_${selectedYear}.xlsx`;
        exportFiscalDataToExcel(data, property.propertyName, selectedYear, filename);
        
        toast.success("Informe Excel exportado correctamente", { duration: 3000 });
      } catch (error) {
        console.error("Error exporting to Excel:", error);
        toast.error("Error al exportar el informe Excel", { duration: 3000 });
      }
    }, 500);
  };

  const handleExportPDF = (propertyId: string) => {
    const data = fiscalData[propertyId];
    if (!data) {
      toast.error("No hay datos fiscales disponibles para exportar.");
      return;
    }
    
    const property = filteredData.find(p => p.propertyId === propertyId);
    if (!property) {
      toast.error("No se encontró la propiedad seleccionada.");
      return;
    }
    
    toast.info("Generando informe PDF detallado...", { duration: 3000 });
    
    setTimeout(() => {
      try {
        const filename = `Informe_Fiscal_${property.propertyName.replace(/\s+/g, "_")}_${selectedYear}.pdf`;
        exportFiscalDataToPDF(data, property.propertyName, selectedYear, filename);
        
        toast.success("Informe PDF generado correctamente", { duration: 3000 });
      } catch (error) {
        console.error("Error exporting to PDF:", error);
        toast.error("Error al exportar el informe PDF", { duration: 3000 });
      }
    }, 1500);
  };

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No hay datos fiscales disponibles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-[#8B5CF6]/20">
        <CardHeader className={isMobile ? "p-4" : ""}>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#8B5CF6]" />
            <CardTitle className="text-lg">Declaración de la Renta {selectedYear}</CardTitle>
          </div>
          <CardDescription>
            Información para la declaración de IRPF
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? "p-4 pt-0" : ""}>
          <div className="bg-[#292F3F] p-4 rounded-lg mb-6 text-sm">
            <p className="mb-2 font-medium">Instrucciones:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {isMobile ? (
                <>
                  <li>Ingresos y gastos: casillas 0062-0075</li>
                  <li>Reducción: casilla 0150</li>
                  <li>Conserve toda la documentación 4 años</li>
                </>
              ) : (
                <>
                  <li>Los ingresos y gastos deben declararse en el apartado de "Rendimientos del capital inmobiliario" (casillas 0062-0075).</li>
                  <li>La reducción por alquiler de vivienda habitual se aplica en la casilla 0150.</li>
                  <li>Todos los gastos deben estar justificados con facturas o recibos a nombre del propietario.</li>
                  <li>El exceso de gastos sobre ingresos puede compensarse en los 4 años siguientes.</li>
                  <li>Conserve toda la documentación durante al menos 4 años.</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      {filteredData.map(property => (
        <div key={property.propertyId} className="mb-6 last:mb-0">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">{property.propertyName}</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => handleExportExcel(property.propertyId)}
                title="Exportar a Excel con tablas estructuradas (UTF-8)"
              >
                <FileSpreadsheet className="h-4 w-4" /> 
                <span className="hidden sm:inline">Excel</span>
                <span className="sm:hidden">XLS</span>
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => handleExportPDF(property.propertyId)}
                title="Exportar a PDF con gráficos visuales y explicaciones detalladas"
              >
                <Download className="h-4 w-4" /> 
                <span className="hidden sm:inline">Exportar PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
          </div>
          <FiscalDetailForm
            initialData={fiscalData[property.propertyId]}
            onSave={(data) => handleSaveFiscalData(property.propertyId, data)}
            propertyName={property.propertyName}
            selectedYear={selectedYear}
          />
        </div>
      ))}
    </div>
  );
};

export default FiscalDetailContent;
