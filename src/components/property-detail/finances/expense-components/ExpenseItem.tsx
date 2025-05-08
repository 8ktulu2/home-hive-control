
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ExpenseItemProps {
  id: string;
  name: string;
  value: number;
  isPaid: boolean;
  simplified?: boolean;
  isStatic?: boolean;
  onTogglePaid: (id: string, isPaid: boolean) => void;
  onDeleteExpense?: (id: string) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  id,
  name,
  value,
  isPaid,
  simplified = false,
  isStatic = false,
  onTogglePaid,
  onDeleteExpense,
}) => {
  return (
    <div className={cn(
      "flex items-center justify-between p-2 rounded-md",
      isPaid ? "bg-muted/50" : "bg-muted/30",
    )}>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-3 h-3 rounded-full flex-shrink-0",
            isPaid ? "bg-green-500" : "bg-red-500"
          )}
        />
        <div>
          <div className="font-medium">{name}</div>
          {!simplified && (
            <div className="text-xs text-muted-foreground">
              {isPaid ? "Pagado" : "Pendiente"}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={cn(
          "text-sm font-medium",
          isPaid ? "text-muted-foreground" : "text-foreground"
        )}>
          {value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </div>

        <div className="flex items-center">
          <Button
            onClick={() => onTogglePaid(id, isPaid)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title={isPaid ? "Marcar como no pagado" : "Marcar como pagado"}
          >
            <Check className={cn(
              "h-4 w-4",
              isPaid ? "text-green-500" : "text-muted-foreground"
            )} />
            <span className="sr-only">
              {isPaid ? "Marcar como no pagado" : "Marcar como pagado"}
            </span>
          </Button>

          {/* Delete button for non-static expenses that are paid */}
          {!isStatic && isPaid && onDeleteExpense && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  title="Eliminar gasto"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar gasto</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar este gasto?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El gasto "{name}" será eliminado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDeleteExpense(id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};
