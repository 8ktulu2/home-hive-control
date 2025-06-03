
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Button } from '@/components/ui/button';
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
  const [exporting, setExporting] = useState(false);

  const getReductionExplanation = (percentage: number) => {
    switch (percentage) {
      case 90: return "Vivienda en zona tensionada con reducción del precio de alquiler (≥5%)";
      case 70: return "Zona tensionada con inquilino joven (18-35 años) o primer alquiler";
      case 60: return "Obras de rehabilitación previas al contrato";
      case 50: return "Reducción general para arrendamiento de vivienda habitual";
      default: return "No es vivienda habitual - sin reducción aplicable";
    }
  };

  const generateConsolidatedPDF = () => {
    try {
      setExporting(true);
      const doc = new jsPDF();
      
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      let currentY = 20;
      
      // Header mejorado
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text(`INFORME FISCAL IRPF - ${fiscalData.yearRange}`, pageWidth/2, currentY, { align: 'center' });
      currentY += 12;
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'normal');
      doc.text(`Rendimientos del Capital Inmobiliario`, pageWidth/2, currentY, { align: 'center' });
      currentY += 8;
      
      doc.setFontSize(12);
      doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, pageWidth/2, currentY, { align: 'center' });
      currentY += 20;
      
      // SECCIÓN 1: DATOS CLAVE PARA LA DECLARACIÓN
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('DATOS CLAVE PARA LA DECLARACIÓN DE LA RENTA', 14, currentY);
      currentY += 12;
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      
      const summaryData = [
        ['Ingresos Totales (Casilla 011):', `${fiscalData.grossIncome.toFixed(2)}€`, 'Todos los importes percibidos por arrendamiento'],
        ['Gastos Deducibles (Casilla 012):', `${fiscalData.deductibleExpenses.toFixed(2)}€`, 'Art. 23 Ley IRPF: hipoteca, IBI, comunidad, seguros...'],
        ['Rendimiento Neto:', `${fiscalData.netProfit.toFixed(2)}€`, 'Ingresos - Gastos deducibles'],
        ['Reducción Aplicada:', `${fiscalData.reductionPercentage}%`, getReductionExplanation(fiscalData.reductionPercentage)],
        ['Base Imponible (Casilla 013):', `${fiscalData.taxableBase.toFixed(2)}€`, 'Tras aplicar reducciones legales'],
        ['Cuota IRPF Estimada:', `${fiscalData.irpfQuota.toFixed(2)}€`, 'Según tramos IRPF vigentes'],
        ['Retenciones Practicadas:', `${fiscalData.retentions.toFixed(2)}€`, 'Retenciones aplicadas (19% s/ingresos)'],
        ['Resultado Final:', `${fiscalData.finalLiquidity >= 0 ? '+' : ''}${fiscalData.finalLiquidity.toFixed(2)}€`, fiscalData.finalLiquidity >= 0 ? 'A devolver' : 'A pagar']
      ];
      
      summaryData.forEach(([label, value, description]) => {
        if (currentY > pageHeight - 40) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFont(undefined, 'bold');
        doc.text(label, 14, currentY);
        doc.text(value, 120, currentY);
        currentY += 6;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        const descLines = doc.splitTextToSize(description, pageWidth - 30);
        descLines.forEach((line: string) => {
          doc.text(line, 16, currentY);
          currentY += 4;
        });
        doc.setFontSize(12);
        currentY += 3;
      });
      
      currentY += 10;
      
      // SECCIÓN 2: DESGLOSE DE GASTOS
      if (currentY > pageHeight - 60) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('DESGLOSE DETALLADO DE GASTOS DEDUCIBLES', 14, currentY);
      currentY += 12;
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      
      const expenseCategories = [
        { key: 'hipoteca', label: 'Intereses de Hipoteca', description: 'Solo la parte de intereses, no el capital' },
        { key: 'comunidad', label: 'Gastos de Comunidad', description: 'Cuotas ordinarias y extraordinarias' },
        { key: 'ibi', label: 'IBI', description: 'Impuesto sobre Bienes Inmuebles' },
        { key: 'seguroVida', label: 'Seguro de Vida', description: 'Vinculado al préstamo hipotecario' },
        { key: 'seguroHogar', label: 'Seguro del Hogar', description: 'Seguro de la vivienda arrendada' },
        { key: 'compras', label: 'Compras y Mobiliario', description: 'Amortización del mobiliario (10% anual)' },
        { key: 'averias', label: 'Reparaciones', description: 'Gastos de conservación y reparación' },
        { key: 'suministros', label: 'Suministros', description: 'Agua, luz, gas a cargo del propietario' }
      ];
      
      expenseCategories.forEach(({ key, label, description }) => {
        const amount = fiscalData.expenseBreakdown[key as keyof typeof fiscalData.expenseBreakdown];
        if (amount > 0) {
          if (currentY > pageHeight - 25) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.setFont(undefined, 'bold');
          doc.text(`${label}:`, 14, currentY);
          doc.text(`${amount.toFixed(2)}€`, 120, currentY);
          currentY += 5;
          
          doc.setFont(undefined, 'normal');
          doc.setFontSize(10);
          doc.text(description, 16, currentY);
          doc.setFontSize(12);
          currentY += 8;
        }
      });
      
      // SECCIÓN 3: DETALLE POR PROPIEDAD
      doc.addPage();
      currentY = 20;
      
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('DETALLE POR INMUEBLE', 14, currentY);
      currentY += 15;
      
      fiscalData.propertyDetails.forEach((property, index) => {
        if (currentY > pageHeight - 80) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${property.name}`, 14, currentY);
        currentY += 8;
        
        if (property.address) {
          doc.setFontSize(11);
          doc.setFont(undefined, 'italic');
          doc.text(`Dirección: ${property.address}`, 14, currentY);
          currentY += 6;
        }
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        
        const propertyData = [
          ['Ingresos del inmueble:', `${property.grossIncome.toFixed(2)}€`],
          ['Gastos deducibles:', `${property.expenses.toFixed(2)}€`],
          ['Rendimiento neto:', `${property.netProfit.toFixed(2)}€`],
          ['Reducción aplicada:', `${property.reductionPercentage}%`],
          ['Motivo de la reducción:', property.reductionReason],
          ['Base imponible final:', `${property.taxableBase.toFixed(2)}€`],
          ['Ocupación registrada:', `${property.occupancyMonths}/12 meses`]
        ];
        
        propertyData.forEach(([label, value]) => {
          if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.text(`  ${label}`, 14, currentY);
          
          if (label === 'Motivo de la reducción:') {
            doc.setFontSize(9);
            const lines = doc.splitTextToSize(value, pageWidth - 80);
            lines.forEach((line: string, lineIndex: number) => {
              doc.text(line, 80, currentY + (lineIndex * 4));
            });
            currentY += Math.max(6, lines.length * 4);
            doc.setFontSize(11);
          } else {
            doc.text(value, 100, currentY);
            currentY += 6;
          }
        });
        
        currentY += 8;
      });
      
      // SECCIÓN 4: NORMATIVA APLICADA
      doc.addPage();
      currentY = 20;
      
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('NORMATIVA FISCAL APLICADA', 14, currentY);
      currentY += 15;
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('BASE LEGAL:', 14, currentY);
      currentY += 8;
      
      doc.setFont(undefined, 'normal');
      const normativaTexts = [
        '• Ley 35/2006, de 28 de noviembre, del Impuesto sobre la Renta de las Personas Físicas',
        '• Ley 12/2023, de 24 de mayo, por el derecho a la vivienda (reducciones especiales)',
        '• Real Decreto 439/2007, por el que se aprueba el Reglamento del IRPF',
        '',
        'REDUCCIONES APLICABLES SEGÚN LEY 12/2023:',
        '• 90%: Zona tensionada con reducción del precio de alquiler (≥5%)',
        '• 70%: Zona tensionada con inquilino joven (18-35 años)',
        '• 60%: Obras de rehabilitación previas al contrato',
        '• 50%: Reducción general para arrendamiento de vivienda habitual',
        '',
        'IMPORTANTE: Este informe es orientativo según la normativa fiscal española vigente.',
        'Consulte con un asesor fiscal para casos específicos o dudas sobre la aplicación.'
      ];
      
      normativaTexts.forEach(line => {
        if (currentY > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(line, 14, currentY);
        currentY += 5;
      });
      
      // Footer en todas las páginas
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 30, pageHeight - 10);
        doc.text('Informe Fiscal IRPF - Rendimientos del Capital Inmobiliario', 14, pageHeight - 10);
      }
      
      doc.save(`Informe_Fiscal_IRPF_${fiscalData.yearRange.replace('-', '_')}.pdf`);
      
      toast.success('📄 Informe PDF generado correctamente', {
        description: 'El archivo se ha descargado y está listo para adjuntar a tu declaración'
      });
      setExporting(false);
    } catch (error) {
      console.error('Error generando PDF consolidado:', error);
      toast.error('Error al generar el informe PDF');
      setExporting(false);
    }
  };

  const handleExportExcel = () => {
    try {
      setExporting(true);
      
      const wb = XLSX.utils.book_new();

      // Hoja 1: Resumen para Hacienda
      const summaryData = [
        ['INFORME FISCAL IRPF - RENDIMIENTOS DEL CAPITAL INMOBILIARIO'],
        ['Período fiscal:', fiscalData.yearRange],
        ['Generado el:', new Date().toLocaleDateString('es-ES')],
        [''],
        ['DATOS PARA LA DECLARACIÓN DE LA RENTA'],
        [''],
        ['Concepto', 'Casilla Modelo 100', 'Importe (€)', 'Observaciones'],
        ['Ingresos totales', '011', fiscalData.grossIncome, 'Todos los importes percibidos por arrendamiento'],
        ['Gastos deducibles', '012', fiscalData.deductibleExpenses, 'Art. 23 Ley IRPF'],
        ['Rendimiento neto', '-', fiscalData.netProfit, 'Ingresos - Gastos'],
        ['Reducción aplicada (%)', '-', fiscalData.reductionPercentage, getReductionExplanation(fiscalData.reductionPercentage)],
        ['Base imponible', '013', fiscalData.taxableBase, 'Tras aplicar reducciones'],
        ['Cuota IRPF estimada', '-', fiscalData.irpfQuota, 'Según tramos vigentes'],
        ['Retenciones practicadas', '-', fiscalData.retentions, '19% sobre ingresos brutos'],
        ['Resultado final', '-', fiscalData.finalLiquidity, fiscalData.finalLiquidity >= 0 ? 'A devolver' : 'A pagar'],
        [''],
        ['RESUMEN DE ACTIVIDAD'],
        ['Total propiedades', '-', fiscalData.consolidatedSummary.totalProperties, ''],
        ['Meses ocupados', '-', fiscalData.consolidatedSummary.totalMonthsOccupied, ''],
        ['Ocupación promedio (%)', '-', fiscalData.consolidatedSummary.averageOccupancy.toFixed(1), ''],
        ['Rentabilidad promedio (%)', '-', fiscalData.consolidatedSummary.averageRentability.toFixed(1), '']
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Datos para Hacienda');

      // Hoja 2: Desglose de gastos
      const expensesData = [
        ['DESGLOSE DETALLADO DE GASTOS DEDUCIBLES'],
        [''],
        ['Categoría', 'Importe (€)', 'Porcentaje', 'Descripción fiscal'],
        ['Intereses de hipoteca', fiscalData.expenseBreakdown.hipoteca, ((fiscalData.expenseBreakdown.hipoteca / fiscalData.deductibleExpenses) * 100).toFixed(1) + '%', 'Solo la parte de intereses, no el capital'],
        ['Gastos de comunidad', fiscalData.expenseBreakdown.comunidad, ((fiscalData.expenseBreakdown.comunidad / fiscalData.deductibleExpenses) * 100).toFixed(1) + '%', 'Cuotas ordinarias y extraordinarias'],
        ['IBI', fiscalData.expenseBreakdown.ibi, ((fiscalData.expenseBreakdown.ibi / fiscalData.deductibleExpenses) * 100).toFixed(1) + '%', 'Impuesto sobre Bienes Inmuebles'],
        ['Seguro de vida', fiscalData.expenseBreakdown.seguroVida, ((fiscalData.expenseBreakdown.seguroVida / fiscalData.deductibleExpenses) * 100).toFixed(1) + '%', 'Vinculado al préstamo hipotecario'],
        ['Seguro del hogar', fiscalData.expenseBreakdown.seguroHogar, ((fiscalData.expenseBreakdown.seguroHogar / fiscalData.deductibleExpenses) * 100).toFixed(1) + '%', 'Seguro de la vivienda arrendada'],
        ['Compras y mobiliario', fiscalData.expenseBreakdown.compras, ((fiscalData.expenseBreakdown.compras / fiscalData.deductibleExpenses) * 100).toFixed(1) + '%', 'Amortización del mobiliario (10% anual)'],
        ['Reparaciones', fiscalData.expenseBreakdown.averias, ((fiscalData.expenseBreakdown.averias / fiscalData.deductibleExpenses) * 100).toFixed(1) + '%', 'Gastos de conservación y reparación'],
        ['Suministros', fiscalData.expenseBreakdown.suministros, ((fiscalData.expenseBreakdown.suministros / fiscalData.deductibleExpenses) * 100).toFixed(1) + '%', 'Agua, luz, gas a cargo del propietario'],
        [''],
        ['TOTAL GASTOS DEDUCIBLES', fiscalData.deductibleExpenses, '100%', 'Suma de todas las categorías']
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(expensesData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Desglose de Gastos');

      // Hoja 3: Detalle por propiedad
      const propertiesHeader = [
        'Propiedad', 'Dirección', 'Ingresos (€)', 'Gastos (€)', 'Rendimiento Neto (€)', 
        'Reducción (%)', 'Motivo Reducción', 'Base Imponible (€)', 'Ocupación (meses)', 
        'Rentabilidad (%)', 'Ocupación (%)'
      ];
      const propertiesData = [
        ['DETALLE POR INMUEBLE'],
        [''],
        propertiesHeader,
        ...fiscalData.propertyDetails.map(prop => [
          prop.name,
          prop.address || 'No especificada',
          prop.grossIncome,
          prop.expenses,
          prop.netProfit,
          prop.reductionPercentage,
          prop.reductionReason,
          prop.taxableBase,
          prop.occupancyMonths,
          prop.grossIncome > 0 ? ((prop.netProfit / prop.grossIncome) * 100).toFixed(1) : '0.0',
          ((prop.occupancyMonths / 12) * 100).toFixed(1)
        ])
      ];
      const ws3 = XLSX.utils.aoa_to_sheet(propertiesData);
      XLSX.utils.book_append_sheet(wb, ws3, 'Detalle por Inmueble');

      XLSX.writeFile(wb, `Informe_Fiscal_IRPF_${fiscalData.yearRange.replace('-', '_')}.xlsx`);
      
      toast.success('📊 Archivo Excel generado correctamente', {
        description: 'El archivo contiene todos los datos estructurados para tu gestión'
      });
      setExporting(false);
    } catch (error) {
      console.error('Error generando Excel:', error);
      toast.error('Error al generar el archivo Excel');
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center">
      <Button 
        onClick={generateConsolidatedPDF}
        className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
        disabled={exporting}
      >
        <FileText className="h-5 w-5" />
        {exporting ? '⏳ Generando PDF...' : '📄 PDF para Hacienda'}
      </Button>
      
      <Button 
        onClick={handleExportExcel}
        variant="outline"
        className="flex items-center gap-3 border-2 border-green-500 text-green-700 hover:bg-green-50 px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
        disabled={exporting}
      >
        <FileSpreadsheet className="h-5 w-5" />
        {exporting ? '⏳ Generando Excel...' : '📊 Excel Completo'}
      </Button>
    </div>
  );
};

export default FiscalExportButtons;
