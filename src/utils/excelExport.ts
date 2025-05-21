
import * as XLSX from 'xlsx';
import { FiscalData } from '@/components/finances/historical/types';
import { Property, TaxInfo } from '@/types/property';

/**
 * Exports fiscal data to Excel
 * 
 * @param data The fiscal data to export
 * @param propertyName The property name
 * @param selectedYear The selected year
 * @param filename The filename to save as
 */
export const exportFiscalDataToExcel = (data: FiscalData, propertyName: string, selectedYear: number, filename: string) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Create Ingresos sheet
    const ingresosData = [
      ['Concepto', 'Importe (€)'],
      ['Ingresos por alquiler', data.rentalIncome || 0],
      ['Subvenciones', data.subsidies || 0],
      ['Otros ingresos', data.otherIncome || 0],
      ['TOTAL INGRESOS', data.totalIncome || data.rentalIncome + data.subsidies + data.otherIncome || 0]
    ];
    
    const ingresosSheet = XLSX.utils.aoa_to_sheet(ingresosData);
    formatSheetStyles(ingresosSheet);
    XLSX.utils.book_append_sheet(workbook, ingresosSheet, 'Ingresos');
    
    // Create Gastos sheet
    const gastosData = [
      ['Concepto', 'Importe (€)'],
      ['IBI', data.ibi || 0],
      ['Gastos de comunidad', data.communityFees || 0],
      ['Intereses hipotecarios', data.mortgageInterest || 0],
      ['Seguro de hogar', data.homeInsurance || 0],
      ['Mantenimiento y reparaciones', data.maintenance || 0],
      ['Honorarios de agencia', data.agencyFees || 0],
      ['Gastos administrativos', data.administrativeFees || 0],
      ['Amortización inmueble', data.buildingDepreciation || 0],
      ['Amortización mobiliario', data.furnitureDepreciation || 0],
      ['Suministros', data.utilities || 0],
      ['Tasas municipales', data.municipalTaxes || 0],
      ['Gastos legales', data.legalFees || 0],
      ['Saldos de dudoso cobro', data.badDebts || 0],
      ['Otros gastos', data.otherExpenses || 0],
      ['TOTAL GASTOS', data.totalExpenses || 0]
    ];
    
    const gastosSheet = XLSX.utils.aoa_to_sheet(gastosData);
    formatSheetStyles(gastosSheet);
    XLSX.utils.book_append_sheet(workbook, gastosSheet, 'Gastos Deducibles');
    
    // Create Resumen sheet
    const resumenData = [
      ['Concepto', 'Importe (€)'],
      ['Ingresos Íntegros', data.totalIncome || 0],
      ['Total Gastos Deducibles', data.totalExpenses || 0],
      ['Rendimiento Neto', data.netProfit || 0],
      ['Porcentaje de Reducción', `${data.applicableReduction || 0}%`],
      ['Reducción Aplicada', data.reducedNetProfit || 0],
      ['Base Imponible', (data.netProfit || 0) - (data.reducedNetProfit || 0)]
    ];
    
    const resumenSheet = XLSX.utils.aoa_to_sheet(resumenData);
    formatSheetStyles(resumenSheet);
    XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen');
    
    // Create Reducciones sheet
    const reduccionesData = [
      ['Concepto', 'Valor'],
      ['Zona tensionada', data.inTensionedArea ? 'Sí' : 'No'],
      ['Inquilino joven (18-35 años)', data.youngTenant ? 'Sí' : 'No'],
      ['Rebaja de renta respecto contrato anterior', data.rentLoweredFromPrevious ? 'Sí' : 'No'],
      ['Vivienda rehabilitada recientemente', data.recentlyRenovated ? 'Sí' : 'No'],
      ['Porcentaje de reducción aplicable', `${data.applicableReduction || 0}%`],
      ['Base para la reducción', data.netProfit || 0]
    ];
    
    const reduccionesSheet = XLSX.utils.aoa_to_sheet(reduccionesData);
    formatSheetStyles(reduccionesSheet);
    XLSX.utils.book_append_sheet(workbook, reduccionesSheet, 'Reducciones');
    
    // Create Info sheet with explanations
    const infoData = [
      ['Concepto', 'Explicación'],
      ['IBI', 'Impuesto sobre Bienes Inmuebles. Deducible al 100%.'],
      ['Intereses hipotecarios', 'Solo son deducibles los intereses (no el capital). No pueden superar, junto con los gastos de reparación, los ingresos íntegros.'],
      ['Amortización inmueble', 'Se calcula como el 3% del valor de la construcción (excluido el suelo).'],
      ['Amortización mobiliario', 'Se calcula como el 10% del valor del mobiliario.'],
      ['Reducción 50%', 'Aplicable a viviendas habituales (Art. 23.2, Ley 35/2006).'],
      ['Reducción 60%', 'Para viviendas habituales recientemente rehabilitadas (Ley 12/2023).'],
      ['Reducción 70%', 'Para inquilinos jóvenes (18-35 años) en zonas tensionadas (Ley 12/2023).'],
      ['Reducción 90%', 'Para viviendas en zonas tensionadas con rebaja de renta ≥5% (Ley 12/2023).'],
      ['Informe generado', `${propertyName} - Año ${selectedYear}`]
    ];
    
    const infoSheet = XLSX.utils.aoa_to_sheet(infoData);
    formatSheetStyles(infoSheet);
    XLSX.utils.book_append_sheet(workbook, infoSheet, 'Información Fiscal');
    
    // Write the workbook to file - using proper typing
    XLSX.writeFile(workbook, filename, { 
      bookType: 'xlsx',
      type: 'binary',
      cellStyles: true
    });
    
    return true;
  } catch (error) {
    console.error("Error exporting fiscal data to Excel:", error);
    return false;
  }
};

/**
 * Helper function to format sheet styles
 */
const formatSheetStyles = (sheet: XLSX.WorkSheet) => {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = sheet[XLSX.utils.encode_cell({ r: R, c: C })];
      if (!cell) continue;
      
      // Header row formatting
      if (R === 0) {
        cell.s = {
          fill: { fgColor: { rgb: "E6F0FA" } },
          font: { bold: true },
          alignment: { horizontal: 'center' }
        };
      } 
      // Total row formatting (typically last row)
      else if (R === range.e.r && cell.v && typeof cell.v === 'string' && cell.v.includes('TOTAL')) {
        cell.s = {
          fill: { fgColor: { rgb: "F7F7F7" } },
          font: { bold: true }
        };
      }
    }
  }
};

/**
 * Exports property tax data to Excel for a specific property
 * 
 * @param property The property data
 * @param filename The filename to save as
 */
export const exportPropertyTaxDataToExcel = (property: Property, filename: string) => {
  try {
    const workbook = XLSX.utils.book_new();
    
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
    
    // Create Ingresos sheet
    const ingresosData = [
      ['Concepto', 'Importe (€)'],
      ['Ingresos por alquiler', annualRent],
      ['Subvenciones', property.taxInfo?.subsidies || 0],
      ['Otros ingresos', property.taxInfo?.otherIncome || 0],
      ['TOTAL INGRESOS', annualRent + (property.taxInfo?.subsidies || 0) + (property.taxInfo?.otherIncome || 0)]
    ];
    
    const ingresosSheet = XLSX.utils.aoa_to_sheet(ingresosData);
    formatSheetStyles(ingresosSheet);
    XLSX.utils.book_append_sheet(workbook, ingresosSheet, 'Ingresos');
    
    // Create Gastos sheet
    const gastosData = [
      ['Concepto', 'Importe (€)'],
      ['IBI', ibi],
      ['Gastos de comunidad', communityFee],
      ['Intereses hipotecarios', mortgageInterest],
      ['Seguro de hogar', homeInsurance],
      ['Amortización inmueble (3%)', buildingDepreciation],
      ['Amortización mobiliario (10%)', furnitureDepreciation],
      ['TOTAL GASTOS', totalExpenses]
    ];
    
    const gastosSheet = XLSX.utils.aoa_to_sheet(gastosData);
    formatSheetStyles(gastosSheet);
    XLSX.utils.book_append_sheet(workbook, gastosSheet, 'Gastos Deducibles');
    
    // Create Resumen sheet
    const resumenData = [
      ['Concepto', 'Importe (€)'],
      ['Ingresos Íntegros', annualRent + (property.taxInfo?.subsidies || 0) + (property.taxInfo?.otherIncome || 0)],
      ['Total Gastos Deducibles', totalExpenses],
      ['Rendimiento Neto', netIncome],
      ['Porcentaje de Reducción', `${reductionPercentage}%`],
      ['Reducción Aplicada', reduction],
      ['Base Imponible', taxableIncome]
    ];
    
    const resumenSheet = XLSX.utils.aoa_to_sheet(resumenData);
    formatSheetStyles(resumenSheet);
    XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen');
    
    // Create Información sheet
    const infoData = [
      ['Concepto', 'Valor'],
      ['Referencia Catastral', property.cadastralReference || 'No especificada'],
      ['Dirección', property.address || 'No especificada'],
      ['Vivienda Habitual', property.taxInfo?.isPrimaryResidence ? 'Sí' : 'No'],
      ['Zona Tensionada', property.taxInfo?.isTensionedArea ? 'Sí' : 'No'],
      ['Inquilino Joven (18-35)', property.taxInfo?.hasYoungTenant ? 'Sí' : 'No'],
      ['Rehabilitada Recientemente', property.taxInfo?.recentlyRenovated ? 'Sí' : 'No'],
      ['Rebaja de Renta', property.taxInfo?.rentReduction ? 'Sí' : 'No'],
    ];
    
    const infoSheet = XLSX.utils.aoa_to_sheet(infoData);
    formatSheetStyles(infoSheet);
    XLSX.utils.book_append_sheet(workbook, infoSheet, 'Información Adicional');
    
    // Write the workbook to file - using proper typing
    XLSX.writeFile(workbook, filename, { 
      bookType: 'xlsx',
      type: 'binary',
      cellStyles: true
    });
    
    return true;
  } catch (error) {
    console.error("Error exporting property tax data to Excel:", error);
    return false;
  }
};
