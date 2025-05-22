
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExpenseItemProps {
  id: string;
  name: string;
  value: number;
  isPaid: boolean;
  category?: string;
  simplified?: boolean;
  isStatic?: boolean;
  onTogglePaid?: (id: string, isPaid: boolean) => void;
  onDeleteExpense?: (id: string) => void;
}

export const ExpenseItem = ({
  id,
  name,
  value,
  isPaid,
  category,
  simplified = false,
  isStatic = false,
  onTogglePaid,
  onDeleteExpense
}: ExpenseItemProps) => {
  const handleToggle = () => {
    if (onTogglePaid) {
      onTogglePaid(id, isPaid);
    }
  };

  const handleDelete = () => {
    if (onDeleteExpense && !isStatic) {
      onDeleteExpense(id);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded-md",
        isPaid ? "bg-muted/40" : "bg-muted/10",
        simplified ? "text-sm" : ""
      )}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className={cn(
            "font-medium", 
            isPaid ? "text-muted-foreground line-through" : ""
          )}>
            {name}
          </span>
        </div>
        {!simplified && category && <span className="text-xs text-muted-foreground capitalize">{category}</span>}
      </div>
      <div className="flex items-center space-x-2">
        <span className={cn(
          "text-sm font-medium", 
          isPaid ? "text-muted-foreground line-through" : ""
        )}>
          {value.toFixed(0)}€
        </span>
        
        <div className="flex items-center">
          {onTogglePaid && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleToggle}
            >
              <Check className={cn("h-4 w-4", isPaid ? "opacity-100" : "opacity-20")} />
              <span className="sr-only">{isPaid ? "Marcar como no pagado" : "Marcar como pagado"}</span>
            </Button>
          )}
          
          {onDeleteExpense && !isStatic && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Eliminar gasto</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
