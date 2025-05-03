
import { Property, TaxReport } from '@/types/property';
import * as XLSX from 'xlsx';

// Define custom cell styles for Excel
interface CustomCellStyle {
  font?: { bold?: boolean };
  fill?: { fgColor?: { rgb: string } };
  border?: {
    top?: { style: string };
    bottom?: { style: string };
    left?: { style: string };
    right?: { style: string };
  };
}

// Helper function to apply basic styles to worksheets
const applyBasicStyles = (worksheet: XLSX.WorkSheet, headerRowIndex = 0) => {
  if (!worksheet['!cols']) {
    worksheet['!cols'] = [];
  }
  // Auto-size columns
  worksheet['!cols'] = Array(10).fill({ wch: 15 });
  
  // Apply header styles
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const headerCell = XLSX.utils.encode_cell({ r: headerRowIndex, c: C });
    if (!worksheet[headerCell]) continue;
    
    if (!worksheet[headerCell].s) worksheet[headerCell].s = {};
    worksheet[headerCell].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "E6F0FA" } },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    };
  }
  
  return worksheet;
};

// Export property tax data to Excel
export const exportPropertyTaxDataToExcel = (property: Property, taxInfo: any) => {
  const workbook = XLSX.utils.book_new();
  
  // Income sheet
  const incomeData = [
    ['Concepto', 'Importe (€)'],
    ['Ingresos por alquiler', property.rent ? property.rent * 12 : 0],
    ['Otros ingresos', 0],
    ['Total ingresos', property.rent ? property.rent * 12 : 0],
  ];
  
  const incomeSheet = XLSX.utils.aoa_to_sheet(incomeData);
  applyBasicStyles(incomeSheet);
  XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Ingresos');
  
  // Expenses sheet
  const expensesData = [
    ['Concepto', 'Importe (€)'],
    ['IBI', property.ibi || 0],
    ['Comunidad', property.communityFee || 0],
    ['Intereses hipoteca', taxInfo?.mortgageInterest || 0],
    ['Seguro de hogar', property.homeInsurance?.cost || 0],
    ['Seguro de vida', property.lifeInsurance?.cost || 0],
    ['Mantenimiento', 0],
    ['Amortización inmueble', 0],
    ['Otros gastos', 0],
    ['Total gastos', 0],
  ];
  
  const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData);
  applyBasicStyles(expensesSheet);
  XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Gastos');
  
  // Summary sheet
  const summaryData = [
    ['Concepto', 'Importe (€)'],
    ['Total ingresos', property.rent ? property.rent * 12 : 0],
    ['Total gastos deducibles', 0],
    ['Rendimiento neto', 0],
    ['Reducción (%)', 0],
    ['Base imponible', 0],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  applyBasicStyles(summarySheet);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');
  
  // Write file
  XLSX.writeFile(workbook, `Informe_Fiscal_${property.name || 'Propiedad'}.xlsx`, { 
    bookType: 'xlsx', 
    cellStyles: true,
    type: "binary"
  });
};

// Export fiscal data to Excel
export const exportFiscalDataToExcel = (reportData: TaxReport) => {
  const workbook = XLSX.utils.book_new();
  
  // Income sheet
  const incomeData = [
    ['Concepto', 'Importe (€)'],
    ['Ingresos por alquiler', reportData.rentalIncome || 0],
    ['Subsidios', reportData.subsidies || 0],
    ['Otros ingresos', reportData.otherIncome || 0],
    ['Total ingresos', reportData.totalIncome || 0],
  ];
  
  const incomeSheet = XLSX.utils.aoa_to_sheet(incomeData);
  applyBasicStyles(incomeSheet);
  XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Ingresos');
  
  // Expenses sheet
  const expensesData = [
    ['Concepto', 'Importe (€)'],
    ['IBI', reportData.ibi || 0],
    ['Comunidad', reportData.communityFees || 0],
    ['Intereses hipotecarios', reportData.mortgageInterest || 0],
    ['Seguro de hogar', reportData.homeInsurance || 0],
    ['Mantenimiento y reparaciones', reportData.maintenance || 0],
    ['Gastos administrativos', reportData.administrativeFees || 0],
    ['Honorarios de agencia', reportData.agencyFees || 0],
    ['Amortización inmueble', reportData.propertyDepreciation || 0],
    ['Amortización mobiliario', reportData.furnitureDepreciation || 0],
    ['Suministros', reportData.utilities || 0],
    ['Tasas municipales', reportData.municipalTaxes || 0],
    ['Gastos legales', reportData.legalFees || 0],
    ['Saldos dudoso cobro', reportData.badDebts || 0],
    ['Otros gastos', reportData.otherExpenses || 0],
    ['Total gastos', reportData.totalExpenses || 0],
  ];
  
  const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData);
  applyBasicStyles(expensesSheet);
  XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Gastos Deducibles');
  
  // Summary sheet
  const summaryData = [
    ['Concepto', 'Importe (€)'],
    ['Ingresos Íntegros', reportData.totalIncome || 0],
    ['Total Gastos Deducibles', reportData.totalExpenses || 0],
    ['Rendimiento Neto', reportData.netProfit || 0],
    ['Reducción', reportData.applicableReduction || 0],
    ['Base Imponible', reportData.reducedNetProfit || 0],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  applyBasicStyles(summarySheet);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');
  
  // Write file
  XLSX.writeFile(workbook, `Informe_Fiscal_${reportData.propertyName || 'Propiedad'}.xlsx`, { 
    bookType: 'xlsx',
    cellStyles: true,
    type: "binary"
  });
};
