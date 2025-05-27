
import React from 'react';
import { HistoricalEntry } from '@/types/historical';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthCalendarGridProps {
  year: number;
  onMonthClick: (month: number) => void;
  getMonthStatus: (month: number) => 'empty' | 'hasData';
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
    
    return { totalIncome, totalExpenses, count: data.length };
  };

  return (
    <div className="space-y-4">
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
                  "bg-blue-50 border-blue-300 hover:bg-blue-100": hasData,
                  "hover:bg-gray-50": !hasData && !isDisabled,
                  "opacity-50 cursor-not-allowed": isDisabled
                }
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-sm">{monthName}</span>
                {hasData && <Check className="h-4 w-4 text-green-600" />}
                {isDisabled && <AlertTriangle className="h-3 w-3 text-gray-400" />}
              </div>
              
              {hasData && (
                <div className="w-full space-y-2">
                  {summary.totalIncome > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">Ingresos</span>
                      </div>
                      <span className="font-medium text-green-600">
                        +{formatCurrency(summary.totalIncome)}
                      </span>
                    </div>
                  )}
                  
                  {summary.totalExpenses > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-red-600" />
                        <span className="text-red-600">Gastos</span>
                      </div>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(summary.totalExpenses)}
                      </span>
                    </div>
                  )}
                  
                  <div className="pt-1 border-t">
                    <Badge variant="secondary" className="text-xs w-full justify-center">
                      {summary.count} registros
                    </Badge>
                  </div>
                </div>
              )}
              
              {!hasData && !isDisabled && (
                <div className="text-xs text-gray-500 w-full text-center">
                  Clic para guardar datos
                </div>
              )}
              
              {isDisabled && (
                <div className="text-xs text-gray-400 w-full text-center">
                  Selecciona propiedad
                </div>
              )}
            </Button>
          );
        })}
      </div>
      
      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 text-sm pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border rounded"></div>
          <span>Sin datos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span>Con datos históricos</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>Mes guardado</span>
        </div>
      </div>
    </div>
  );
};

export default MonthCalendarGrid;
