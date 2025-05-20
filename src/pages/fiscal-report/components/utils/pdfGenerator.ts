
import { Property } from '@/types/property';
import { FiscalData } from '@/components/finances/historical/types';

interface FiscalReportData {
  property: Property;
  year: number;
  fiscalData: FiscalData;
}

/**
 * Generates a consolidated PDF report for fiscal data
 */
export const generateConsolidatedPdfReport = async (
  allFiscalData: FiscalReportData[]
): Promise<void> => {
  try {
    // Asegurarse de que jspdf y jspdf-autotable están disponibles
    const jsPDF = await import('jspdf').then(module => module.default);
    const autoTable = await import('jspdf-autotable').then(module => module.default);
    
    const filename = `Informe_Fiscal_Consolidado_${new Date().toISOString().slice(0, 10)}.pdf`;
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
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    return Promise.reject(new Error("Error al generar el documento PDF"));
  }
};
