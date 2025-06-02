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
import autoTable from 'jspdf-autotable';

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

  const generateIndividualPDF = (propertyId: string) => {
    try {
      setExporting(true);
      const property = properties.find(p => p.id === propertyId);
      if (!property) {
        toast.error('No se encontró la propiedad seleccionada');
        setExporting(false);
        return;
      }

      const propertyDetail = fiscalData.propertyDetails.find(p => p.id === propertyId);
      if (!propertyDetail) {
        toast.error('No hay datos fiscales para esta propiedad');
        setExporting(false);
        return;
      }

      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text(`Informe Fiscal - ${property.name} (${selectedYear})`, 14, 20);
      
      doc.setFontSize(12);
      doc.text(`Dirección: ${property.address || 'No especificada'}`, 14, 30);
      doc.text(`Periodo fiscal: Año ${selectedYear}`, 14, 38);
      
      let finalY = 45;
      autoTable(doc, {
        startY: 45,
        head: [['Concepto', 'Importe (€)']],
        body: [
          ['Ingresos brutos', propertyDetail.grossIncome.toFixed(2)],
          ['Gastos deducibles', propertyDetail.expenses.toFixed(2)],
          ['Rendimiento neto', propertyDetail.netProfit.toFixed(2)],
          ['Reducción aplicada (%)', `${propertyDetail.reductionPercentage}%`],
          ['Importe de la reducción', propertyDetail.reducedProfit.toFixed(2)],
          ['Base imponible', (propertyDetail.netProfit - propertyDetail.reducedProfit).toFixed(2)]
        ],
        didDrawPage: (data) => {
          finalY = data.cursor?.y || finalY;
        }
      });
      
      doc.setFontSize(11);
      let explanationY = finalY + 15;
      doc.text('Explicación de la reducción aplicada:', 14, explanationY);
      explanationY += 8;
      
      let explanation = '';
      if (propertyDetail.reductionPercentage === 60) {
        explanation = '60% - Reducción por alquiler de vivienda habitual';
      } else if (propertyDetail.reductionPercentage === 70) {
        explanation = '70% - Reducción por alquiler a jóvenes (18-35 años) o en zona tensionada';
      } else if (propertyDetail.reductionPercentage === 40) {
        explanation = '40% - Reducción estándar para alquiler no residencial';
      } else {
        explanation = `${propertyDetail.reductionPercentage}% - Reducción calculada según normativa fiscal`;
      }
      
      doc.text(explanation, 14, explanationY);
      doc.text(`Meses ocupados: ${propertyDetail.occupancyMonths} de 12 (${((propertyDetail.occupancyMonths/12)*100).toFixed(1)}%)`, 14, explanationY + 15);
      
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} - Página 1 de 1`, 14, pageHeight - 10);
      
      doc.save(`Informe_Fiscal_${property.name.replace(/\s+/g, "_")}_${selectedYear}.pdf`);
      
      toast.success(`Informe individual de ${property.name} generado correctamente`);
      setExporting(false);
      setShowIndividualDialog(false);
    } catch (error) {
      console.error('Error generando PDF individual:', error);
      toast.error('Error al generar el informe individual');
      setExporting(false);
    }
  };

  const generateConsolidatedPDF = () => {
    try {
      setExporting(true);
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text(`Informe Fiscal Consolidado - ${selectedYear}`, 14, 20);
      
      doc.setFontSize(12);
      doc.text(`Periodo fiscal: Año ${selectedYear}`, 14, 30);
      doc.text(`Propiedades incluidas: ${selectedPropertyId === 'all' ? 'Todas' : 'Seleccionada'}`, 14, 38);
      
      let finalY = 45;
      autoTable(doc, {
        startY: 45,
        head: [['Concepto', 'Importe (€)']],
        body: [
          ['Ingresos totales', fiscalData.grossIncome.toFixed(2)],
          ['Gastos deducibles', fiscalData.deductibleExpenses.toFixed(2)],
          ['Rendimiento neto', fiscalData.netProfit.toFixed(2)],
          ['Reducción aplicada (%)', `${fiscalData.reductionPercentage}%`],
          ['Base imponible', fiscalData.taxableBase.toFixed(2)],
          ['Cuota IRPF estimada', fiscalData.irpfQuota.toFixed(2)]
        ],
        didDrawPage: (data) => {
          finalY = data.cursor?.y || finalY;
        }
      });
      
      const propertyRows = fiscalData.propertyDetails.map(prop => [
        prop.name,
        prop.grossIncome.toFixed(2),
        prop.expenses.toFixed(2),
        prop.netProfit.toFixed(2),
        `${prop.reductionPercentage}%`,
        (prop.netProfit - prop.reducedProfit).toFixed(2)
      ]);
      
      autoTable(doc, {
        startY: finalY + 15,
        head: [['Propiedad', 'Ingresos (€)', 'Gastos (€)', 'Neto (€)', 'Reducción', 'Base Imponible (€)']],
        body: propertyRows,
        headStyles: { fillColor: [60, 60, 120] },
        didDrawPage: (data) => {
          finalY = data.cursor?.y || finalY;
        }
      });
      
      let notesY = finalY + 15;
      doc.setFontSize(11);
      doc.text('Notas importantes:', 14, notesY);
      notesY += 7;
      doc.setFontSize(10);
      doc.text('- Los cálculos de este informe son orientativos según la normativa fiscal vigente.', 14, notesY);
      notesY += 6;
      doc.text('- Se recomienda consultar con un asesor fiscal para la declaración final.', 14, notesY);
      
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} - Página 1 de 1`, 14, pageHeight - 10);
      
      doc.save(`Informe_Fiscal_Consolidado_${selectedYear}.pdf`);
      
      toast.success('Informe consolidado generado correctamente');
      setExporting(false);
    } catch (error) {
      console.error('Error generando PDF consolidado:', error);
      toast.error('Error al generar el informe consolidado');
      setExporting(false);
    }
  };

  const generateComparativePDF = () => {
    try {
      setExporting(true);
      toast.info(`Generando informe comparativo para ${selectedYear}...`, {
        duration: 3000
      });
      
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text(`Informe Comparativo - ${selectedYear}`, 14, 20);
      
      doc.setFontSize(12);
      doc.text('Este informe muestra una comparativa de rendimientos por propiedad.', 14, 30);
      
      const comparativeData = fiscalData.propertyDetails.map(prop => {
        const rentabilidad = prop.grossIncome > 0 ? (prop.netProfit / prop.grossIncome) * 100 : 0;
        return [
          prop.name,
          prop.grossIncome.toFixed(2),
          prop.expenses.toFixed(2),
          prop.netProfit.toFixed(2),
          `${rentabilidad.toFixed(1)}%`,
          prop.occupancyMonths
        ];
      });
      
      let finalY = 40;
      autoTable(doc, {
        startY: 40,
        head: [['Propiedad', 'Ingresos (€)', 'Gastos (€)', 'Neto (€)', 'Rentabilidad', 'Meses ocupados']],
        body: comparativeData,
        headStyles: { fillColor: [60, 90, 100] },
        didDrawPage: (data) => {
          finalY = data.cursor?.y || finalY;
        }
      });
      
      let chartY = finalY + 15;
      doc.setFontSize(14);
      doc.text('Rendimiento por propiedad:', 14, chartY);
      chartY += 10;
      
      fiscalData.propertyDetails.forEach((prop, index) => {
        const barLength = Math.min(100, Math.max(5, prop.netProfit / 100));
        const bar = '█'.repeat(Math.floor(barLength/5));
        doc.setFontSize(10);
        doc.text(`${prop.name.substring(0, 15)}${prop.name.length > 15 ? '...' : ''}: ${bar} ${prop.netProfit.toFixed(2)}€`, 14, chartY + (index * 7));
      });
      
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} - Página 1 de 1`, 14, pageHeight - 10);
      
      doc.save(`Informe_Comparativo_${selectedYear}.pdf`);
      
      toast.success('Informe comparativo generado correctamente');
      setExporting(false);
    } catch (error) {
      console.error('Error generando PDF comparativo:', error);
      toast.error('Error al generar el informe comparativo');
      setExporting(false);
    }
  };

  const handleExportExcel = () => {
    try {
      setExporting(true);
      
      const wb = XLSX.utils.book_new();

      const summaryData = [
        ['RESUMEN FISCAL', selectedYear],
        [''],
        ['Concepto', 'Importe (€)'],
        ['Ingresos totales', fiscalData.grossIncome],
        ['Gastos deducibles', fiscalData.deductibleExpenses],
        ['Beneficio neto', fiscalData.netProfit],
        ['Base imponible', fiscalData.taxableBase],
        ['Cuota IRPF estimada', fiscalData.irpfQuota]
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Resumen');

      const propertiesData = [
        ['DETALLE POR PROPIEDADES'],
        [''],
        ['Propiedad', 'Ingresos (€)', 'Gastos (€)', 'Neto (€)', 'Reducción (%)', 'Base Imponible (€)', 'Rentabilidad (%)'],
        ...fiscalData.propertyDetails.map(prop => [
          prop.name,
          prop.grossIncome,
          prop.expenses,
          prop.netProfit,
          prop.reductionPercentage,
          prop.netProfit - prop.reducedProfit,
          prop.grossIncome > 0 ? ((prop.netProfit / prop.grossIncome) * 100).toFixed(1) : '0.0'
        ])
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(propertiesData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Propiedades');

      const recordsData = [
        ['REGISTROS HISTÓRICOS DETALLADOS'],
        [''],
        ['Propiedad', 'Mes', 'Año', 'Ingresos (€)', 'Gastos (€)', 'Neto (€)', 'Fecha Registro'],
        ...fiscalData.filteredRecords.map(record => {
          const property = properties.find(p => p.id === record.propiedadId);
          const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          return [
            property?.name || record.propiedadId,
            months[record.mes] || record.mes + 1,
            record.año,
            record.ingresos,
            record.gastos,
            record.ingresos - record.gastos,
            new Date(record.createdAt).toLocaleDateString('es-ES')
          ];
        })
      ];
      const ws3 = XLSX.utils.aoa_to_sheet(recordsData);
      XLSX.utils.book_append_sheet(wb, ws3, 'Registros');

      XLSX.writeFile(wb, `Informe_Fiscal_${selectedYear}_${selectedPropertyId === 'all' ? 'Completo' : 'Propiedad'}.xlsx`);
      
      toast.success('Archivo Excel generado correctamente');
      setExporting(false);
    } catch (error) {
      console.error('Error generando Excel:', error);
      toast.error('Error al generar el archivo Excel');
      setExporting(false);
    }
  };

  const exportCSV = () => {
    try {
      setExporting(true);
      
      const headers = ['Propiedad', 'Mes', 'Año', 'Ingresos', 'Gastos', 'Neto'];
      
      const csvData = [
        headers.join(','),
        ...fiscalData.filteredRecords.map(record => {
          const property = properties.find(p => p.id === record.propiedadId);
          const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          return [
            property?.name || 'Desconocida',
            months[record.mes] || (record.mes + 1),
            record.año,
            record.ingresos,
            record.gastos,
            record.ingresos - record.gastos
          ].join(',');
        })
      ].join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Datos_Fiscales_${selectedYear}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Archivo CSV generado correctamente');
      setExporting(false);
    } catch (error) {
      console.error('Error generando CSV:', error);
      toast.error('Error al generar el archivo CSV');
      setExporting(false);
    }
  };

  return (
    <>
      {/* Diseño móvil */}
      <div className="flex flex-col sm:hidden space-y-3">
        <div className="grid grid-cols-2 gap-1">
          <Dialog open={showIndividualDialog} onOpenChange={setShowIndividualDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="text-[10px] px-1 py-2 leading-tight min-h-[44px] flex flex-col items-center justify-center break-words hyphens-auto"
              >
                <FileText className="h-3 w-3 mb-1" />
                <span className="text-center">
                  Individual
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Seleccionar Propiedad</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={exportPropertyId} onValueChange={setExportPropertyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => generateIndividualPDF(exportPropertyId)}
                  className="w-full"
                  disabled={!exportPropertyId || exporting}
                >
                  {exporting ? 'Generando...' : 'Generar PDF Individual'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={generateConsolidatedPDF}
            variant="outline"
            className="text-[10px] px-1 py-2 leading-tight min-h-[44px] flex flex-col items-center justify-center break-words hyphens-auto"
            disabled={exporting}
          >
            <FileText className="h-3 w-3 mb-1" />
            <span className="text-center">
              {exporting ? 'Generando...' : 'Consolidado'}
            </span>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-1">
          <Button 
            onClick={generateComparativePDF}
            variant="outline"
            className="text-[10px] px-1 py-2 leading-tight min-h-[44px] flex flex-col items-center justify-center break-words hyphens-auto"
            disabled={exporting}
          >
            <FileText className="h-3 w-3 mb-1" />
            <span className="text-center">
              {exporting ? 'Generando...' : 'Comparativo'}
            </span>
          </Button>
          
          <Button 
            onClick={handleExportExcel}
            variant="outline"
            className="text-[10px] px-1 py-2 leading-tight min-h-[44px] flex flex-col items-center justify-center break-words hyphens-auto"
            disabled={exporting}
          >
            <FileSpreadsheet className="h-3 w-3 mb-1" />
            <span className="text-center">
              {exporting ? 'Generando...' : 'Excel'}
            </span>
          </Button>
        </div>
        
        <Button
          onClick={exportCSV}
          variant="outline"
          className="text-[10px] px-1 py-2 leading-tight min-h-[44px] flex flex-col items-center justify-center"
          disabled={exporting}
        >
          <Download className="h-3 w-3 mb-1" />
          <span className="text-center">
            {exporting ? 'Generando...' : 'CSV'}
          </span>
        </Button>
      </div>

      {/* Diseño desktop */}
      <div className="hidden sm:flex items-center justify-end gap-3">
        <Dialog open={showIndividualDialog} onOpenChange={setShowIndividualDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2" disabled={exporting}>
              <FileText className="h-4 w-4" />
              Individual
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Seleccionar Propiedad</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={exportPropertyId} onValueChange={setExportPropertyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={() => generateIndividualPDF(exportPropertyId)}
                className="w-full"
                disabled={!exportPropertyId || exporting}
              >
                {exporting ? 'Generando...' : 'Generar PDF Individual'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          onClick={generateConsolidatedPDF}
          variant="outline"
          className="flex items-center gap-2"
          disabled={exporting}
        >
          <FileText className="h-4 w-4" />
          {exporting ? 'Generando...' : 'Consolidado'}
        </Button>
        
        <Button 
          onClick={generateComparativePDF}
          variant="outline"
          className="flex items-center gap-2"
          disabled={exporting}
        >
          <FileText className="h-4 w-4" />
          {exporting ? 'Generando...' : 'Comparativo'}
        </Button>
        
        <Button 
          onClick={handleExportExcel}
          variant="outline"
          className="flex items-center gap-2"
          disabled={exporting}
        >
          <FileSpreadsheet className="h-4 w-4" />
          {exporting ? 'Generando...' : 'Excel'}
        </Button>
        
        <Button
          onClick={exportCSV}
          variant="outline"
          className="flex items-center gap-2"
          disabled={exporting}
        >
          <Download className="h-4 w-4" />
          {exporting ? 'Generando...' : 'CSV'}
        </Button>
      </div>
    </>
  );
};

export default FiscalExportButtons;
