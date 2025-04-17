
import { useState } from 'react';
import { Property, MonthlyExpense } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, TrendingUp, TrendingDown, DollarSign, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Checkbox } from '@/components/ui/checkbox';

interface PropertyFinancesProps {
  property: Property;
}

const PropertyFinances = ({ property }: PropertyFinancesProps) => {
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<MonthlyExpense>>({
    name: '',
    amount: 0,
    isPaid: false,
    category: 'utilities',
  });
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = format(new Date(currentYear, currentMonth), 'MMMM', { locale: es });
  
  // Calculate financial values
  const monthlyRevenue = property.rent;
  const monthlyExpenses = property.expenses;
  const netIncome = property.netIncome;
  const annualIncome = netIncome * 12;
  const ibi = property.ibi || 0;
  const mortgagePayment = property.mortgage?.monthlyPayment || 0;

  // Expense categories
  const expenseCategories = [
    { id: 'utilities', name: 'Suministros' },
    { id: 'community', name: 'Comunidad' },
    { id: 'taxes', name: 'Impuestos' },
    { id: 'maintenance', name: 'Mantenimiento' },
    { id: 'insurance', name: 'Seguros' },
    { id: 'other', name: 'Otros' }
  ];

  // Calculate the expense items
  const expenseItems = [
    { name: 'Hipoteca', value: mortgagePayment },
    { name: 'IBI (anual)', value: ibi / 12 }, // Convertir a mensual para mostrar
    { name: 'Comunidad', value: property.expenses - mortgagePayment - (ibi / 12) },
  ];
  
  const handleAddExpense = () => {
    toast.success(`Gasto "${newExpense.name}" añadido correctamente`);
    setIsExpenseDialogOpen(false);
    setNewExpense({
      name: '',
      amount: 0,
      isPaid: false,
      category: 'utilities',
    });
  };
  
  const handleToggleExpensePaid = (index: number) => {
    toast.success(`Estado de pago actualizado`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          <span>Finanzas {monthName}</span>
        </CardTitle>
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
                Introduce los detalles del gasto para {property.name}.
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
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
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
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tarjetas de resumen financiero */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Ingresos</h3>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold mt-2">{monthlyRevenue}€<span className="text-xs text-muted-foreground ml-1">/mes</span></p>
            <p className="text-xs text-muted-foreground mt-1">{monthlyRevenue * 12}€ al año</p>
          </div>

          <div className="bg-destructive/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Gastos</h3>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <p className="text-2xl font-bold mt-2">-{monthlyExpenses}€<span className="text-xs text-muted-foreground ml-1">/mes</span></p>
            <p className="text-xs text-muted-foreground mt-1">-{monthlyExpenses * 12}€ al año</p>
          </div>

          <div className="bg-secondary/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Beneficio</h3>
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
            <p className={`text-2xl font-bold mt-2 ${netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
              {netIncome}€<span className="text-xs text-muted-foreground ml-1">/mes</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{annualIncome}€ al año</p>
          </div>
        </div>

        {/* Desglose de gastos */}
        <div>
          <h3 className="text-sm font-medium mb-3">Desglose de gastos</h3>
          <div className="space-y-2">
            {expenseItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => handleToggleExpensePaid(index)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-destructive">{item.value.toFixed(0)}€/mes</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-2 mt-2">
              <span className="font-medium">Total</span>
              <span className="font-medium text-destructive">{monthlyExpenses}€/mes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFinances;
