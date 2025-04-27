
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowLeftRight, ChartBar, Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/formatters';

interface AnnualSummaryProps {
  totalRent: number;
  totalExpenses: number;
  totalProfit: number;
  occupancyRate: number;
  rentedMonths: number;
  vacantMonths: number;
}

const AnnualSummaryCards = ({
  totalRent,
  totalExpenses,
  totalProfit,
  occupancyRate,
  rentedMonths,
  vacantMonths,
}: AnnualSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-[#292F3F] border-none">
        <CardHeader>
          <CardTitle className="text-white">Resumen Fiscal</CardTitle>
          <CardDescription className="text-[#8E9196]">
            Datos consolidados para la declaración de impuestos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8E9196]">Ingresos Totales</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalRent)}</p>
              </div>
              <ArrowLeftRight className="h-7 w-7 text-[#8B5CF6]" />
            </div>
            <Separator className="bg-[#8E9196]/20" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8E9196]">Gastos Deducibles</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
              </div>
              <ArrowLeftRight className="h-7 w-7 text-[#8B5CF6]" />
            </div>
            <Separator className="bg-[#8E9196]/20" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8E9196]">Rendimiento Neto</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalProfit)}</p>
              </div>
              <ArrowLeftRight className="h-7 w-7 text-[#8B5CF6]" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-[#292F3F] border-none">
        <CardHeader>
          <CardTitle className="text-white">Estadísticas de Ocupación</CardTitle>
          <CardDescription className="text-[#8E9196]">
            Análisis de ocupación anual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8E9196]">Tasa de Ocupación</p>
                <p className="text-2xl font-bold text-white">{occupancyRate.toFixed(1)}%</p>
              </div>
              <ChartBar className="h-7 w-7 text-[#8B5CF6]" />
            </div>
            <Separator className="bg-[#8E9196]/20" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8E9196]">Meses Alquilados</p>
                <p className="text-2xl font-bold text-white">{rentedMonths}</p>
              </div>
              <div className="flex items-center text-green-500">
                <Check className="h-5 w-5 mr-1" />
              </div>
            </div>
            <Separator className="bg-[#8E9196]/20" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8E9196]">Meses Vacíos</p>
                <p className="text-2xl font-bold text-white">{vacantMonths}</p>
              </div>
              <div className="flex items-center text-red-500">
                <X className="h-5 w-5 mr-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnualSummaryCards;
