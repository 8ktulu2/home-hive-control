import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FiscalData } from '@/components/finances/historical/types';
import { Property, TaxInfo } from '@/types/property';

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
 * Adds detailed explanations about tax deductions
 */
const addDetailedExplanations = (doc: jsPDF, y: number) => {
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text("Guía Detallada para la Declaración de la Renta", 105, y, { align: 'center' });
  y += 10;
  
  // Add explanations for each expense type
  const explanations = [
    {
      title: "Amortización del Inmueble (3%)",
      content: "La amortización del inmueble es uno de los gastos más importantes a nivel fiscal para el propietario. Se calcula aplicando un 3% anual sobre el mayor de estos valores: (1) el valor catastral de la construcción (excluyendo el valor del suelo), o (2) el coste de adquisición de la construcción (también excluyendo el suelo). Es fundamental entender que SOLO se amortiza la construcción, nunca el suelo, ya que este no se deteriora con el tiempo. Para calcular correctamente esta amortización, debe disponer del valor catastral desglosado entre suelo y construcción (disponible en el recibo del IBI o solicitándolo al Catastro). Si utiliza el coste de adquisición, debe aplicar el porcentaje que corresponde a la construcción según la escritura o, en su defecto, un porcentaje estimado basado en la zona (en áreas urbanas suele oscilar entre el 60-80% para la construcción). Esta amortización es deducible aunque no represente un desembolso real de dinero."
    },
    {
      title: "Amortización del Mobiliario (10%)",
      content: "El mobiliario y los enseres del inmueble se amortizan a un ritmo del 10% anual sobre su valor de adquisición. A diferencia del inmueble, el mobiliario se amortiza completamente, no hay valor residual. Es imprescindible conservar las facturas de compra de todos los elementos amortizables como prueba ante una posible inspección fiscal. Se consideran elementos amortizables: muebles, electrodomésticos (lavadora, nevera, horno, etc.), instalaciones no fijas (aire acondicionado portátil), equipos electrónicos, menaje, cortinas, alfombras, etc. La amortización se calcula de forma lineal durante la vida útil estimada de cada elemento, que Hacienda establece en 10 años para el mobiliario general. Si el elemento estuviera parcialmente amortizado antes de destinarlo al alquiler, sólo podrá amortizar la parte pendiente. Los elementos de poco valor (menos de 300€) pueden amortizarse íntegramente en el año de adquisición."
    },
    {
      title: "IBI (Impuesto sobre Bienes Inmuebles)",
      content: "El IBI es 100% deducible en el rendimiento del capital inmobiliario. Debe conservar el recibo de pago a nombre del propietario como justificante. Si hay varios propietarios, cada uno puede deducir la parte proporcional según su porcentaje de propiedad."
    },
    {
      title: "Intereses de Préstamos",
      content: "Solo son deducibles los intereses (no la amortización del capital). Debe solicitar a su banco un certificado anual que detalle la parte correspondiente a intereses. Los intereses están limitados junto con los gastos de conservación y reparación a los ingresos íntegros."
    },
    {
      title: "Gastos de Comunidad",
      content: "Las cuotas de comunidad de propietarios son completamente deducibles. Conserve los recibos o certificado del administrador. Incluyen gastos como portería, limpieza, ascensor, etc."
    },
    {
      title: "Gastos de Reparación y Conservación",
      content: "Son deducibles los gastos para mantener el inmueble en condiciones normales de uso. No son deducibles las ampliaciones o mejoras. Estos gastos junto con los intereses del préstamo están limitados a los ingresos íntegros."
    },
    {
      title: "Seguros de Hogar",
      content: "Son deducibles las primas de seguros del inmueble (continente y contenido). También son deducibles los seguros de responsabilidad civil y defensa jurídica relacionados con el inmueble."
    },
    {
      title: "Gastos de Formalización",
      content: "Honorarios de abogados, notaría, registro, etc. relacionados con el contrato de alquiler son deducibles. También los gastos de agencia inmobiliaria por buscar inquilino."
    },
  ];
  
  // Add reduction explanations
  const reductionExplanations = [
    {
      title: "Reducción General del 50%",
      content: "Aplicable a todos los alquileres de viviendas que sean residencia habitual del inquilino. Esta reducción se aplica sobre el rendimiento neto (ingresos menos gastos deducibles)."
    },
    {
      title: "Reducción del 60%",
      content: "Para viviendas rehabilitadas en los últimos 2 años y destinadas al alquiler como vivienda habitual. Se exige que las obras mejoren la eficiencia energética."
    },
    {
      title: "Reducción del 70%",
      content: "Para alquileres a jóvenes (18-35 años) en zonas de mercado residencial tensionado, siempre que sea su vivienda habitual. Es necesario tener documentado que el inquilino está en ese rango de edad."
    },
    {
      title: "Reducción del 90%",
      content: "Para viviendas en zonas tensionadas con rebaja de renta de al menos un 5% respecto al contrato anterior. Se debe poder documentar esta reducción con los contratos anteriores y actuales."
    }
  ];

  // Gastos deducibles
  y = addSectionTitle(doc, "GASTOS DEDUCIBLES: DETALLE Y JUSTIFICACIÓN", y);
  
  explanations.forEach(exp => {
    doc.setFillColor(245, 245, 250);
    doc.rect(25, y, 160, 8, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, 'bold');
    doc.text(exp.title, 30, y + 5);
    doc.setFont(undefined, 'normal');
    
    y += 10;
    
    const contentLines = doc.splitTextToSize(exp.content, 150);
    doc.setTextColor(80, 80, 80);
    doc.text(contentLines, 30, y);
    
    y += (contentLines.length * 5) + 8;
  });
  
  // Check if need a new page
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  
  // Reducciones fiscales
  y = addSectionTitle(doc, "REDUCCIONES FISCALES: REQUISITOS Y APLICACIÓN", y);
  
  reductionExplanations.forEach(exp => {
    doc.setFillColor(245, 245, 250);
    doc.rect(25, y, 160, 8, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, 'bold');
    doc.text(exp.title, 30, y + 5);
    doc.setFont(undefined, 'normal');
    
    y += 10;
    
    const contentLines = doc.splitTextToSize(exp.content, 150);
    doc.setTextColor(80, 80, 80);
    doc.text(contentLines, 30, y);
    
    y += (contentLines.length * 5) + 8;
  });
  
  // Final advice
  y += 5;
  doc.setFillColor(235, 245, 251);
  doc.rect(25, y, 160, 25, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(41, 128, 185);
  doc.setFont(undefined, 'bold');
  doc.text("RECOMENDACIÓN IMPORTANTE:", 30, y + 6);
  doc.setFont(undefined, 'normal');
  
  const adviceText = "Conserve todos los justificantes (facturas, recibos, certificados bancarios) durante al menos 4 años, que es el plazo de prescripción fiscal. La reducción por alquiler de vivienda habitual requiere que conste expresamente en el contrato que se destina a tal fin. Considere consultar con un asesor fiscal para optimizar su declaración.";
  const adviceLines = doc.splitTextToSize(adviceText, 150);
  doc.text(adviceLines, 30, y + 12);
  
  return y + 30;
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
      doc.text(
        'Documento generado el ' + new Date().toLocaleDateString('es-ES'),
        190, 
        290,
        { align: 'right' }
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
      doc.text(
        'Documento generado el ' + new Date().toLocaleDateString('es-ES'),
        190, 
        290,
        { align: 'right' }
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
