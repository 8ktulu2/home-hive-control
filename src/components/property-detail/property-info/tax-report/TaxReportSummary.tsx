
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import TaxInfoTooltip from './TaxInfoTooltip';

interface TaxReportSummaryProps {
  grossIncome: number;
  expenses: number;
  netIncome: number;
  reductionPercentage: number;
  reduction: number;
  taxableIncome: number;
}

const TaxReportSummary: React.FC<TaxReportSummaryProps> = ({
  grossIncome,
  expenses,
  netIncome,
  reductionPercentage,
  reduction,
  taxableIncome
}) => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resumen Fiscal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Ingresos íntegros</span>
                <TaxInfoTooltip content="Total de rentas recibidas durante el año fiscal." />
              </div>
              <span className="text-sm">{grossIncome.toLocaleString('es-ES')} €</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Gastos deducibles</span>
                <TaxInfoTooltip content="Gastos que la ley permite restar de los ingresos (hipoteca, IBI, etc.)." />
              </div>
              <span className="text-sm text-red-600">- {expenses.toLocaleString('es-ES')} €</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${Math.min(100, (expenses / grossIncome) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Rendimiento neto</span>
                <TaxInfoTooltip content="Resultado de restar los gastos deducibles de los ingresos íntegros." />
              </div>
              <span className="text-sm font-medium">{netIncome.toLocaleString('es-ES')} €</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Reducción ({reductionPercentage}%)</span>
                <TaxInfoTooltip content={`Reducción del ${reductionPercentage}% por alquiler de vivienda habitual (Ley 12/2023).`} />
              </div>
              <span className="text-sm text-green-600">- {reduction.toLocaleString('es-ES')} €</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${reductionPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-base font-medium">Rendimiento a declarar</span>
                <TaxInfoTooltip content="Base imponible final que se integra en la declaración del IRPF." />
              </div>
              <span className="text-base font-bold">{taxableIncome.toLocaleString('es-ES')} €</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg mt-6">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Información para la declaración</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Declarar en el Apartado C "Rendimientos del Capital Inmobiliario" de Renta Web</li>
              <li>• Indicar referencia catastral del inmueble</li>
              <li>• Detallar todos los gastos deducibles con sus correspondientes justificantes</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxReportSummary;
