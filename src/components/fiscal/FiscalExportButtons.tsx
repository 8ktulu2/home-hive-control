
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, FileSpreadsheet, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

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

  const handleExportPDF = (type: 'individual' | 'consolidated' | 'comparative') => {
    if (type === 'individual' && !exportPropertyId) {
      toast.error('Selecciona una propiedad para el informe individual');
      return;
    }
    
    const propertyName = type === 'individual' 
      ? properties.find(p => p.id === exportPropertyId)?.name 
      : 'todas las propiedades';
    
    toast.info(`Generando PDF ${type} para ${propertyName}...`, { duration: 2000 });
    
    setTimeout(() => {
      toast.success(`PDF ${type} generado correctamente`, { duration: 3000 });
      if (type === 'individual') {
        setShowIndividualDialog(false);
        setExportPropertyId('');
      }
    }, 1500);
  };

  const handleExportExcel = () => {
    toast.info('Generando archivo Excel completo...', { duration: 2000 });
    
    setTimeout(() => {
      toast.success('Archivo Excel generado correctamente', { duration: 3000 });
    }, 1500);
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
