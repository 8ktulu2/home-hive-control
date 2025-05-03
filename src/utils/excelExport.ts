
import * as XLSX from 'xlsx';
import { TaxReport } from '@/types/property';

// Base styling function for cells
const applyCellStyle = (ws: XLSX.WorkSheet, cell: string, style: Partial<XLSX.CellStyle>) => {
  if (!ws['!cols']) ws['!cols'] = [];
  if (!ws['!rows']) ws['!rows'] = [];
  
  const c = XLSX.utils.decode_cell(cell);
  if (!ws[cell]) ws[cell] = { v: "" };
  
  if (!ws[cell].s) ws[cell].s = {};
  Object.assign(ws[cell].s, style);
};

// Apply styling to a range of cells
const applyCellRangeStyle = (ws: XLSX.WorkSheet, range: string, style: Partial<XLSX.CellStyle>) => {
  const [start, end] = range.split(':');
  const startCell = XLSX.utils.decode_cell(start);
  const endCell = XLSX.utils.decode_cell(end);
  
  for (let r = startCell.r; r <= endCell.r; ++r) {
    for (let c = startCell.c; c <= endCell.c; ++c) {
      const cell = XLSX.utils.encode_cell({r, c});
      applyCellStyle(ws, cell, style);
    }
  }
};

// Convert euros to fixed decimal format
const formatEuro = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format a percentage
const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(0)}%`;
};

// Set column widths for better readability
const setColumnWidths = (ws: XLSX.WorkSheet, widths: number[]) => {
  if (!ws['!cols']) ws['!cols'] = [];
  
  for (let i = 0; i < widths.length; i++) {
    ws['!cols'][i] = { wch: widths[i] };
  }
};

// Create a basic table header with styling
const createTableHeader = (ws: XLSX.WorkSheet, headers: string[], row: number) => {
  // Add header rows
  for (let i = 0; i < headers.length; i++) {
    const cell = XLSX.utils.encode_cell({r: row, c: i});
    ws[cell] = { v: headers[i] };
    
    // Apply header styling
    applyCellStyle(ws, cell, {
      font: { bold: true, color: { rgb: "000000" } },
      fill: { fgColor: { rgb: "E6F0FA" } },
      border: {
        top: { style: 'thin', color: { rgb: "000000" } },
        bottom: { style: 'thin', color: { rgb: "000000" } },
        left: { style: 'thin', color: { rgb: "000000" } },
        right: { style: 'thin', color: { rgb: "000000" } }
      }
    });
  }
};

// Create the income tab in the Excel report
const createIncomeSheet = (wb: XLSX.WorkBook, report: TaxReport) => {
  const ws = XLSX.utils.aoa_to_sheet([]);
  
  // Add title
  ws['A1'] = { v: "INFORME DE INGRESOS" };
  applyCellStyle(ws, 'A1', { 
    font: { bold: true, sz: 14, color: { rgb: "000000" } },
  });
  
  // Add header
  createTableHeader(ws, ["Concepto", "Importe (€)"], 3);
  
  // Add data rows
  const rows = [
    ["Ingresos por alquiler", report.rentalIncome],
    ["Subvenciones", report.subsidies],
    ["Otros ingresos", report.otherIncome]
  ];
  
  let r = 4;
  for (const row of rows) {
    ws[XLSX.utils.encode_cell({r, c: 0})] = { v: row[0] };
    applyCellStyle(ws, XLSX.utils.encode_cell({r, c: 0}), {
      border: {
        top: { style: 'thin', color: { rgb: "000000" } },
        bottom: { style: 'thin', color: { rgb: "000000" } },
        left: { style: 'thin', color: { rgb: "000000" } },
        right: { style: 'thin', color: { rgb: "000000" } }
      }
    });
    
    ws[XLSX.utils.encode_cell({r, c: 1})] = { v: row[1] };
    applyCellStyle(ws, XLSX.utils.encode_cell({r, c: 1}), {
      numFmt: "€#,##0.00",
      border: {
        top: { style: 'thin', color: { rgb: "000000" } },
        bottom: { style: 'thin', color: { rgb: "000000" } },
        left: { style: 'thin', color: { rgb: "000000" } },
        right: { style: 'thin', color: { rgb: "000000" } }
      }
    });
    
    r++;
  }
  
  // Add total row
  ws[XLSX.utils.encode_cell({r, c: 0})] = { v: "TOTAL INGRESOS" };
  applyCellStyle(ws, XLSX.utils.encode_cell({r, c: 0}), {
    font: { bold: true },
    fill: { fgColor: { rgb: "F7F7F7" } },
    border: {
      top: { style: 'thin', color: { rgb: "000000" } },
      bottom: { style: 'thin', color: { rgb: "000000" } },
      left: { style: 'thin', color: { rgb: "000000" } },
      right: { style: 'thin', color: { rgb: "000000" } }
    }
  });
  
  ws[XLSX.utils.encode_cell({r, c: 1})] = { 
    v: report.totalIncome,
    f: "SUM(B5:B7)"
  };
  applyCellStyle(ws, XLSX.utils.encode_cell({r, c: 1}), {
    font: { bold: true },
    fill: { fgColor: { rgb: "F7F7F7" } },
    numFmt: "€#,##0.00",
    border: {
      top: { style: 'thin', color: { rgb: "000000" } },
      bottom: { style: 'thin', color: { rgb: "000000" } },
      left: { style: 'thin', color: { rgb: "000000" } },
      right: { style: 'thin', color: { rgb: "000000" } }
    }
  });
  
  // Set column widths
  setColumnWidths(ws, [30, 15]);
  
  // Set worksheet range
  ws['!ref'] = "A1:" + XLSX.utils.encode_cell({r: r, c: 1});
  
  // Add to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Ingresos");
  return wb;
};

// Export the report to Excel
export const exportToExcel = (report: TaxReport) => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create sheets
    createIncomeSheet(wb, report);
    // Add more sheets as needed...
    
    // Write the file with correct options for UTF-8 support
    XLSX.writeFile(wb, `Informe_Tributario_${report.propertyName.replace(/\s+/g, '_')}.xlsx`, { 
      bookType: 'xlsx', 
      type: 'binary', 
      cellStyles: true
    });
    
    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};

// Export an expanded report with more details
export const exportDetailedExcel = (report: TaxReport) => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create sheets (income, expenses, summary, explanations)
    createIncomeSheet(wb, report);
    // Add more detailed sheets...
    
    // Write the file with correct options
    XLSX.writeFile(wb, `Informe_Tributario_Detallado_${report.propertyName.replace(/\s+/g, '_')}.xlsx`, {
      bookType: 'xlsx',
      type: 'binary',
      cellStyles: true
    });
    
    return true;
  } catch (error) {
    console.error("Error exporting to detailed Excel:", error);
    return false;
  }
};
