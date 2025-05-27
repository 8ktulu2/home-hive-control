
import React from 'react';
import { HistoricalEntry } from '@/types/historical';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Edit3, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthCalendarGridProps {
  year: number;
  onMonthClick: (month: number) => void;
  getMonthStatus: (month: number) => 'empty' | 'hasData' | 'selected';
  getMonthData: (month: number) => HistoricalEntry[];
  formatCurrency: (amount: number) => string;
  selectedProperty: string;
}

const MonthCalendarGrid: React.FC<MonthCalendarGridProps> = ({
  year,
  onMonthClick,
  getMonthStatus,
  getMonthData,
  formatCurrency,
  selectedProperty
}) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getMonthSummary = (month: number) => {
    const data = getMonthData(month);
    const totalIncome = data
      .filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);
    const totalExpenses = data
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);
    
    return { totalIncome, totalExpenses, total: totalIncome + totalExpenses, count: data.length };
  };

  const getStatusIcon = (status: string, hasData: boolean) => {
    if (hasData) return <Check className="h-4 w-4 text-green-600" />;
    if (status === 'selected') return <Edit3 className="h-4 w-4 text-blue-600" />;
    return null;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {months.map((monthName, index) => {
        const status = getMonthStatus(index);
        const hasData = status === 'hasData';
        const summary = getMonthSummary(index);
        const isDisabled = !selectedProperty;

        return (
          <Button
            key={index}
            variant="outline"
            onClick={() => !isDisabled && onMonthClick(index)}
            disabled={isDisabled}
            className={cn(
              "h-auto p-4 flex flex-col items-start gap-2 transition-all hover:scale-105",
              {
                "bg-blue-50 border-blue-300": hasData,
                "bg-green-50 border-green-300": status === 'selected',
                "hover:bg-gray-50": !hasData && !isDisabled,
                "opacity-50 cursor-not-allowed": isDisabled
              }
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-sm">{monthName}</span>
              {getStatusIcon(status, hasData)}
            </div>
            
            {hasData && (
              <div className="w-full space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">Ingresos:</span>
                  <span className="font-medium">{formatCurrency(summary.totalIncome)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">Gastos:</span>
                  <span className="font-medium">{formatCurrency(summary.totalExpenses)}</span>
                </div>
                <div className="pt-1 border-t">
                  <Badge variant="secondary" className="text-xs">
                    {summary.count} registros
                  </Badge>
                </div>
              </div>
            )}
            
            {!hasData && !isDisabled && (
              <div className="text-xs text-gray-500 w-full text-center">
                Clic para añadir datos
              </div>
            )}
            
            {isDisabled && (
              <div className="text-xs text-gray-400 w-full text-center flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Selecciona propiedad
              </div>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default MonthCalendarGrid;
