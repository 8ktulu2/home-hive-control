
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FiscalSectionProps } from './types';

interface SummaryProps extends FiscalSectionProps {
  reduction: number;
}

export const FiscalSummarySection: React.FC<SummaryProps> = ({ form, reduction }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Resumen fiscal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total ingresos</p>
            <p className="text-lg font-semibold">
              {(form.watch('totalIncome') || 0).toFixed(2)}€
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total gastos</p>
            <p className="text-lg font-semibold">
              {(form.watch('totalExpenses') || 0).toFixed(2)}€
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rendimiento neto</p>
            <p className="text-lg font-semibold">
              {(form.watch('netIncome') || 0).toFixed(2)}€
            </p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="bg-[#2a2f3f] p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Rendimiento neto reducido (a declarar)</p>
              <p className="text-xl font-semibold">
                {(form.watch('reducedNetProfit') || 0).toFixed(2)}€
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Reducción aplicada ({reduction}%)</p>
              <p className="text-lg font-semibold">
                {form.watch('netIncome') > 0 ? 
                  ((form.watch('netIncome') || 0) * (reduction / 100)).toFixed(2) : 
                  "0.00"}€
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
