
import React from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/hooks/useFiscalCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, Percent, HelpCircle } from 'lucide-react';

interface FiscalPropertySummaryProps {
  properties: Property[];
  selectedYear: number;
  selectedPropertyId: string;
  setSelectedPropertyId: (id: string) => void;
  fiscalData: FiscalData;
}

const FiscalPropertySummary: React.FC<FiscalPropertySummaryProps> = ({
  properties,
  selectedYear,
  selectedPropertyId,
  setSelectedPropertyId,
  fiscalData
}) => {
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
      title: "Ingresos",
      value: formatCurrency(fiscalData.grossIncome),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      tooltip: "Total de rentas percibidas por arrendamiento durante el ejercicio fiscal."
    },
    {
      title: "Gastos",
      value: formatCurrency(fiscalData.deductibleExpenses),
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      tooltip: "Gastos deducibles según art. 23 LIRPF: IBI, comunidad, seguros, reparaciones, amortización."
    },
    {
      title: "Neto",
      value: formatCurrency(fiscalData.netProfit),
      icon: DollarSign,
      color: fiscalData.netProfit >= 0 ? "text-blue-600" : "text-red-600",
      bgColor: fiscalData.netProfit >= 0 ? "bg-blue-50" : "bg-red-50",
      borderColor: fiscalData.netProfit >= 0 ? "border-blue-200" : "border-red-200",
      tooltip: "Resultado de restar gastos deducibles de los ingresos brutos."
    },
    {
      title: "Rentabilidad",
      value: formatPercentage(profitabilityRate),
      icon: Percent,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      tooltip: "Porcentaje de rentabilidad neta sobre ingresos brutos."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Property and Year Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Propiedad:
          </label>
          <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las propiedades</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric, index) => (
          <Card key={index} className={`${metric.bgColor} ${metric.borderColor} border-2`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {metric.title}
              </CardTitle>
              <div className="flex items-center gap-1">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <HelpCircle className="h-3 w-3 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-xs">{metric.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-xl lg:text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Details Table */}
      {selectedPropertyId === 'all' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalle por Propiedad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Propiedad</th>
                    <th className="text-right p-2">Ingresos</th>
                    <th className="text-right p-2">Gastos</th>
                    <th className="text-right p-2">Neto</th>
                  </tr>
                </thead>
                <tbody>
                  {fiscalData.propertyDetails.map((detail) => (
                    <tr key={detail.id} className="border-b">
                      <td className="p-2 font-medium">{detail.name}</td>
                      <td className="p-2 text-right text-green-600">
                        {formatCurrency(detail.grossIncome)}
                      </td>
                      <td className="p-2 text-right text-red-600">
                        {formatCurrency(detail.expenses)}
                      </td>
                      <td className={`p-2 text-right font-medium ${
                        detail.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(detail.netProfit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FiscalPropertySummary;
