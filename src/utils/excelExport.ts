
import * as XLSX from 'xlsx';
import { Property } from '@/types/property';
import { FiscalData } from '@/components/finances/historical/types';

// Helper to calculate annual totals from a property
export const calculatePropertyTaxData = (property: Property) => {
  const monthlyRent = property.rent || 0;
  const annualRent = monthlyRent * 12; // Assuming full year rental
  
  // Calculate expenses
  let totalExpenses = 0;
  let interestExpense = 0;
  let ibiExpense = 0;
  let communityExpense = 0;
  let insuranceExpense = 0;
  let repairsExpense = 0;
  let adminExpense = 0;
  let propertyAmortizationExpense = 0;
  let furnitureAmortizationExpense = 0;
  
  if (property.mortgage?.monthlyPayment) {
    const annualPayment = property.mortgage.monthlyPayment * 12;
    // Assuming 30% of payment is interest, a common approximation
    interestExpense = property.taxInfo?.mortgageInterest || (annualPayment * 0.3);
    totalExpenses += interestExpense;
  }
  
  if (property.ibi) {
    ibiExpense = property.ibi;
    totalExpenses += ibiExpense;
  }
  
  if (property.communityFee) {
    communityExpense = property.communityFee;
    totalExpenses += communityExpense;
  }
  
  if (property.homeInsurance?.cost) {
    insuranceExpense = property.homeInsurance.cost;
    totalExpenses += insuranceExpense;
  }

  // Calculate property amortization (3% of property value, a standard rate)
  if (property.taxInfo?.propertyValue) {
    propertyAmortizationExpense = property.taxInfo.propertyValue * 0.03;
    totalExpenses += propertyAmortizationExpense;
  }

  // Calculate furniture amortization (10% of furniture value)
  if (property.taxInfo?.furnitureValue) {
    furnitureAmortizationExpense = property.taxInfo.furnitureValue * 0.1;
    totalExpenses += furnitureAmortizationExpense;
  }

  // For monthly expenses (repairs, maintenance)
  if (property.monthlyExpenses) {
    let repairs = 0;
    let admin = 0;

    property.monthlyExpenses.forEach(expense => {
      if (expense.category === 'repairs' || expense.category === 'maintenance') {
        repairs += expense.amount;
      } else if (expense.category === 'administrative') {
        admin += expense.amount;
      }
    });

    repairsExpense = repairs;
    adminExpense = admin;
    totalExpenses += repairs + admin;
  }

  // Calculate net income
  const netIncome = annualRent - totalExpenses;
  
  // Calculate reduction
  let reductionPercentage = 0;
  if (property.taxInfo?.isPrimaryResidence) {
    // Base reduction for primary residence is 50%
    reductionPercentage = 50;
    
    // Young tenant in tensioned area: 70%
    if (property.taxInfo?.isTensionedArea && property.taxInfo?.hasYoungTenant) {
      reductionPercentage = 70;
    }
    // Rent reduction in tensioned area: 90%
    else if (property.taxInfo?.isTensionedArea && property.taxInfo?.rentReduction) {
      reductionPercentage = 90;
    }
    // Recently renovated: 60%
    else if (property.taxInfo?.recentlyRenovated) {
      reductionPercentage = 60;
    }
  }
  
  const reduction = (netIncome * reductionPercentage) / 100;
  const taxableIncome = netIncome - reduction;
  
  return {
    annualRent,
    interestExpense,
    ibiExpense,
    communityExpense,
    insuranceExpense,
    repairsExpense,
    adminExpense,
    propertyAmortizationExpense,
    furnitureAmortizationExpense,
    totalExpenses,
    netIncome,
    reductionPercentage,
    reduction,
    taxableIncome
  };
};

// Export property tax data to Excel
export const exportPropertyTaxDataToExcel = (
  property: Property,
  fileName: string = 'Informe_Tributario.xlsx'
) => {
  try {
    const data = calculatePropertyTaxData(property);
    const workbook = XLSX.utils.book_new();

    // Configure for UTF-8 encoding
    workbook.SST = "";
    workbook.SheetNames = [];
    
    // Pestaña Ingresos
    const ingresosData = [
      ['Concepto', 'Importe (€)'],
      ['Ingresos por alquiler', data.annualRent],
      ['Subvenciones', 0], // Optional: property.taxInfo?.subsidies || 0
      ['Otros ingresos', 0], // Optional: property.taxInfo?.otherIncomes || 0
    ];
    
    // Add total row with formula
    ingresosData.push([
      'TOTAL INGRESOS', 
      data.annualRent // This would be a formula in a real Excel: =SUM(B2:B4)
    ]);

    // Create worksheet with specific options for styling
    const ingresosSheet = XLSX.utils.aoa_to_sheet(ingresosData);
    
    // Apply some basic style metadata for the header (first row)
    if (!ingresosSheet['!cols']) ingresosSheet['!cols'] = [];
    ingresosSheet['!cols'][0] = { width: 30 }; // Column A width
    ingresosSheet['!cols'][1] = { width: 15 }; // Column B width
    
    // Add the sheet to workbook
    XLSX.utils.book_append_sheet(workbook, ingresosSheet, 'Ingresos');

    // Pestaña Gastos Deducibles
    const gastosData = [
      ['Concepto', 'Importe (€)'],
      ['IBI', data.ibiExpense],
      ['Gastos de comunidad', data.communityExpense],
      ['Intereses hipotecarios', data.interestExpense],
      ['Seguro de hogar', data.insuranceExpense],
      ['Mantenimiento y reparaciones', data.repairsExpense],
      ['Gastos administrativos', data.adminExpense],
      ['Amortización inmueble', data.propertyAmortizationExpense],
      ['Amortización mobiliario', data.furnitureAmortizationExpense]
    ];
    
    // Add total row
    gastosData.push([
      'TOTAL GASTOS DEDUCIBLES', 
      data.totalExpenses // This would be a formula in a real Excel: =SUM(B2:B9)
    ]);

    const gastosSheet = XLSX.utils.aoa_to_sheet(gastosData);
    
    // Apply column widths
    if (!gastosSheet['!cols']) gastosSheet['!cols'] = [];
    gastosSheet['!cols'][0] = { width: 30 };
    gastosSheet['!cols'][1] = { width: 15 };
    
    XLSX.utils.book_append_sheet(workbook, gastosSheet, 'Gastos Deducibles');

    // Pestaña Resumen
    const resumenData = [
      ['Concepto', 'Importe (€)'],
      ['Ingresos Íntegros', data.annualRent],
      ['Gastos Deducibles', data.totalExpenses],
      ['Rendimiento Neto', data.netIncome],
      [`Reducción (${data.reductionPercentage}%)`, data.reduction],
      ['Rendimiento Neto Reducido', data.taxableIncome]
    ];
    
    const resumenSheet = XLSX.utils.aoa_to_sheet(resumenData);
    
    // Apply column widths
    if (!resumenSheet['!cols']) resumenSheet['!cols'] = [];
    resumenSheet['!cols'][0] = { width: 30 };
    resumenSheet['!cols'][1] = { width: 15 };
    
    XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen');

    // Pestaña Explicaciones normativas
    const explicacionesData = [
      ['Campo', 'Explicación Normativa'],
      ['Ingresos por alquiler', 'Los ingresos íntegros del capital inmobiliario están constituidos por el importe que reciba el propietario por todos los conceptos del arrendamiento (Art. 22, Ley 35/2006).'],
      ['Intereses hipotecarios', 'Solo los intereses de préstamos (no el capital amortizado) son deducibles como gasto del rendimiento del capital inmobiliario (Art. 23, Ley 35/2006).'],
      ['IBI', 'El Impuesto sobre Bienes Inmuebles es deducible como gasto del rendimiento del capital inmobiliario (Art. 23, Ley 35/2006).'],
      ['Gastos de comunidad', 'Las cuotas de comunidad son deducibles como gasto del rendimiento del capital inmobiliario (Art. 23, Ley 35/2006).'],
      ['Amortización del inmueble', 'Se permite deducir un 3% anual sobre el mayor de: coste de adquisición satisfecho o valor catastral, sin incluir el valor del suelo (Art. 23, Ley 35/2006).'],
      ['Reducción por alquiler', 'Si el inmueble es vivienda habitual del inquilino, se aplica una reducción del 50% al rendimiento neto. Puede llegar al 90% en zonas tensionadas según la Ley 12/2023.'],
      ['Límite gastos deducibles', 'El conjunto de gastos deducibles no puede dar lugar a un rendimiento neto negativo (Art. 23, Ley 35/2006).']
    ];
    
    const explicacionesSheet = XLSX.utils.aoa_to_sheet(explicacionesData);
    
    // Apply column widths - wider for the explanations
    if (!explicacionesSheet['!cols']) explicacionesSheet['!cols'] = [];
    explicacionesSheet['!cols'][0] = { width: 25 };
    explicacionesSheet['!cols'][1] = { width: 75 };
    
    XLSX.utils.book_append_sheet(workbook, explicacionesSheet, 'Explicaciones Normativas');

    // Set options for UTF-8 encoding and other formatting
    const exportOptions = { 
      bookType: 'xlsx', 
      type: 'binary',
      cellStyles: true,
      bookSST: true // Enable Shared String Table for proper UTF-8 support
    };

    // Write the file with proper encoding
    XLSX.writeFile(workbook, fileName, exportOptions);
    
    return true;
  } catch (error) {
    console.error('Error exporting Excel:', error);
    return false;
  }
};

// Export fiscal data from the Historical view to Excel
export const exportFiscalDataToExcel = (
  fiscalData: FiscalData, 
  propertyName: string = 'Propiedad',
  year: number = new Date().getFullYear(),
  fileName: string = 'Datos_Fiscales_IRPF.xlsx'
) => {
  try {
    const workbook = XLSX.utils.book_new();

    // Configure for UTF-8 encoding
    workbook.SST = "";
    workbook.SheetNames = [];
    
    // Pestaña Ingresos
    const ingresosData = [
      [`Ingresos de ${propertyName} - IRPF ${year}`],
      [], // Empty row for spacing
      ['Concepto', 'Importe (€)'],
      ['Ingresos por alquiler', fiscalData.rentalIncome],
      ['Subvenciones', fiscalData.subsidies],
      ['Otros ingresos', fiscalData.otherIncome],
      ['TOTAL INGRESOS', fiscalData.totalIncome]
    ];
    
    const ingresosSheet = XLSX.utils.aoa_to_sheet(ingresosData);
    
    // Apply styling through column widths
    if (!ingresosSheet['!cols']) ingresosSheet['!cols'] = [];
    ingresosSheet['!cols'][0] = { width: 30 };
    ingresosSheet['!cols'][1] = { width: 15 };
    
    XLSX.utils.book_append_sheet(workbook, ingresosSheet, 'Ingresos');

    // Pestaña Gastos Deducibles
    const gastosData = [
      [`Gastos Deducibles de ${propertyName} - IRPF ${year}`],
      [], // Empty row for spacing
      ['Concepto', 'Importe (€)'],
      ['IBI', fiscalData.ibi],
      ['Gastos de comunidad', fiscalData.communityFees],
      ['Intereses hipotecarios', fiscalData.mortgageInterest],
      ['Seguro de hogar', fiscalData.homeInsurance],
      ['Mantenimiento y reparaciones', fiscalData.maintenance],
      ['Honorarios de agencia', fiscalData.agencyFees],
      ['Gastos administrativos', fiscalData.administrativeFees],
      ['Amortización inmueble', fiscalData.buildingDepreciation],
      ['Amortización mobiliario', fiscalData.furnitureDepreciation],
      ['Suministros', fiscalData.utilities],
      ['Tasas municipales', fiscalData.municipalTaxes],
      ['Gastos legales', fiscalData.legalFees],
      ['Saldos de dudoso cobro', fiscalData.badDebts],
      ['Otros gastos', fiscalData.otherExpenses],
      ['TOTAL GASTOS DEDUCIBLES', fiscalData.totalExpenses]
    ];
    
    const gastosSheet = XLSX.utils.aoa_to_sheet(gastosData);
    
    // Apply column widths
    if (!gastosSheet['!cols']) gastosSheet['!cols'] = [];
    gastosSheet['!cols'][0] = { width: 30 };
    gastosSheet['!cols'][1] = { width: 15 };
    
    XLSX.utils.book_append_sheet(workbook, gastosSheet, 'Gastos Deducibles');

    // Pestaña Resumen
    const resumenData = [
      [`Resumen Fiscal de ${propertyName} - IRPF ${year}`],
      [], // Empty row for spacing
      ['Concepto', 'Importe (€)'],
      ['Ingresos Íntegros', fiscalData.totalIncome],
      ['Gastos Deducibles', fiscalData.totalExpenses],
      ['Rendimiento Neto', fiscalData.netProfit],
      [`Reducción (${fiscalData.applicableReduction}%)`, fiscalData.applicableReduction / 100 * fiscalData.netProfit],
      ['Rendimiento Neto Reducido', fiscalData.reducedNetProfit]
    ];
    
    const resumenSheet = XLSX.utils.aoa_to_sheet(resumenData);
    
    // Apply column widths
    if (!resumenSheet['!cols']) resumenSheet['!cols'] = [];
    resumenSheet['!cols'][0] = { width: 30 };
    resumenSheet['!cols'][1] = { width: 15 };
    
    XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen');

    // Pestaña Información adicional
    const infoData = [
      ['Información para la declaración de la Renta (IRPF)'],
      [], // Empty row for spacing
      ['Instrucciones de cumplimentación:'],
      ['1. Los datos deben declararse en el Apartado C "Rendimientos del capital inmobiliario" de Renta Web.'],
      ['2. Incluya la referencia catastral del inmueble en la declaración.'],
      ['3. Conserve todos los justificantes de ingresos y gastos durante al menos 4 años.'],
      ['4. El exceso de gastos sobre los ingresos puede compensarse en los 4 años siguientes.'],
      [], // Empty row for spacing
      ['Fundamento legal:'],
      ['- Ley 35/2006 del Impuesto sobre la Renta de las Personas Físicas'],
      ['- Real Decreto 439/2007 (Reglamento del IRPF)'],
      ['- Ley 12/2023 por el derecho a la vivienda']
    ];
    
    const infoSheet = XLSX.utils.aoa_to_sheet(infoData);
    
    // Apply column widths
    if (!infoSheet['!cols']) infoSheet['!cols'] = [];
    infoSheet['!cols'][0] = { width: 80 };
    
    XLSX.utils.book_append_sheet(workbook, infoSheet, 'Información Adicional');

    // Set options for UTF-8 encoding and other formatting
    const exportOptions = { 
      bookType: 'xlsx', 
      type: 'binary',
      cellStyles: true,
      bookSST: true // Enable Shared String Table for proper UTF-8 support
    };

    // Write the file with proper encoding
    XLSX.writeFile(workbook, fileName, exportOptions);
    
    return true;
  } catch (error) {
    console.error('Error exporting Excel:', error);
    return false;
  }
};
