
import React from 'react';
import { ExpenseItem } from './ExpenseItem';
import { ExpenseTotal } from './ExpenseTotal';

interface ExpenseItem {
  id: string;
  name: string;
  value: number;
  isPaid: boolean;
  category: string;
  date: string;
  paymentDate?: string;
}

interface ExpenseListContentProps {
  expenses: ExpenseItem[];
  onTogglePaid: (id: string, isPaid: boolean) => void;
}

export const ExpenseListContent = ({ expenses, onTogglePaid }: ExpenseListContentProps) => {
  const totalExpenses = expenses
    .filter(expense => !expense.isPaid)
    .reduce((sum, expense) => sum + expense.value, 0);

  const totalPaidExpenses = expenses
    .filter(expense => expense.isPaid)
    .reduce((sum, expense) => sum + expense.value, 0);

  return (
    <div className="rounded-lg p-4 border border-destructive/30 bg-destructive/5">
      <h4 className="text-xs font-medium mb-2">Desglose de gastos</h4>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            {...expense}
            onTogglePaid={onTogglePaid}
          />
        ))}
        <ExpenseTotal
          totalExpenses={totalExpenses}
          totalPaidExpenses={totalPaidExpenses}
        />
      </div>
    </div>
  );
};
