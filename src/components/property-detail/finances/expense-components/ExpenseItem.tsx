
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpenseItemProps {
  id: string;
  name: string;
  value: number;
  isPaid: boolean;
  simplified?: boolean;
  onTogglePaid?: (id: string, isPaid: boolean) => void;
  isStatic?: boolean;
  paymentDate?: string;
}

export const ExpenseItem = ({ 
  id, 
  name, 
  value, 
  isPaid, 
  simplified = false,
  onTogglePaid,
  isStatic = false,
  paymentDate
}: ExpenseItemProps) => {
  const handleTogglePaid = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTogglePaid) {
      onTogglePaid(id, isPaid);
    }
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-between p-3 rounded-lg",
        isPaid ? "bg-muted/50" : "bg-muted/80"
      )}
    >
      <div className="flex items-center space-x-3">
        <div>
          <p className={cn(
            "font-medium", 
            isPaid ? "text-muted-foreground" : ""
          )}>
            {name}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className={cn(
          "text-lg font-semibold",
          isPaid ? "text-muted-foreground" : ""
        )}>
          {value.toFixed(2)}€
        </span>
        {!isStatic && !simplified && onTogglePaid && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTogglePaid}
            className={cn(
              "h-8 w-8",
              !isPaid ? "text-green-500 hover:text-green-700 hover:bg-green-100" : "text-red-500 hover:text-red-700 hover:bg-red-100"
            )}
          >
            {!isPaid ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        )}
      </div>
    </div>
  );
};
