
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, FileSpreadsheet, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

interface FiscalExportButtonsProps {
  properties: Property[];
  selectedYear: number;
  fiscalData: FiscalData;
  selectedPropertyId: string;
}

const FiscalExportButtons: React.FC<FiscalExportButtonsProps> = ({
  properties,
  selectedYear,
  fiscalData,
  selectedPropertyId
}) => {
  const [showIndividualDialog, setShowIndividualDialog] = useState(false);
  const [exportPropertyId, setExportPropertyId] = useState<string>('');
  const [exporting, setExporting] = useState(false);

  const generateConsolidatedPDF = () => {
    try {
      setExporting(true);
      const doc = new jsPDF();
      
      // Configuración inicial
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      let currentY = 20;
      
      // Header del documento
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text(`Informe Fiscal Consolidado - ${fiscalData.yearRange}`, pageWidth/2, currentY, { align: 'center' });
      currentY += 15;
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, pageWidth/2, currentY, { align: 'center' });
      currentY += 20;
      
      // Resumen ejecutivo
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('RESUMEN EJECUTIVO', 14, currentY);
      currentY += 10;
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      
      const summaryData = [
        ['Ingresos Totales:', `${fiscalData.grossIncome.toFixed(2)}€`],
        ['Gastos Deducibles:', `${fiscalData.deductibleExpenses.toFixed(2)}€`],
        ['Rendimiento Neto:', `${fiscalData.netProfit.toFixed(2)}€`],
        ['Reducción Aplicada:', `${fiscalData.reductionPercentage}%`],
        ['Base Imponible:', `${fiscalData.taxableBase.toFixed(2)}€`],
        ['Cuota IRPF Estimada:', `${fiscalData.irpfQuota.toFixed(2)}€`],
        ['Retenciones (19%):', `${fiscalData.retentions.toFixed(2)}€`],
        ['Liquidez Final:', `${fiscalData.finalLiquidity.toFixed(2)}€`]
      ];
      
      summaryData.forEach(([label, value]) => {
        doc.text(label, 14, currentY);
        doc.text(value, 120, currentY);
        currentY += 7;
      });
      
      currentY += 10;
      
      // Normativa aplicada
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('NORMATIVA APLICADA', 14, currentY);
      currentY += 10;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const normativaText = [
        '• Ley 35/2006, de 28 de noviembre, del Impuesto sobre la Renta de las Personas Físicas',
        '• Ley 12/2023, de 24 de mayo, por el derecho a la vivienda (reducciones especiales)',
        '• Real Decreto 439/2007, por el que se aprueba el Reglamento del IRPF',
        '',
        'REDUCCIONES APLICABLES SEGÚN LEY 12/2023:',
        '• 90%: Zona tensionada con reducción del precio de alquiler (≥5%)',
        '• 70%: Zona tensionada con inquilino joven (18-35 años)',
        '• 60%: Obras de rehabilitación previas al contrato',
        '• 50%: Reducción general para arrendamiento de vivienda habitual'
      ];
      
      normativaText.forEach(line => {
        if (currentY > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(line, 14, currentY);
        currentY += 5;
      });
      
      // Nueva página para detalle por propiedades
      doc.addPage();
      currentY = 20;
      
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('DETALLE POR PROPIEDADES', 14, currentY);
      currentY += 15;
      
      // Tabla de propiedades
      fiscalData.propertyDetails.forEach((property, index) => {
        if (currentY > pageHeight - 60) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${property.name}`, 14, currentY);
        currentY += 8;
        
        if (property.address) {
          doc.setFontSize(10);
          doc.setFont(undefined, 'italic');
          doc.text(`Dirección: ${property.address}`, 14, currentY);
          currentY += 6;
        }
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        
        const propertyData = [
          ['Ingresos:', `${property.grossIncome.toFixed(2)}€`],
          ['Gastos:', `${property.expenses.toFixed(2)}€`],
          ['Rendimiento Neto:', `${property.netProfit.toFixed(2)}€`],
          ['Reducción Aplicada:', `${property.reductionPercentage}% - ${property.reductionReason}`],
          ['Base Imponible:', `${property.taxableBase.toFixed(2)}€`],
          ['Ocupación:', `${property.occupancyMonths}/12 meses`]
        ];
        
        propertyData.forEach(([label, value]) => {
          doc.text(`  ${label}`, 14, currentY);
          if (label === 'Reducción Aplicada:') {
            // Para la reducción, usar fuente más pequeña si es muy largo
            doc.setFontSize(9);
            const lines = doc.splitTextToSize(value, pageWidth - 80);
            lines.forEach((line: string, lineIndex: number) => {
              doc.text(line, 80, currentY + (lineIndex * 4));
            });
            currentY += Math.max(6, lines.length * 4);
            doc.setFontSize(11);
          } else {
            doc.text(value, 80, currentY);
            currentY += 6;
          }
        });
        
        currentY += 5;
      });
      
      // Footer en todas las páginas
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 30, pageHeight - 10);
        doc.text('Este informe es orientativo según normativa fiscal española vigente', 14, pageHeight - 10);
      }
      
      doc.save(`Informe_Fiscal_Consolidado_${fiscalData.yearRange.replace('-', '_')}.pdf`);
      
      toast.success('Informe consolidado generado correctamente');
      setExporting(false);
    } catch (error) {
      console.error('Error generando PDF consolidado:', error);
      toast.error('Error al generar el informe consolidado');
      setExporting(false);
    }
  };

  const handleExportExcel = () => {
    try {
      setExporting(true);
      
      const wb = XLSX.utils.book_new();

      // Hoja de resumen
      const summaryData = [
        ['INFORME FISCAL CONSOLIDADO', fiscalData.yearRange],
        ['Generado el', new Date().toLocaleDateString('es-ES')],
        [''],
        ['RESUMEN EJECUTIVO'],
        ['Concepto', 'Importe (€)'],
        ['Ingresos totales', fiscalData.grossIncome],
        ['Gastos deducibles', fiscalData.deductibleExpenses],
        ['Rendimiento neto', fiscalData.netProfit],
        ['Reducción aplicada (%)', fiscalData.reductionPercentage],
        ['Base imponible', fiscalData.taxableBase],
        ['Cuota IRPF estimada', fiscalData.irpfQuota],
        ['Retenciones aplicadas', fiscalData.retentions],
        ['Liquidez final', fiscalData.finalLiquidity],
        [''],
        ['CONSOLIDADO'],
        ['Total propiedades', fiscalData.consolidatedSummary.totalProperties],
        ['Meses ocupados', fiscalData.consolidatedSummary.totalMonthsOccupied],
        ['Ocupación promedio (%)', fiscalData.consolidatedSummary.averageOccupancy.toFixed(1)],
        ['Rentabilidad promedio (%)', fiscalData.consolidatedSummary.averageRentability.toFixed(1)]
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Resumen');

      // Hoja de propiedades
      const propertiesHeader = [
        'Propiedad', 'Dirección', 'Ingresos (€)', 'Gastos (€)', 'Rendimiento Neto (€)', 
        'Reducción (%)', 'Motivo Reducción', 'Base Imponible (€)', 'Ocupación (meses)', 'Rentabilidad (%)'
      ];
      const propertiesData = [
        propertiesHeader,
        ...fiscalData.propertyDetails.map(prop => [
          prop.name,
          prop.address || '',
          prop.grossIncome,
          prop.expenses,
          prop.netProfit,
          prop.reductionPercentage,
          prop.reductionReason,
          prop.taxableBase,
          prop.occupancyMonths,
          prop.grossIncome > 0 ? ((prop.netProfit / prop.grossIncome) * 100).toFixed(1) : '0.0'
        ])
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(propertiesData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Propiedades');

      // Hoja de desglose de gastos
      const expensesData = [
        ['DESGLOSE DE GASTOS POR CATEGORÍA'],
        [''],
        ['Categoría', 'Importe Total (€)'],
        ['Hipoteca', fiscalData.expenseBreakdown.hipoteca],
        ['Comunidad', fiscalData.expenseBreakdown.comunidad],
        ['IBI', fiscalData.expenseBreakdown.ibi],
        ['Seguro de Vida', fiscalData.expenseBreakdown.seguroVida],
        ['Seguro de Hogar', fiscalData.expenseBreakdown.seguroHogar],
        ['Compras', fiscalData.expenseBreakdown.compras],
        ['Averías', fiscalData.expenseBreakdown.averias],
        ['Suministros', fiscalData.expenseBreakdown.suministros]
      ];
      const ws3 = XLSX.utils.aoa_to_sheet(expensesData);
      XLSX.utils.book_append_sheet(wb, ws3, 'Gastos');

      XLSX.writeFile(wb, `Informe_Fiscal_Consolidado_${fiscalData.yearRange.replace('-', '_')}.xlsx`);
      
      toast.success('Archivo Excel generado correctamente');
      setExporting(false);
    } catch (error) {
      console.error('Error generando Excel:', error);
      toast.error('Error al generar el archivo Excel');
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      <Button 
        onClick={generateConsolidatedPDF}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        disabled={exporting}
      >
        <FileText className="h-4 w-4" />
        {exporting ? 'Generando...' : 'PDF Consolidado'}
      </Button>
      
      <Button 
        onClick={handleExportExcel}
        variant="outline"
        className="flex items-center gap-2"
        disabled={exporting}
      >
        <FileSpreadsheet className="h-4 w-4" />
        {exporting ? 'Generando...' : 'Excel Completo'}
      </Button>
    </div>
  );
};

export default FiscalExportButtons;
