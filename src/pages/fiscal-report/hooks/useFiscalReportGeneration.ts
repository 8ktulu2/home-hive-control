
import { useState } from 'react';
import { toast } from 'sonner';
import { Property } from '@/types/property';
import { generateHistoricalData } from '../components/utils/fiscalReportUtils';
import { generateConsolidatedPdfReport } from '../components/utils/pdfGenerator';

interface UseFiscalReportGenerationProps {
  properties: Property[];
  selectedPropertyIds: string[];
  selectedYears: number[];
}

export const useFiscalReportGeneration = ({
  properties,
  selectedPropertyIds,
  selectedYears
}: UseFiscalReportGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReports = async () => {
    if (selectedPropertyIds.length === 0 || selectedYears.length === 0) {
      toast.error("Selecciona al menos una propiedad y un año para generar informes");
      return;
    }
    
    setIsGenerating(true);
    
    const totalReports = selectedPropertyIds.length * selectedYears.length;
    
    toast.info(`Generando informe consolidado con ${totalReports} conjuntos de datos...`, { 
      duration: 5000,
      description: "Este proceso puede tardar unos momentos."
    });
    
    try {
      // Recopilar todos los datos fiscales
      const allFiscalData = [];
      
      // Crear una estructura para almacenar todos los datos fiscales, without using hooks in loops
      for (const propId of selectedPropertyIds) {
        const property = properties.find(p => p.id === propId);
        if (!property) continue;
        
        for (const year of selectedYears) {
          const historicalData = generateHistoricalData(propId, property, year);
          
          // Calculate fiscal data directly instead of using a hook
          const totalRent = historicalData.months.reduce((sum, month) => sum + month.rentAmount, 0);
          
          // Create fiscal data object manually based on the same calculations as in useFiscalData
          const fiscalData = {
            year: year,
            propertyId: propId,
            totalIncome: totalRent,
            totalExpenses: Math.round(totalRent * 0.6),
            netIncome: Math.round(totalRent * 0.4),
            rentalIncome: totalRent,
            subsidies: 0,
            otherIncome: 0,
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
            deductibleExpenses: {
              ibi: Math.round(totalRent * 0.05),
              community: Math.round(totalRent * 0.1),
              mortgage: Math.round(totalRent * 0.2),
              insurance: Math.round(totalRent * 0.03),
              maintenance: Math.round(totalRent * 0.05),
            },
            amortization: Math.round(totalRent * 0.15) + Math.round(totalRent * 0.05),
            applicableReduction: 50,
            reducedNetProfit: Math.round(totalRent * 0.4 * 0.5),
            taxableIncome: Math.round(totalRent * 0.4 * 0.5),
            inTensionedArea: false,
            rentLoweredFromPrevious: false,
            youngTenant: false,
            recentlyRenovated: false
          };
          
          allFiscalData.push({
            property: property,
            year: year,
            fiscalData: fiscalData
          });
        }
      }

      // Generar informe PDF
      await generateConsolidatedPdfReport(allFiscalData);
      
      toast.success("Informe fiscal consolidado descargado correctamente", {
        duration: 5000,
        description: "El informe se ha guardado en tu carpeta de descargas."
      });
      
    } catch (error) {
      console.error("Error al generar informe consolidado:", error);
      toast.error("Error al exportar el informe PDF consolidado", { duration: 5000 });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    setIsGenerating,
    handleGenerateReports
  };
};
