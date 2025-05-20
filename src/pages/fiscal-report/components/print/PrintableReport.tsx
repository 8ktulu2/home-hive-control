
import React from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import PropertyFiscalTable from './PropertyFiscalTable';
import PrintHeader from './PrintHeader';
import PrintFooter from './PrintFooter';
import { FiscalData } from '@/components/finances/historical/types';

interface PrintableReportProps {
  fiscalData: Record<string, FiscalData>;
  properties: Property[];
  selectedPropertyIds: string[];
  selectedYears: number[];
  onClose: () => void;
}

const PrintableReport: React.FC<PrintableReportProps> = ({
  fiscalData,
  properties,
  selectedPropertyIds,
  selectedYears,
  onClose
}) => {
  const selectedProperties = properties.filter(prop => 
    selectedPropertyIds.includes(prop.id)
  );
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto print:static print:overflow-visible">
      {/* Print Controls - Hidden when printing */}
      <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center print:hidden">
        <h2 className="text-xl font-bold">Vista previa de impresión</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button 
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>
      
      {/* Printable Content */}
      <div className="p-8 max-w-4xl mx-auto">
        <PrintHeader 
          propertiesCount={selectedProperties.length} 
          yearsCount={selectedYears.length}
        />
        
        {selectedProperties.map(property => (
          <div key={property.id} className="mb-10 page-break-inside-avoid">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">{property.name}</h3>
            
            <PropertyFiscalTable 
              property={property}
              selectedYears={selectedYears}
              fiscalData={fiscalData}
            />
          </div>
        ))}
        
        <PrintFooter />
      </div>
    </div>
  );
};

export default PrintableReport;
