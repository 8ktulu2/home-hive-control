
import { useState } from 'react';
import { MonthlyExpense } from '@/types/property';

export const useExpenseDialog = () => {
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<MonthlyExpense>>({
    name: '',
    amount: 0,
    isPaid: false,
    category: 'suministros',
  });

  const resetExpenseForm = () => {
    setNewExpense({
      name: '',
      amount: 0,
      isPaid: false,
      category: 'suministros',
    });
  };

  return {
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    newExpense,
    setNewExpense,
    resetExpenseForm,
  };
};
