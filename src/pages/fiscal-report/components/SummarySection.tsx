
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Property } from '@/types/property';
import { useFiscalData } from '@/components/finances/historical/fiscal/hooks/useFiscalData';
import { generateHistoricalData } from './utils/fiscalReportUtils';

interface SummarySectionProps {
  properties: Property[];
  selectedPropertyIds: string[];
  selectedYears: number[];
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

const SummarySection = ({
  properties,
  selectedPropertyIds,
  selectedYears,
  isGenerating,
  setIsGenerating
}: SummarySectionProps) => {

  // Generar un informe consolidado para todas las propiedades y años seleccionados
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
      
      // Generar un nombre para el informe consolidado
      const filename = `Informe_Fiscal_Consolidado_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      // Exportar todos los datos a un único PDF usando jspdf directamente
      try {
        // Asegurarse de que jspdf y jspdf-autotable están disponibles
        const jsPDF = await import('jspdf').then(module => module.default);
        const autoTable = await import('jspdf-autotable').then(module => module.default);
        
        const doc = new jsPDF();
        
        // Título principal
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80);
        doc.text("INFORME FISCAL CONSOLIDADO", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, 105, 30, { align: "center" });
        
        let yPos = 40;
        
        // Recorrer cada propiedad y año seleccionados
        allFiscalData.forEach((item, index) => {
          const { property, year, fiscalData } = item;
          
          // Añadir nueva página si no es el primer elemento
          if (index > 0) {
            doc.addPage();
            yPos = 20;
          }
          
          // Título de la sección
          doc.setFontSize(16);
          doc.setTextColor(44, 62, 80);
          doc.text(`${property.name} - Año ${year}`, 105, yPos, { align: "center" });
          
          yPos += 15;
          
          // Tabla de ingresos
          doc.setFontSize(14);
          doc.setTextColor(0, 128, 0);
          doc.text("Ingresos", 20, yPos);
          
          yPos += 10;
          
          autoTable(doc, {
            startY: yPos,
            head: [['Concepto', 'Importe (€)']],
            body: [
              ['Ingresos por alquiler', fiscalData.rentalIncome?.toLocaleString('es-ES') || "0"],
              ['Subvenciones', fiscalData.subsidies?.toLocaleString('es-ES') || "0"],
              ['Otros ingresos', fiscalData.otherIncome?.toLocaleString('es-ES') || "0"],
              ['TOTAL INGRESOS', fiscalData.totalIncome?.toLocaleString('es-ES') || "0"]
            ],
            theme: 'striped',
            headStyles: { fillColor: [46, 204, 113], textColor: 255 },
          });
          
          yPos = (doc as any).lastAutoTable.finalY + 15;
          
          // Tabla de gastos
          doc.setFontSize(14);
          doc.setTextColor(220, 53, 69);
          doc.text("Gastos", 20, yPos);
          
          yPos += 10;
          
          // Filtrar gastos mayores que cero
          const expensesItems = [
            { name: 'IBI', value: fiscalData.ibi || 0 },
            { name: 'Gastos de comunidad', value: fiscalData.communityFees || 0 },
            { name: 'Intereses hipotecarios', value: fiscalData.mortgageInterest || 0 },
            { name: 'Seguro de hogar', value: fiscalData.homeInsurance || 0 },
            { name: 'Mantenimiento', value: fiscalData.maintenance || 0 }
          ].filter(item => item.value > 0);
          
          const expensesBody = expensesItems.map(item => 
            [item.name, item.value.toLocaleString('es-ES')]
          );
          
          // Añadir total gastos
          expensesBody.push(['TOTAL GASTOS', fiscalData.totalExpenses?.toLocaleString('es-ES') || "0"]);
          
          autoTable(doc, {
            startY: yPos,
            head: [['Concepto', 'Importe (€)']],
            body: expensesBody,
            theme: 'striped',
            headStyles: { fillColor: [231, 76, 60], textColor: 255 },
          });
          
          yPos = (doc as any).lastAutoTable.finalY + 15;
          
          // Tabla resumen
          doc.setFontSize(14);
          doc.setTextColor(41, 128, 185);
          doc.text("Resumen", 20, yPos);
          
          yPos += 10;
          
          autoTable(doc, {
            startY: yPos,
            head: [['Concepto', 'Importe (€)']],
            body: [
              ['Ingresos totales', fiscalData.totalIncome?.toLocaleString('es-ES') || "0"],
              ['Gastos totales', fiscalData.totalExpenses?.toLocaleString('es-ES') || "0"],
              ['Rendimiento neto', fiscalData.netIncome?.toLocaleString('es-ES') || "0"],
              ['Reducción aplicable', (fiscalData.applicableReduction || 0) + "%"],
              ['Rendimiento reducido', fiscalData.reducedNetProfit?.toLocaleString('es-ES') || "0"],
              ['BASE IMPONIBLE', ((fiscalData.netIncome || 0) - (fiscalData.reducedNetProfit || 0)).toLocaleString('es-ES')]
            ],
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          });
        });
        
        // Añadir pie de página con numeración
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(150);
          doc.text(`Página ${i} de ${totalPages}`, 190, 285, { align: 'right' });
          doc.text('Informe Fiscal Consolidado', 20, 285);
        }
        
        // Guardar el PDF
        doc.save(filename);
        
        toast.success("Informe fiscal consolidado descargado correctamente", {
          duration: 5000,
          description: "El informe se ha guardado en tu carpeta de descargas."
        });
        
      } catch (error) {
        console.error("Error al generar el PDF:", error);
        throw new Error("Error al generar el documento PDF");
      }
    } catch (error) {
      console.error("Error al generar informe consolidado:", error);
      toast.error("Error al exportar el informe PDF consolidado", { duration: 5000 });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Resumen de Selección</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Propiedades seleccionadas ({selectedPropertyIds.length}):</h3>
              {selectedPropertyIds.length === 0 ? (
                <p className="text-muted-foreground text-sm">No hay propiedades seleccionadas</p>
              ) : (
                <ul className="list-disc list-inside text-sm">
                  {selectedPropertyIds.map(id => {
                    const property = properties.find(p => p.id === id);
                    return property ? (
                      <li key={id}>{property.name}</li>
                    ) : null;
                  })}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Años seleccionados ({selectedYears.length}):</h3>
              {selectedYears.length === 0 ? (
                <p className="text-muted-foreground text-sm">No hay años seleccionados</p>
              ) : (
                <ul className="list-disc list-inside text-sm">
                  {selectedYears.map(year => (
                    <li key={year}>{year}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <Separator />

          <div className="pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total de informes a generar:</p>
                <p className="text-2xl font-bold">
                  {selectedPropertyIds.length * selectedYears.length}
                </p>
              </div>
              <Button
                size="lg"
                disabled={selectedPropertyIds.length === 0 || selectedYears.length === 0 || isGenerating}
                onClick={handleGenerateReports}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileDown className="mr-2 h-4 w-4" />
                {isGenerating ? "Descargando..." : "Descargar Informe Consolidado"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;
