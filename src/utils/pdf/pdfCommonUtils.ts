
import jsPDF from 'jspdf';

/**
 * Adds a formatted header to the PDF document
 */
export const addHeader = (doc: jsPDF, title: string, subtitle: string) => {
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
export const addSectionTitle = (doc: jsPDF, title: string, y: number) => {
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
export const addExplanatoryText = (doc: jsPDF, text: string, y: number) => {
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  
  const splitText = doc.splitTextToSize(text, 150);
  doc.text(splitText, 25, y);
  
  return y + (splitText.length * 5) + 5;  // Return Y position after text
};

/**
 * Adds footer to all pages in the PDF
 */
export const addFooters = (doc: jsPDF, propertyName: string, year?: number) => {
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
    
    const yearText = year ? ` - Año ${year}` : '';
    doc.text(
      'Informe Fiscal Inmueble: ' + propertyName + yearText, 
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
};
