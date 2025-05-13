
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { PropertyHistoricalData, FiscalData } from '../../types';
import FiscalDetailForm from '../FiscalDetailForm';
import { exportFiscalDataToPDF } from '@/utils/pdfExport';

interface PropertyFiscalSectionProps {
  property: PropertyHistoricalData;
  selectedYear: number;
  fiscalData: FiscalData;
  onSaveFiscalData: (propertyId: string, data: FiscalData) => void;
}

const PropertyFiscalSection = ({ 
  property, 
  selectedYear, 
  fiscalData, 
  onSaveFiscalData 
}: PropertyFiscalSectionProps) => {
  
  const handleExportPDF = () => {
    if (!fiscalData) {
      toast.error("No hay datos fiscales disponibles para exportar.");
      return;
    }
    
    toast.info("Generando informe fiscal detallado...", { duration: 3000 });
    
    setTimeout(() => {
      try {
        const filename = `Informe_Fiscal_${property.propertyName.replace(/\s+/g, "_")}_${selectedYear}.pdf`;
        exportFiscalDataToPDF(fiscalData, property.propertyName, selectedYear, filename);
        
        toast.success("Informe fiscal PDF generado correctamente", { duration: 3000 });
      } catch (error) {
        console.error("Error exporting to PDF:", error);
        toast.error("Error al exportar el informe PDF", { duration: 3000 });
      }
    }, 1500);
  };

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{property.propertyName}</h3>
        <Button
          size="sm"
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
          onClick={handleExportPDF}
          title="Exportar informe fiscal detallado con gráficos y explicaciones"
        >
          <FileDown className="h-4 w-4" /> 
          <span className="hidden sm:inline">Generar Informe Fiscal</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>
      <FiscalDetailForm
        initialData={fiscalData}
        onSave={(data) => onSaveFiscalData(property.propertyId, data)}
        propertyName={property.propertyName}
        selectedYear={selectedYear}
      />
    </div>
  );
};

export default PropertyFiscalSection;
