
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FiscalData } from '@/components/finances/historical/types';
import { addHeader, addSectionTitle, addFooters } from './pdfCommonUtils';
import { addDetailedExplanations } from './pdfExplanations';

/**
 * Exports fiscal data to PDF directly from FiscalData object
 */
export const exportFiscalDataToPDF = (data: FiscalData, propertyName: string, selectedYear: number, filename: string) => {
  try {
    // Create new PDF document (A4)
    const doc = new jsPDF();
    let currentY = 0;
    
    // Add header
    currentY = addHeader(doc, 'INFORME FISCAL PARA IRPF', `${propertyName} - Año ${selectedYear}`);
    
    // Add Income Section
    currentY = addSectionTitle(doc, 'INGRESOS', currentY);
    
    // Create income table
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Importe (€)']],
      body: [
        ['Ingresos por alquiler', (data.rentalIncome || 0).toLocaleString('es-ES')],
        ['Subvenciones', (data.subsidies || 0).toLocaleString('es-ES')],
        ['Otros ingresos', (data.otherIncome || 0).toLocaleString('es-ES')],
        ['TOTAL INGRESOS', (data.totalIncome || 0).toLocaleString('es-ES')]
      ],
      theme: 'striped',
      headStyles: { fillColor: [46, 204, 113], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [240, 255, 240] },
      foot: [['TOTAL INGRESOS', (data.totalIncome || 0).toLocaleString('es-ES')]],
      footStyles: { fillColor: [46, 204, 113], textColor: 255, fontStyle: 'bold' }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Add expenses section
    currentY = addSectionTitle(doc, 'GASTOS DEDUCIBLES', currentY);
    
    // Create expenses table - removing zero values
    const expensesItems = [
      { name: 'IBI', value: data.ibi || 0 },
      { name: 'Gastos de comunidad', value: data.communityFees || 0 },
      { name: 'Intereses hipotecarios', value: data.mortgageInterest || 0 },
      { name: 'Seguro de hogar', value: data.homeInsurance || 0 },
      { name: 'Mantenimiento y reparaciones', value: data.maintenance || 0 },
      { name: 'Honorarios de agencia', value: data.agencyFees || 0 },
      { name: 'Gastos administrativos', value: data.administrativeFees || 0 },
      { name: 'Amortización inmueble', value: data.buildingDepreciation || 0 },
      { name: 'Amortización mobiliario', value: data.furnitureDepreciation || 0 },
      { name: 'Suministros', value: data.utilities || 0 },
      { name: 'Tasas municipales', value: data.municipalTaxes || 0 },
      { name: 'Gastos legales', value: data.legalFees || 0 },
      { name: 'Saldos de dudoso cobro', value: data.badDebts || 0 },
      { name: 'Otros gastos', value: data.otherExpenses || 0 }
    ].filter(item => item.value > 0);
    
    const expensesBody = expensesItems.map(item => [item.name, item.value.toLocaleString('es-ES')]);
    
    // Add total row
    expensesBody.push(['TOTAL GASTOS', (data.totalExpenses || 0).toLocaleString('es-ES')]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Importe (€)']],
      body: expensesBody,
      theme: 'striped',
      headStyles: { fillColor: [231, 76, 60], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [255, 240, 240] },
      foot: [['TOTAL GASTOS', (data.totalExpenses || 0).toLocaleString('es-ES')]],
      footStyles: { fillColor: [231, 76, 60], textColor: 255, fontStyle: 'bold' }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // If we've used more than 3/4 of the page, add a new page
    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }
    
    // Add Reduction Section
    currentY = addSectionTitle(doc, 'REDUCCIONES FISCALES', currentY);
    
    // Create reductions table
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Valor']],
      body: [
        ['Zona tensionada', data.inTensionedArea ? 'Sí' : 'No'],
        ['Inquilino joven (18-35 años)', data.youngTenant ? 'Sí' : 'No'],
        ['Rebaja de renta respecto contrato anterior', data.rentLoweredFromPrevious ? 'Sí' : 'No'],
        ['Vivienda rehabilitada recientemente', data.recentlyRenovated ? 'Sí' : 'No'],
        ['Porcentaje de reducción aplicable', `${data.applicableReduction || 0}%`],
        ['Base para la reducción', (data.netIncome || 0).toLocaleString('es-ES') + ' €'],
        ['Importe de la reducción', (data.reducedNetProfit || 0).toLocaleString('es-ES') + ' €']
      ],
      theme: 'striped',
      headStyles: { fillColor: [142, 68, 173], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [245, 240, 255] }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Add Summary Section
    currentY = addSectionTitle(doc, 'RESUMEN PARA DECLARACIÓN', currentY);
    
    // Calculate base imponible
    const baseImponible = (data.netIncome || 0) - (data.reducedNetProfit || 0);
    
    // Create summary table
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Importe (€)']],
      body: [
        ['Ingresos Íntegros', (data.totalIncome || 0).toLocaleString('es-ES')],
        ['Total Gastos Deducibles', (data.totalExpenses || 0).toLocaleString('es-ES')],
        ['Rendimiento Neto', (data.netIncome || 0).toLocaleString('es-ES')],
        ['Reducción Aplicada', (data.reducedNetProfit || 0).toLocaleString('es-ES')],
        ['BASE IMPONIBLE', baseImponible.toLocaleString('es-ES')]
      ],
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [240, 245, 255] },
      styles: { fontSize: 11 },
      columnStyles: {
        0: { fontStyle: 'bold' }
      }
    });
    
    // Add a new page for educational content
    doc.addPage();
    currentY = 20;
    
    // Add detailed explanations
    currentY = addDetailedExplanations(doc, currentY);
    
    // Add footer to all pages
    addFooters(doc, propertyName, selectedYear);
    
    // Save the PDF
    doc.save(filename);
    return true;
  } catch (error) {
    console.error("Error exporting fiscal data to PDF:", error);
    return false;
  }
};
