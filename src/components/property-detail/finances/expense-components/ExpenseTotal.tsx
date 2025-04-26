
import React from 'react';

interface ExpenseTotalProps {
  totalExpenses: number;
  totalPaidExpenses: number;
}

export const ExpenseTotal = ({ totalExpenses, totalPaidExpenses }: ExpenseTotalProps) => {
  return (
    <>
      <div className="flex items-center justify-between border-t pt-2 mt-2">
        <span className="font-medium">Total</span>
        <span className="font-medium text-destructive">{totalExpenses.toFixed(0)}€/mes</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Pagados: {totalPaidExpenses.toFixed(0)}€</p>
    </>
  );
};
