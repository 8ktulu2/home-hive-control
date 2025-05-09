
import React, { useState } from 'react';
import { PropertyHistoricalData, FiscalData } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FileDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { exportFiscalDataToPDF } from '@/utils/pdfExport';
import { toast } from 'sonner';
import FiscalDetailForm from './fiscal/FiscalDetailForm';

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
        // Basic info
        year: selectedYear,
        propertyId: property.propertyId,
        totalIncome: totalRent,
        totalExpenses: Math.round(totalRent * 0.6),
        netIncome: Math.round(totalRent * 0.4),
        
        // Ingresos
        rentalIncome: totalRent,
        subsidies: 0,
        otherIncome: 0,
        
        // Gastos deducibles
        ibi: Math.round(totalRent * 0.05),
        communityFees: Math.round(totalRent * 0.1),
        mortgageInterest: Math.round(totalRent * 0.2),
        homeInsurance: Math.round(totalRent * 0.03),
        maintenance: Math.round(totalRent * 0.05),
        agencyFees: 0,
        administrativeFees: 0,
        propertyDepreciation: 0,
        buildingDepreciation: Math.round(totalRent * 0.15),
        furnitureDepreciation: Math.round(totalRent * 0.05),
        utilities: 0,
        municipalTaxes: Math.round(totalRent * 0.02),
        legalFees: 0,
        badDebts: 0,
        otherExpenses: 0,
        
        // Original fields
        deductibleExpenses: {
          ibi: Math.round(totalRent * 0.05),
          community: Math.round(totalRent * 0.1),
          mortgage: Math.round(totalRent * 0.2),
          insurance: Math.round(totalRent * 0.03),
          maintenance: Math.round(totalRent * 0.05),
        },
        amortization: Math.round(totalRent * 0.15) + Math.round(totalRent * 0.05),
        
        // Reducciones
        applicableReduction: 50,
        reducedNetProfit: Math.round(totalRent * 0.4 * 0.5),
        taxableIncome: Math.round(totalRent * 0.4 * 0.5),
        
        // Additional reduction info
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
    
    toast.info("Generando informe fiscal detallado...", { duration: 3000 });
    
    setTimeout(() => {
      try {
        const filename = `Informe_Fiscal_${property.propertyName.replace(/\s+/g, "_")}_${selectedYear}.pdf`;
        exportFiscalDataToPDF(data, property.propertyName, selectedYear, filename);
        
        toast.success("Informe fiscal PDF generado correctamente", { duration: 3000 });
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

      {filteredData.map(property => {
        // Ensure that fiscal data exists for this property
        const propertyFiscalData = fiscalData[property.propertyId];
        
        return (
          <div key={property.propertyId} className="mb-6 last:mb-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">{property.propertyName}</h3>
              <Button
                size="sm"
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => handleExportPDF(property.propertyId)}
                title="Exportar informe fiscal detallado con gráficos y explicaciones"
              >
                <FileDown className="h-4 w-4" /> 
                <span className="hidden sm:inline">Generar Informe Fiscal</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
            {propertyFiscalData && (
              <FiscalDetailForm
                initialData={propertyFiscalData}
                onSave={(data) => handleSaveFiscalData(property.propertyId, data)}
                propertyName={property.propertyName}
                selectedYear={selectedYear}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FiscalDetailContent;
