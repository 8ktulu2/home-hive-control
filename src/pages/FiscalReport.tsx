
import React, { useState } from 'react';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyHistoricalData } from '@/components/finances/historical/types';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { exportPropertyTaxDataToPDF } from '@/utils/pdfExport';
import PropertySelector from '@/components/finances/historical/PropertySelector';
import FiscalDetailContent from '@/components/finances/historical/FiscalDetailContent';

const FiscalReport = () => {
  const { properties, isLoading } = usePropertyLoader();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  
  // Mock data for fiscal details
  const generateHistoricalData = (): PropertyHistoricalData[] => {
    if (!properties) return [];
    
    return properties.map(property => ({
      propertyId: property.id,
      propertyName: property.name,
      months: Array(12).fill(0).map((_, idx) => ({
        month: idx + 1,
        year: selectedYear,
        rentAmount: property.rent || 0,
        totalExpenses: property.ibi 
          ? property.ibi / 12 
          : (property.rent ? property.rent * 0.3 : 0),
        date: new Date(selectedYear, idx, 1)
      }))
    }));
  };

  const historicalData = generateHistoricalData();
  
  const filteredData = selectedPropertyId 
    ? historicalData.filter(p => p.propertyId === selectedPropertyId)
    : historicalData;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Informe Fiscal</h1>
          <Button 
            onClick={() => {
              if (filteredData.length === 0) {
                toast.error("No hay datos fiscales para exportar");
                return;
              }
              
              toast.info("Generando informe fiscal detallado...", { duration: 3000 });
              
              setTimeout(() => {
                try {
                  const property = properties?.find(p => p.id === selectedPropertyId);
                  if (!property && selectedPropertyId) {
                    toast.error("No se encontró la propiedad seleccionada.");
                    return;
                  }
                  
                  const filename = property 
                    ? `Informe_Fiscal_${property.name.replace(/\s+/g, "_")}_${selectedYear}.pdf`
                    : `Informe_Fiscal_Completo_${selectedYear}.pdf`;
                    
                  if (property) {
                    exportPropertyTaxDataToPDF(property, filename);
                  } else {
                    // Export all properties
                    toast.error("Por favor seleccione una propiedad específica para exportar");
                    return;
                  }
                  
                  toast.success("Informe fiscal PDF generado correctamente", { duration: 3000 });
                } catch (error) {
                  console.error("Error exporting to PDF:", error);
                  toast.error("Error al exportar el informe PDF", { duration: 3000 });
                }
              }, 1500);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 ml-auto"
            title="Exportar a PDF con gráficos visuales y explicaciones detalladas"
          >
            <FileDown className="h-4 w-4" /> Generar Informe PDF
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seleccionar Propiedad y Año</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertySelector 
              properties={properties || []}
              selectedPropertyId={selectedPropertyId}
              onSelectProperty={setSelectedPropertyId}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
            />
          </CardContent>
        </Card>

        {filteredData.length > 0 ? (
          <FiscalDetailContent 
            filteredData={filteredData}
            selectedYear={selectedYear}
          />
        ) : (
          <Card>
            <CardContent className="py-10">
              <div className="text-center text-muted-foreground">
                <p>No hay datos fiscales disponibles. Por favor, seleccione una propiedad.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default FiscalReport;
