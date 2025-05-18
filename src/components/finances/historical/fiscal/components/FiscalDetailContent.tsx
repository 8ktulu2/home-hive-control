
import React, { useState } from 'react';
import { PropertyHistoricalData } from '../../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FiscalDetailCard from './FiscalDetailCard';
import PropertyFiscalSection from './PropertyFiscalSection';
import EmptyFiscalState from './EmptyFiscalState';
import FiscalInfoModal from './FiscalInfoModal';
import { useFiscalData } from '../hooks/useFiscalData';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { exportPropertyTaxDataToPDF } from '@/utils/pdfExport';

interface FiscalDetailContentProps {
  filteredData: PropertyHistoricalData[];
  selectedYear: number;
}

const FiscalDetailContent = ({ filteredData, selectedYear }: FiscalDetailContentProps) => {
  const { fiscalData, handleSaveFiscalData } = useFiscalData(filteredData, selectedYear);
  const [showFiscalInfoModal, setShowFiscalInfoModal] = useState(false);
  
  const handleGenerateAllReports = () => {
    if (filteredData.length === 0) {
      toast.error("No hay datos fiscales para exportar");
      return;
    }
    
    toast.info(`Generando informes fiscales para ${filteredData.length} propiedades...`, { 
      duration: 3000,
      description: "Este proceso puede tardar unos momentos."
    });
    
    setTimeout(() => {
      try {
        // En una implementación real, aquí se generarían múltiples PDFs
        filteredData.forEach((property, index) => {
          // Simulamos un pequeño retraso entre cada informe
          setTimeout(() => {
            const propertyFiscalData = fiscalData[property.propertyId];
            if (propertyFiscalData) {
              const filename = `Informe_Fiscal_${property.propertyName.replace(/\s+/g, "_")}_${selectedYear}.pdf`;
              exportFiscalDataToPDF(propertyFiscalData, property.propertyName, selectedYear, filename);
            }
            
            // Notificación final cuando se completa todo
            if (index === filteredData.length - 1) {
              toast.success(`Generados ${filteredData.length} informes fiscales`, { 
                duration: 5000,
                description: "Puedes encontrar los archivos en tu carpeta de descargas."
              });
            }
          }, index * 800);
        });
      } catch (error) {
        console.error("Error exporting to PDF:", error);
        toast.error("Error al exportar los informes PDF", { duration: 3000 });
      }
    }, 2000);
  };
  
  if (filteredData.length === 0) {
    return <EmptyFiscalState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <FiscalDetailCard 
            selectedYear={selectedYear}
            showFiscalInfoModal={() => setShowFiscalInfoModal(true)}
          />
        </div>
        
        {filteredData.length > 1 && (
          <div className="ml-4">
            <Button
              className="whitespace-nowrap bg-blue-600 hover:bg-blue-700"
              onClick={handleGenerateAllReports}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Generar {filteredData.length} informes
            </Button>
          </div>
        )}
      </div>

      {filteredData.map(property => {
        const propertyFiscalData = fiscalData[property.propertyId];
        
        return propertyFiscalData ? (
          <PropertyFiscalSection
            key={property.propertyId}
            property={property}
            selectedYear={selectedYear}
            fiscalData={propertyFiscalData}
            onSaveFiscalData={handleSaveFiscalData}
            showHelp={() => setShowFiscalInfoModal(true)}
          />
        ) : null;
      })}
      
      <FiscalInfoModal 
        open={showFiscalInfoModal} 
        onOpenChange={setShowFiscalInfoModal} 
      />
    </div>
  );
};

export default FiscalDetailContent;
