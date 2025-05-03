import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FiscalData } from '@/components/finances/historical/types';
import { Property, TaxInfo } from '@/types/property';

/**
 * Creates a pie chart in the PDF document
 */
const addPieChart = (
  doc: jsPDF,
  data: { label: string; value: number; color: string }[],
  x: number,
  y: number,
  radius: number,
  title: string
) => {
  // Draw title
  doc.setFontSize(12);
  doc.text(title, x, y - radius - 10);
  
  let startAngle = 0;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Draw each segment of the pie chart
  data.forEach((segment) => {
    const segmentAngle = (segment.value / total) * 360;
    const endAngle = startAngle + segmentAngle;
    
    // Convert degrees to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Draw pie segment using ellipse instead of arc
    doc.setFillColor(segment.color);
    
    // Start at center point
    doc.moveTo(x, y);
    
    // Draw an ellipse segment (approximation of an arc)
    // Using lines and curves to create the arc since direct arc is not available
    const startX = x + radius * Math.cos(startRad);
    const startY = y + radius * Math.sin(startRad);
    const endX = x + radius * Math.cos(endRad);
    const endY = y + radius * Math.sin(endRad);
    
    // Draw a triangle from center to the arc points
    doc.triangle(x, y, startX, startY, endX, endY, 'F');
    
    // Update start angle for next segment
    startAngle = endAngle;
  });
  
  // Draw legend
  let legendY = y + radius + 10;
  data.forEach((segment) => {
    // Draw color box
    doc.setFillColor(segment.color);
    doc.rect(x - radius, legendY, 5, 5, 'F');
    
    // Draw label
    doc.setFontSize(10);
    doc.text(`${segment.label}: ${segment.value.toLocaleString('es-ES')} €`, x - radius + 8, legendY + 4);
    
    legendY += 10;
  });
  
  return legendY;  // Return the Y position after the chart for further content
};

/**
 * Creates a bar chart in the PDF document
 */
const addBarChart = (
  doc: jsPDF,
  data: { label: string; value: number; color: string }[],
  x: number,
  y: number,
  width: number,
  height: number,
  title: string
) => {
  // Draw title
  doc.setFontSize(12);
  doc.text(title, x, y - 5);
  
  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = width / data.length / 1.5;
  const gap = barWidth / 2;
  
  // Draw bars
  data.forEach((bar, index) => {
    const barHeight = (bar.value / maxValue) * height;
    const barX = x + index * (barWidth + gap);
    const barY = y + height - barHeight;
    
    doc.setFillColor(bar.color);
    doc.rect(barX, barY, barWidth, barHeight, 'F');
    
    // Draw value on top of bar
    doc.setFontSize(8);
    doc.text(bar.value.toLocaleString('es-ES') + ' €', barX, barY - 2, { align: 'left' });
    
    // Draw label under bar
    doc.setFontSize(8);
    const label = bar.label.length > 10 ? bar.label.substring(0, 10) + '...' : bar.label;
    doc.text(label, barX, y + height + 10, { align: 'left' });
  });
  
  return y + height + 20;  // Return the Y position after the chart
};

/**
 * Adds a formatted header to the PDF document
 */
const addHeader = (doc: jsPDF, title: string, subtitle: string) => {
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text(title, 105, 20, { align: 'center' });
  
  // Add subtitle
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(subtitle, 105, 30, { align: 'center' });
  
  // Add decorative line
  doc.setDrawColor(52, 152, 219);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  return 45;  // Return Y position after header
};

/**
 * Adds a section title to the PDF document
 */
const addSectionTitle = (doc: jsPDF, title: string, y: number) => {
  doc.setFillColor(52, 152, 219);
  doc.rect(20, y, 170, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(title, 25, y + 5.5);
  
  return y + 15;  // Return Y position after section title
};

/**
 * Adds explanatory text to the PDF
 */
const addExplanatoryText = (doc: jsPDF, text: string, y: number) => {
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  
  const splitText = doc.splitTextToSize(text, 150);
  doc.text(splitText, 25, y);
  
  return y + (splitText.length * 5) + 5;  // Return Y position after text
};

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
        totalExpenses += expense.amount;
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
        expensesBody.push([expense.name, expense.amount.toLocaleString('es-ES')]);
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
    
    // If we've used more than 3/4 of the page, add a new page for charts
    if (currentY > 180) {
      doc.addPage();
      currentY = 20;
    } else {
      currentY += 10;
    }
    
    // Add visualization section
    currentY = addSectionTitle(doc, 'VISUALIZACIÓN GRÁFICA', currentY);
    
    // Add pie chart for income vs expenses
    const pieData = [
      { label: 'Ingresos', value: annualRent, color: '#2ecc71' },
      { label: 'Gastos', value: totalExpenses, color: '#e74c3c' }
    ];
    
    currentY = addPieChart(doc, pieData, 60, currentY + 40, 25, 'Ingresos vs Gastos');
    
    // Add bar chart for expense breakdown
    const barData = [
      { label: 'IBI', value: ibi, color: '#3498db' },
      { label: 'Comunidad', value: communityFee, color: '#9b59b6' },
      { label: 'Hipoteca', value: mortgageInterest, color: '#e74c3c' },
      { label: 'Seguro', value: homeInsurance, color: '#f1c40f' },
      { label: 'Amort. Inmueble', value: buildingDepreciation, color: '#1abc9c' },
      { label: 'Amort. Mobiliario', value: furnitureDepreciation, color: '#d35400' }
    ];
    
    currentY = addBarChart(doc, barData, 110, currentY - 20, 80, 40, 'Desglose de Gastos');
    
    // Add a new page for educational content
    doc.addPage();
    currentY = 20;
    
    // Add information section
    currentY = addSectionTitle(doc, 'INFORMACIÓN PARA LA DECLARACIÓN', currentY);
    
    // Add explanatory text about tax declarations
    currentY = addExplanatoryText(doc,
      'La declaración de los rendimientos del capital inmobiliario se realiza en el apartado C de la declaración ' +
      'de la Renta (casillas 0062 a 0075). A continuación se detallan los principales aspectos a tener en cuenta:', currentY);
    
    // Create explanatory table
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Concepto', 'Explicación']],
      body: [
        ['IBI', 'Impuesto sobre Bienes Inmuebles. Deducible al 100%.'],
        ['Intereses hipotecarios', 'Solo son deducibles los intereses (no el capital). No pueden superar, junto con los gastos de reparación, los ingresos íntegros.'],
        ['Amortización inmueble', 'Se calcula como el 3% del valor de la construcción (excluido el suelo).'],
        ['Amortización mobiliario', 'Se calcula como el 10% del valor del mobiliario.'],
        ['Reducción 50%', 'Aplicable a viviendas habituales (Art. 23.2, Ley 35/2006).'],
        ['Reducción 60%', 'Para viviendas habituales recientemente rehabilitadas (Ley 12/2023).'],
        ['Reducción 70%', 'Para inquilinos jóvenes (18-35 años) en zonas tensionadas (Ley 12/2023).'],
        ['Reducción 90%', 'Para viviendas en zonas tensionadas con rebaja de renta ≥5% (Ley 12/2023).']
      ],
      theme: 'striped',
      headStyles: { fillColor: [52, 73, 94], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Add legal notice
    currentY = addExplanatoryText(doc,
      'IMPORTANTE: Este informe tiene carácter informativo y no sustituye al asesoramiento profesional. ' +
      'La normativa fiscal puede variar y se recomienda consultar con un asesor fiscal para casos particulares. ' +
      'Documento generado el ' + new Date().toLocaleDateString('es-ES') + ' para el año fiscal ' + 
      new Date().getFullYear() + '.', currentY);
    
    // Add footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        'Página ' + i + ' de ' + pageCount, 
        105, 
        290, 
        { align: 'center' }
      );
      doc.text(
        'Informe Fiscal Inmueble: ' + property.name, 
        20, 
        290
      );
    }
    
    // Save the PDF
    doc.save(filename);
    return true;
  } catch (error) {
    console.error("Error exporting property tax data to PDF:", error);
    return false;
  }
};

/**
 * Exports fiscal data to PDF
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
    
    // Create expenses table
    const expensesBody = [
      ['IBI', (data.ibi || 0).toLocaleString('es-ES')],
      ['Gastos de comunidad', (data.communityFees || 0).toLocaleString('es-ES')],
      ['Intereses hipotecarios', (data.mortgageInterest || 0).toLocaleString('es-ES')],
      ['Seguro de hogar', (data.homeInsurance || 0).toLocaleString('es-ES')],
      ['Mantenimiento y reparaciones', (data.maintenance || 0).toLocaleString('es-ES')],
      ['Honorarios de agencia', (data.agencyFees || 0).toLocaleString('es-ES')],
      ['Gastos administrativos', (data.administrativeFees || 0).toLocaleString('es-ES')],
      ['Amortización inmueble', (data.buildingDepreciation || 0).toLocaleString('es-ES')],
      ['Amortización mobiliario', (data.furnitureDepreciation || 0).toLocaleString('es-ES')],
      ['Suministros', (data.utilities || 0).toLocaleString('es-ES')],
      ['Tasas municipales', (data.municipalTaxes || 0).toLocaleString('es-ES')],
      ['Gastos legales', (data.legalFees || 0).toLocaleString('es-ES')],
      ['Saldos de dudoso cobro', (data.badDebts || 0).toLocaleString('es-ES')],
      ['Otros gastos', (data.otherExpenses || 0).toLocaleString('es-ES')]
    ];
    
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
        ['Base para la reducción', (data.netProfit || 0).toLocaleString('es-ES') + ' €'],
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
    const baseImponible = (data.netProfit || 0) - (data.reducedNetProfit || 0);
    
    // Create summary table
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Importe (€)']],
      body: [
        ['Ingresos Íntegros', (data.totalIncome || 0).toLocaleString('es-ES')],
        ['Total Gastos Deducibles', (data.totalExpenses || 0).toLocaleString('es-ES')],
        ['Rendimiento Neto', (data.netProfit || 0).toLocaleString('es-ES')],
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
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // If we've used more than 3/4 of the page, add a new page for charts
    if (currentY > 180) {
      doc.addPage();
      currentY = 20;
    } else {
      currentY += 10;
    }
    
    // Add visualization section
    currentY = addSectionTitle(doc, 'VISUALIZACIÓN GRÁFICA', currentY);
    
    // Add pie chart for income vs expenses
    const pieData = [
      { label: 'Ingresos', value: data.totalIncome || 0, color: '#2ecc71' },
      { label: 'Gastos', value: data.totalExpenses || 0, color: '#e74c3c' }
    ];
    
    currentY = addPieChart(doc, pieData, 60, currentY + 40, 25, 'Ingresos vs Gastos');
    
    // Add bar chart for expense breakdown
    const barData = [
      { label: 'IBI', value: data.ibi || 0, color: '#3498db' },
      { label: 'Comunidad', value: data.communityFees || 0, color: '#9b59b6' },
      { label: 'Hipoteca', value: data.mortgageInterest || 0, color: '#e74c3c' },
      { label: 'Seguro', value: data.homeInsurance || 0, color: '#f1c40f' },
      { label: 'Mant.', value: data.maintenance || 0, color: '#1abc9c' },
      { label: 'Otros', value: (data.otherExpenses || 0) + (data.utilities || 0), color: '#d35400' }
    ];
    
    currentY = addBarChart(doc, barData, 110, currentY - 20, 80, 40, 'Desglose de Gastos');
    
    // Add a new page for educational content
    doc.addPage();
    currentY = 20;
    
    // Add information section
    currentY = addSectionTitle(doc, 'INFORMACIÓN PARA LA DECLARACIÓN', currentY);
    
    // Add explanatory text about tax declarations
    currentY = addExplanatoryText(doc,
      'La declaración de los rendimientos del capital inmobiliario se realiza en el apartado C de la declaración ' +
      'de la Renta (casillas 0062 a 0075). A continuación se detallan los principales aspectos a tener en cuenta:', currentY);
    
    // Create explanatory table
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Concepto', 'Explicación']],
      body: [
        ['IBI', 'Impuesto sobre Bienes Inmuebles. Deducible al 100%.'],
        ['Intereses hipotecarios', 'Solo son deducibles los intereses (no el capital). No pueden superar, junto con los gastos de reparación, los ingresos íntegros.'],
        ['Amortización inmueble', 'Se calcula como el 3% del valor de la construcción (excluido el suelo).'],
        ['Amortización mobiliario', 'Se calcula como el 10% del valor del mobiliario.'],
        ['Reducción 50%', 'Aplicable a viviendas habituales (Art. 23.2, Ley 35/2006).'],
        ['Reducción 60%', 'Para viviendas habituales recientemente rehabilitadas (Ley 12/2023).'],
        ['Reducción 70%', 'Para inquilinos jóvenes (18-35 años) en zonas tensionadas (Ley 12/2023).'],
        ['Reducción 90%', 'Para viviendas en zonas tensionadas con rebaja de renta ≥5% (Ley 12/2023).']
      ],
      theme: 'striped',
      headStyles: { fillColor: [52, 73, 94], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Add legal notice
    currentY = addExplanatoryText(doc,
      'IMPORTANTE: Este informe tiene carácter informativo y no sustituye al asesoramiento profesional. ' +
      'La normativa fiscal puede variar y se recomienda consultar con un asesor fiscal para casos particulares. ' +
      'Documento generado el ' + new Date().toLocaleDateString('es-ES') + ' para el año fiscal ' + 
      selectedYear + '.', currentY);
    
    // Add footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        'Página ' + i + ' de ' + pageCount, 
        105, 
        290, 
        { align: 'center' }
      );
      doc.text(
        'Informe Fiscal Inmueble: ' + propertyName + ' - Año ' + selectedYear, 
        20, 
        290
      );
    }
    
    // Save the PDF
    doc.save(filename);
    return true;
  } catch (error) {
    console.error("Error exporting fiscal data to PDF:", error);
    return false;
  }
};
