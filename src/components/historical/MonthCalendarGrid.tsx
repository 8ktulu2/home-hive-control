
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { HistoricalRecord } from '@/hooks/useHistoricalStorage';

interface MonthCalendarGridProps {
  selectedYear: string;
  monthlyRecords: { [month: number]: HistoricalRecord };
  expandedMonth: number | null;
  onMonthClick: (month: number) => void;
  onToggleExpanded: (month: number) => void;
  formatCurrency: (amount: number) => string;
  isCalendarEnabled: boolean;
}

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const categories = [
  { key: 'alquiler', label: 'Alquiler', icon: '🏠' },
  { key: 'hipoteca', label: 'Hipoteca', icon: '🏦' },
  { key: 'comunidad', label: 'Comunidad', icon: '🏢' },
  { key: 'ibi', label: 'IBI', icon: '📄' },
  { key: 'seguroVida', label: 'Seguro de Vida', icon: '💼' },
  { key: 'seguroHogar', label: 'Seguro de Hogar', icon: '🛡️' },
  { key: 'compras', label: 'Compras', icon: '🛒' },
  { key: 'averias', label: 'Averías', icon: '🔧' },
  { key: 'suministros', label: 'Suministros', icon: '⚡' }
];

const MonthCalendarGrid: React.FC<MonthCalendarGridProps> = ({
  selectedYear,
  monthlyRecords,
  expandedMonth,
  onMonthClick,
  onToggleExpanded,
  formatCurrency,
  isCalendarEnabled
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendario {selectedYear}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Haz clic en un mes para aplicar los valores introducidos
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {months.map((monthName, index) => {
            const record = monthlyRecords[index];
            const hasData = !!record;

            return (
              <div key={index} className="space-y-1">
                <Button
                  variant="outline"
                  onClick={() => onMonthClick(index)}
                  disabled={!isCalendarEnabled}
                  className={`h-auto p-3 flex flex-col items-center gap-2 w-full transition-all hover:scale-105 ${
                    hasData ? 'bg-green-50 border-green-300 hover:bg-green-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium text-sm">📆 {monthName}</span>
                  {hasData ? (
                    <div className="w-full space-y-1 text-xs">
                      <div className="text-green-600">
                        📈 Ingresos: +{formatCurrency(record.ingresos)}€
                      </div>
                      <div className="text-red-600">
                        📉 Gastos: -{formatCurrency(record.gastos)}€
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 w-full text-center">
                      Haz clic para guardar datos
                    </div>
                  )}
                </Button>
                
                {hasData && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleExpanded(index)}
                    className="w-full text-xs p-1 h-7"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    {expandedMonth === index ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                  </Button>
                )}

                {expandedMonth === index && hasData && (
                  <div className="p-2 bg-gray-50 rounded-md space-y-1 text-xs">
                    {categories.map(category => {
                      const value = record.categorias[category.key as keyof typeof record.categorias];
                      if (value > 0) {
                        return (
                          <div key={category.key} className="flex justify-between">
                            <span>{category.icon} {category.label}:</span>
                            <span>{formatCurrency(value)}€</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthCalendarGrid;
