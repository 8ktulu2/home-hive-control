
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Calendar } from 'lucide-react';
import { getCategoryBadge } from '../ExpenseCategories';

interface ExpenseItemProps {
  id: string;
  name: string;
  value: number;
  isPaid: boolean;
  category: string;
  date?: string;
  paymentDate?: string;
  onTogglePaid: (id: string, isPaid: boolean) => void;
}

export const ExpenseItem = ({ 
  id, 
  name, 
  value, 
  isPaid, 
  category,
  date,
  paymentDate,
  onTogglePaid 
}: ExpenseItemProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '---';
    try {
      return new Intl.DateTimeFormat('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }).format(new Date(dateString));
    } catch (e) {
      return '---';
    }
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-destructive/10 rounded-md">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 rounded-full ${isPaid ? 'text-success' : 'text-muted-foreground'}`}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePaid(id, isPaid);
          }}
          title={isPaid ? 'Marcar como no pagado' : 'Marcar como pagado'}
        >
          <Check className="h-4 w-4" />
        </Button>
        <div className="flex flex-col">
          <span className={`text-sm ${isPaid ? 'line-through text-muted-foreground' : 'font-medium'}`}>
            {name}
          </span>
          <div className="mt-0.5">
            {getCategoryBadge(category)}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`text-sm font-medium ${isPaid ? 'text-muted-foreground line-through' : 'text-destructive'}`}>
          {value.toFixed(0)}€/mes
        </span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span title="Fecha de creación">{formatDate(date)}</span>
          </div>
          {isPaid && (
            <div className="flex items-center">
              <Check className="h-3 w-3 mr-1 text-success" />
              <span title="Fecha de pago">{formatDate(paymentDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
