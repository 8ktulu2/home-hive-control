
import { useState } from 'react';
import { toast } from 'sonner';
import { Property } from '@/types/property';
import { generateHistoricalData } from '../components/utils/fiscalReportUtils';
import { useFiscalData } from '@/components/finances/historical/fiscal/hooks/useFiscalData';
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
      
      // Crear una estructura para almacenar todos los datos fiscales
      for (const propId of selectedPropertyIds) {
        const property = properties.find(p => p.id === propId);
        if (!property) continue;
        
        for (const year of selectedYears) {
          const historicalData = generateHistoricalData(propId, property, year);
          
          // Obtener datos fiscales para esta propiedad y año
          const { fiscalData } = useFiscalData([historicalData], year);
          const propertyFiscalData = fiscalData[propId];
          
          if (propertyFiscalData) {
            allFiscalData.push({
              property: property,
              year: year,
              fiscalData: propertyFiscalData
            });
          }
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
