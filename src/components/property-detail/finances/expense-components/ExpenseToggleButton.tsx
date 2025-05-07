
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ExpenseToggleButtonProps {
  showAllExpenses: boolean;
  setShowAllExpenses: (show: boolean) => void;
  expenseCount: number;
}

export const ExpenseToggleButton: React.FC<ExpenseToggleButtonProps> = ({ 
  showAllExpenses, 
  setShowAllExpenses,
  expenseCount
}) => {
  return (
    <Button
      variant="ghost"
      className="w-full text-muted-foreground"
      onClick={() => setShowAllExpenses(!showAllExpenses)}
    >
      {showAllExpenses ? (
        <span className="flex items-center">Mostrar menos <ArrowUp className="ml-2 h-4 w-4" /></span>
      ) : (
        <span className="flex items-center">Mostrar todos ({expenseCount}) <ArrowDown className="ml-2 h-4 w-4" /></span>
      )}
    </Button>
  );
};
