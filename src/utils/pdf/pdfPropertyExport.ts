
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Property } from '@/types/property';
import { addHeader, addSectionTitle, addFooters } from './pdfCommonUtils';
import { addDetailedExplanations } from './pdfExplanations';

/**
 * Exports property tax data to PDF
 */
export const exportPropertyTaxDataToPDF = (property: Property, filename: string) => {
  try {
    // Create new PDF document (A4)
    const doc = new jsPDF();
    let currentY = 0;
    
    // Add header
    currentY = addHeader(doc, 'INFORME FISCAL PARA IRPF', `Inmueble: ${property.name} - ${new Date().getFullYear()}`);
    
    // Add property information section
    currentY = addSectionTitle(doc, 'DATOS DEL INMUEBLE', currentY);
    
    // Create property info table
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Valor']],
      body: [
        ['Referencia Catastral', property.cadastralReference || 'No especificada'],
        ['Dirección', property.address || 'No especificada'],
        ['Vivienda Habitual', property.taxInfo?.isPrimaryResidence ? 'Sí' : 'No'],
        ['Zona Tensionada', property.taxInfo?.isTensionedArea ? 'Sí' : 'No'],
        ['Inquilino Joven (18-35)', property.taxInfo?.hasYoungTenant ? 'Sí' : 'No'],
        ['Rehabilitada Recientemente', property.taxInfo?.recentlyRenovated ? 'Sí' : 'No'],
        ['Rebaja de Renta', property.taxInfo?.rentReduction ? 'Sí' : 'No'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [240, 245, 255] }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Calculate values based on property data
    const monthlyRent = property.rent || 0;
    const annualRent = monthlyRent * 12;
    
    // Get mortgage interest
    let mortgageInterest = 0;
    if (property.taxInfo?.mortgageInterest) {
      mortgageInterest = property.taxInfo.mortgageInterest;
    } else if (property.mortgage?.monthlyPayment) {
      // Estimate as 80% of payment for 12 months
      mortgageInterest = property.mortgage.monthlyPayment * 0.8 * 12;
    }
    
    // Deductible expenses
    const ibi = property.ibi || 0;
    const communityFee = property.communityFee || 0;
    const homeInsurance = property.homeInsurance?.cost || 0;
    
    // Property value and depreciation
    const propertyValue = property.taxInfo?.propertyValue || 0;
    const furnitureValue = property.taxInfo?.furnitureValue || 0;
    const buildingDepreciation = propertyValue * 0.03; // 3% of property value
    const furnitureDepreciation = furnitureValue * 0.1; // 10% of furniture value
    
    // Total expenses
    let totalExpenses = ibi + communityFee + mortgageInterest + homeInsurance + 
                      buildingDepreciation + furnitureDepreciation;
    
    // Add other monthly expenses
    if (property.monthlyExpenses) {
      property.monthlyExpenses.forEach(expense => {
        totalExpenses += expense.amount * 12; // Annual expenses
      });
    }
    
    // Calculate net income and reduction
    const netIncome = annualRent - totalExpenses;
    
    // Determine reduction percentage
    let reductionPercentage = 0;
    if (property.taxInfo?.isPrimaryResidence) {
      if (property.taxInfo?.isTensionedArea && property.taxInfo?.hasYoungTenant) {
        reductionPercentage = 70;
      } else if (property.taxInfo?.isTensionedArea && property.taxInfo?.rentReduction) {
        reductionPercentage = 90;
      } else if (property.taxInfo?.recentlyRenovated) {
        reductionPercentage = 60;
      } else {
        reductionPercentage = 50;
      }
    }
    
    const reduction = (netIncome * reductionPercentage) / 100;
    const taxableIncome = netIncome - reduction;
    
    // Add Income Section
    currentY = addSectionTitle(doc, 'INGRESOS', currentY);
    
    // Create income table
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Importe (€)']],
      body: [
        ['Ingresos por alquiler', annualRent.toLocaleString('es-ES')],
        ['Subvenciones', property.taxInfo?.subsidies?.toLocaleString('es-ES') || '0'],
        ['Otros ingresos', property.taxInfo?.otherIncome?.toLocaleString('es-ES') || '0'],
        ['TOTAL INGRESOS', annualRent.toLocaleString('es-ES')]
      ],
      theme: 'striped',
      headStyles: { fillColor: [46, 204, 113], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [240, 255, 240] },
      foot: [['TOTAL INGRESOS', annualRent.toLocaleString('es-ES')]],
      footStyles: { fillColor: [46, 204, 113], textColor: 255, fontStyle: 'bold' }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Add expenses section
    currentY = addSectionTitle(doc, 'GASTOS DEDUCIBLES', currentY);
    
    // Create expenses table with more details
    const expensesBody = [
      ['IBI', ibi.toLocaleString('es-ES')],
      ['Gastos de comunidad', communityFee.toLocaleString('es-ES')],
      ['Intereses hipotecarios', mortgageInterest.toLocaleString('es-ES')],
      ['Seguro de hogar', homeInsurance.toLocaleString('es-ES')],
      ['Amortización inmueble (3%)', buildingDepreciation.toLocaleString('es-ES')],
      ['Amortización mobiliario (10%)', furnitureDepreciation.toLocaleString('es-ES')]
    ];
    
    // Add monthly expenses if they exist
    if (property.monthlyExpenses && property.monthlyExpenses.length > 0) {
      property.monthlyExpenses.forEach(expense => {
        expensesBody.push([expense.name, (expense.amount * 12).toLocaleString('es-ES')]);
      });
    }
    
    // Add total row
    expensesBody.push(['TOTAL GASTOS', totalExpenses.toLocaleString('es-ES')]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Importe (€)']],
      body: expensesBody,
      theme: 'striped',
      headStyles: { fillColor: [231, 76, 60], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [255, 240, 240] },
      foot: [['TOTAL GASTOS', totalExpenses.toLocaleString('es-ES')]],
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
    
    // Get reason for reduction percentage
    const getReductionReason = () => {
      if (property.taxInfo?.isPrimaryResidence) {
        if (property.taxInfo?.isTensionedArea && property.taxInfo?.hasYoungTenant) {
          return "Inquilino joven (18-35) en zona tensionada";
        }
        if (property.taxInfo?.isTensionedArea && property.taxInfo?.rentReduction) {
          return "Reducción de renta ≥5% en zona tensionada";
        }
        if (property.taxInfo?.recentlyRenovated) {
          return "Vivienda con rehabilitación reciente";
        }
        return "Vivienda habitual del inquilino";
      }
      return "No aplica reducción";
    };
    
    // Create reductions table
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Valor']],
      body: [
        ['Porcentaje de reducción', `${reductionPercentage}%`],
        ['Motivo de la reducción', getReductionReason()],
        ['Base para la reducción', netIncome.toLocaleString('es-ES') + ' €'],
        ['Importe de la reducción', reduction.toLocaleString('es-ES') + ' €']
      ],
      theme: 'striped',
      headStyles: { fillColor: [142, 68, 173], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [245, 240, 255] }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Add Final Summary Section
    currentY = addSectionTitle(doc, 'RESUMEN PARA DECLARACIÓN', currentY);
    
    // Create summary table
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Importe (€)']],
      body: [
        ['Ingresos Íntegros', annualRent.toLocaleString('es-ES')],
        ['Total Gastos Deducibles', totalExpenses.toLocaleString('es-ES')],
        ['Rendimiento Neto', netIncome.toLocaleString('es-ES')],
        ['Reducción Aplicada', reduction.toLocaleString('es-ES')],
        ['BASE IMPONIBLE', taxableIncome.toLocaleString('es-ES')]
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
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Add a new page for detailed explanations on amortization
    doc.addPage();
    currentY = 20;
    
    // Add detailed explanations specific to amortization
    currentY = addDetailedExplanations(doc, currentY);
    
    // Add footer to all pages
    addFooters(doc, property.name);
    
    // Save the PDF
    doc.save(filename);
    return true;
  } catch (error) {
    console.error("Error exporting property tax data to PDF:", error);
    return false;
  }
};
