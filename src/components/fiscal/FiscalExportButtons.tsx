
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, FileSpreadsheet, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { exportPropertyTaxDataToPDF } from '@/utils/pdfExport';
import * as XLSX from 'xlsx';

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

  const generateConsolidatedPDF = () => {
    try {
      const consolidatedData = {
        totalIncome: fiscalData.grossIncome,
        totalExpenses: fiscalData.deductibleExpenses,
        netProfit: fiscalData.netProfit,
        taxableBase: fiscalData.taxableBase,
        irpfQuota: fiscalData.irpfQuota,
        properties: fiscalData.propertyDetails
      };

      // Create PDF content
      const content = `
INFORME FISCAL CONSOLIDADO - ${selectedYear}

RESUMEN GENERAL:
- Ingresos totales: ${fiscalData.grossIncome.toLocaleString('es-ES')}€
- Gastos deducibles: ${fiscalData.deductibleExpenses.toLocaleString('es-ES')}€
- Beneficio neto: ${fiscalData.netProfit.toLocaleString('es-ES')}€
- Base imponible: ${fiscalData.taxableBase.toLocaleString('es-ES')}€

DETALLE POR PROPIEDADES:
${fiscalData.propertyDetails.map(prop => `
- ${prop.name}:
  Ingresos: ${prop.grossIncome.toLocaleString('es-ES')}€
  Gastos: ${prop.expenses.toLocaleString('es-ES')}€
  Neto: ${prop.netProfit.toLocaleString('es-ES')}€
`).join('')}
      `;

      // Create and download file
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Informe_Fiscal_Consolidado_${selectedYear}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF consolidado descargado correctamente');
    } catch (error) {
      toast.error('Error al generar el PDF consolidado');
      console.error(error);
    }
  };

  const handleExportPDF = (type: 'individual' | 'consolidated' | 'comparative') => {
    if (type === 'individual' && !exportPropertyId) {
      toast.error('Selecciona una propiedad para el informe individual');
      return;
    }
    
    try {
      if (type === 'individual') {
        const property = properties.find(p => p.id === exportPropertyId);
        if (property) {
          const success = exportPropertyTaxDataToPDF(
            property, 
            `Informe_Fiscal_${property.name}_${selectedYear}.pdf`
          );
          if (success) {
            toast.success(`PDF individual generado para ${property.name}`);
            setShowIndividualDialog(false);
            setExportPropertyId('');
          } else {
            toast.error('Error al generar el PDF individual');
          }
        }
      } else if (type === 'consolidated') {
        generateConsolidatedPDF();
      } else if (type === 'comparative') {
        // Generate comparative report
        const content = `
INFORME COMPARATIVO - ${selectedYear}

COMPARATIVA ANUAL:
Año ${selectedYear - 1}: (datos no disponibles)
Año ${selectedYear}: ${fiscalData.grossIncome.toLocaleString('es-ES')}€ ingresos

EVOLUCIÓN POR PROPIEDADES:
${fiscalData.propertyDetails.map(prop => `
${prop.name}: ${prop.netProfit.toLocaleString('es-ES')}€ beneficio neto
`).join('')}
        `;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Informe_Comparativo_${selectedYear}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('PDF comparativo descargado correctamente');
      }
    } catch (error) {
      toast.error('Error al generar el informe');
      console.error(error);
    }
  };

  const handleExportExcel = () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Summary sheet
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

      // Properties detail sheet
      const propertiesData = [
        ['DETALLE POR PROPIEDADES'],
        [''],
        ['Propiedad', 'Ingresos (€)', 'Gastos (€)', 'Neto (€)', 'Rentabilidad (%)'],
        ...fiscalData.propertyDetails.map(prop => [
          prop.name,
          prop.grossIncome,
          prop.expenses,
          prop.netProfit,
          prop.grossIncome > 0 ? ((prop.netProfit / prop.grossIncome) * 100).toFixed(1) : '0.0'
        ])
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(propertiesData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Propiedades');

      // Save file
      XLSX.writeFile(wb, `Informe_Fiscal_Completo_${selectedYear}.xlsx`);
      toast.success('Archivo Excel descargado correctamente');
    } catch (error) {
      toast.error('Error al generar el archivo Excel');
      console.error(error);
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="flex flex-col sm:hidden space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Dialog open={showIndividualDialog} onOpenChange={setShowIndividualDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 h-12 text-sm">
                <FileText className="h-4 w-4" />
                PDF Individual
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
                  onClick={() => handleExportPDF('individual')}
                  className="w-full"
                  disabled={!exportPropertyId}
                >
                  Generar PDF Individual
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={() => handleExportPDF('consolidated')}
            variant="outline"
            className="flex items-center gap-2 h-12 text-sm"
          >
            <FileText className="h-4 w-4" />
            PDF Consolidado
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => handleExportPDF('comparative')}
            variant="outline"
            className="flex items-center gap-2 h-12 text-sm"
          >
            <FileText className="h-4 w-4" />
            PDF Comparativo
          </Button>
          
          <Button 
            onClick={handleExportExcel}
            variant="outline"
            className="flex items-center gap-2 h-12 text-sm"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel Completo
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-end gap-3">
        <Dialog open={showIndividualDialog} onOpenChange={setShowIndividualDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF Individual
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
                onClick={() => handleExportPDF('individual')}
                className="w-full"
                disabled={!exportPropertyId}
              >
                Generar PDF Individual
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          onClick={() => handleExportPDF('consolidated')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          PDF Consolidado
        </Button>
        
        <Button 
          onClick={() => handleExportPDF('comparative')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          PDF Comparativo
        </Button>
        
        <Button 
          onClick={handleExportExcel}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Excel Completo
        </Button>
      </div>
    </>
  );
};

export default FiscalExportButtons;
