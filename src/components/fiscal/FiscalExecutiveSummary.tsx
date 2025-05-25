
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';
import { FiscalData } from '@/hooks/useFiscalCalculations';

interface FiscalExecutiveSummaryProps {
  fiscalData: FiscalData;
  selectedYear: number;
}

const FiscalExecutiveSummary: React.FC<FiscalExecutiveSummaryProps> = ({
  fiscalData,
  selectedYear
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6 text-blue-600" />
            Resumen Ejecutivo - Ejercicio {selectedYear}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="text-base leading-relaxed mb-4">
            Durante el ejercicio fiscal <strong>{selectedYear}</strong>, la cartera de propiedades inmobiliarias 
            ha generado unos <strong>ingresos brutos totales</strong> de <strong>{formatCurrency(fiscalData.grossIncome)}</strong> 
            procedentes de los rendimientos por arrendamiento de viviendas.
          </p>
          
          <p className="text-base leading-relaxed mb-4">
            Los <strong>gastos deducibles</strong> totales han ascendido a <strong>{formatCurrency(fiscalData.deductibleExpenses)}</strong>, 
            incluyendo gastos de conservación, suministros, amortizaciones, gastos financieros e impuestos locales, 
            de conformidad con el artículo 23 de la Ley del IRPF.
          </p>
          
          <p className="text-base leading-relaxed mb-4">
            El <strong>rendimiento neto</strong> obtenido es de <strong>{formatCurrency(fiscalData.netProfit)}</strong>, 
            lo que constituye la base para el cálculo del IRPF según el artículo 25 de la Ley 35/2006.
          </p>
          
          <p className="text-base leading-relaxed mb-4">
            La <strong>cuota íntegra estimada</strong> del IRPF asciende a <strong>{formatCurrency(fiscalData.irpfQuota)}</strong>, 
            aplicando el tipo medio correspondiente a los rendimientos del capital inmobiliario.
          </p>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200 mt-6">
            <h4 className="font-semibold text-blue-800 mb-2">Obligaciones Fiscales</h4>
            <ul className="text-sm space-y-1 text-blue-700">
              <li>• Declaración en Modelo 100 (Renta) - Apartado C "Rendimientos del Capital Inmobiliario"</li>
              <li>• Conservar justificantes de todos los gastos deducibles</li>
              <li>• Presentación antes del 30 de junio del año siguiente</li>
              <li>• Aplicar retenciones del 19% si procede (no residentes)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiscalExecutiveSummary;
