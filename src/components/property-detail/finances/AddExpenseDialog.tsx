
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { MonthlyExpense } from '@/types/property';
import { expenseCategories } from './ExpenseCategories';
import { useExpenseDialog } from '@/hooks/useExpenseDialog';

interface AddExpenseDialogProps {
  onExpenseAdd?: (expense: Partial<MonthlyExpense>) => void;
}

export const AddExpenseDialog = ({ onExpenseAdd }: AddExpenseDialogProps) => {
  const {
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    newExpense,
    setNewExpense,
    resetExpenseForm
  } = useExpenseDialog();

  const handleAddExpense = () => {
    if (onExpenseAdd && newExpense.name && newExpense.amount) {
      onExpenseAdd({
        ...newExpense,
        paymentDate: newExpense.isPaid ? new Date().toISOString() : undefined
      });
      setIsExpenseDialogOpen(false);
      resetExpenseForm();
    }
  };

  return (
    <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Añadir Gasto</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Gasto</DialogTitle>
          <DialogDescription>
            Introduce los detalles del gasto.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expense-name" className="text-right">
              Concepto
            </Label>
            <Input
              id="expense-name"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              className="col-span-3"
              placeholder="Ej: Factura de luz"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expense-amount" className="text-right">
              Importe
            </Label>
            <Input
              id="expense-amount"
              type="number"
              value={newExpense.amount?.toString()}
              onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expense-category" className="text-right">
              Categoría
            </Label>
            <Select 
              value={newExpense.category}
              onValueChange={(value: any) => 
                setNewExpense({ ...newExpense, category: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right">
              <Label htmlFor="expense-paid" className="text-right">
                Pagado
              </Label>
            </div>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox 
                id="expense-paid" 
                checked={newExpense.isPaid}
                onCheckedChange={(checked) => setNewExpense({ ...newExpense, isPaid: Boolean(checked) })}
              />
              <label
                htmlFor="expense-paid"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Marcar como pagado
              </label>
            </div>
          </div>
          
          {newExpense.isPaid && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right flex items-center justify-end">
                <Calendar className="h-4 w-4 mr-2" />
                <Label htmlFor="payment-date">
                  Fecha de pago
                </Label>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-muted-foreground">
                  Se registrará la fecha actual como fecha de pago
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddExpense}>
            Añadir Gasto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
