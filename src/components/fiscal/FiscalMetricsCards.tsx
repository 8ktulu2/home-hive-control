
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator, 
  Percent, 
  Building,
  HelpCircle 
} from 'lucide-react';
import { FiscalData } from '@/hooks/useFiscalCalculations';

interface FiscalMetricsCardsProps {
  fiscalData: FiscalData;
}

const FiscalMetricsCards: React.FC<FiscalMetricsCardsProps> = ({ fiscalData }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const profitabilityRate = fiscalData.grossIncome > 0 
    ? (fiscalData.netProfit / fiscalData.grossIncome) * 100 
    : 0;

  const metrics = [
    {
      title: "Ingresos Brutos",
      value: formatCurrency(fiscalData.grossIncome),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      tooltip: "Total de rentas percibidas por arrendamiento durante el ejercicio fiscal. Se declara en el apartado C del Modelo 100."
    },
    {
      title: "Gastos Deducibles",
      value: formatCurrency(fiscalData.deductibleExpenses),
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      tooltip: "Gastos permitidos por el art. 23 LIRPF: IBI, comunidad, seguros, reparaciones, amortización (3% anual), intereses hipotecarios."
    },
    {
      title: "Rendimiento Neto",
      value: formatCurrency(fiscalData.netProfit),
      icon: DollarSign,
      color: fiscalData.netProfit >= 0 ? "text-blue-600" : "text-red-600",
      bgColor: fiscalData.netProfit >= 0 ? "bg-blue-50" : "bg-red-50",
      borderColor: fiscalData.netProfit >= 0 ? "border-blue-200" : "border-red-200",
      tooltip: "Resultado de restar gastos deducibles de los ingresos brutos. Base para el cálculo del IRPF."
    },
    {
      title: "Base Imponible IRPF",
      value: formatCurrency(fiscalData.taxableBase),
      icon: Calculator,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      tooltip: "Rendimiento neto ajustado que se integra en la base imponible general del IRPF para aplicar la escala de gravamen."
    },
    {
      title: "Cuota IRPF Estimada",
      value: formatCurrency(fiscalData.irpfQuota),
      icon: Percent,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      tooltip: "Estimación de la cuota íntegra aplicando el tipo medio del 24%. El tipo real depende de la base imponible total del contribuyente."
    },
    {
      title: "Rentabilidad Fiscal",
      value: formatPercentage(profitabilityRate),
      icon: Building,
      color: profitabilityRate >= 0 ? "text-green-600" : "text-red-600",
      bgColor: profitabilityRate >= 0 ? "bg-green-50" : "bg-red-50",
      borderColor: profitabilityRate >= 0 ? "border-green-200" : "border-red-200",
      tooltip: "Porcentaje de rentabilidad neta sobre ingresos brutos. Indica la eficiencia fiscal de la inversión inmobiliaria."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className={`${metric.bgColor} ${metric.borderColor} border-2`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              {metric.title}
            </CardTitle>
            <div className="flex items-center gap-1">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>{metric.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FiscalMetricsCards;
