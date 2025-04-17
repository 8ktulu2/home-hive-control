
import { useState } from 'react';
import { Property, MonthlyExpense } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, TrendingUp, TrendingDown, DollarSign, Plus, Check, Wallet, Calendar, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface PropertyFinancesProps {
  property: Property;
  onExpenseAdd?: (expense: Partial<MonthlyExpense>) => void;
  onExpenseUpdate?: (expenseId: string, updates: Partial<MonthlyExpense>) => void;
}

const PropertyFinances = ({ property, onExpenseAdd, onExpenseUpdate }: PropertyFinancesProps) => {
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
    { id: 'mortgage', name: 'Hipoteca' },
    { id: 'other', name: 'Otros' }
  ];

  // Get monthly expenses for current month
  const currentMonthExpenses = property.monthlyExpenses?.filter(
    expense => expense.month === currentMonth && expense.year === currentYear
  ) || [];

  // Calculate the expense items - start with fixed ones
  const fixedExpenseItems = [
    { id: 'mortgage', name: 'Hipoteca', value: mortgagePayment, isPaid: false, category: 'mortgage' },
    { id: 'ibi', name: 'IBI (anual)', value: ibi / 12, isPaid: false, category: 'taxes' },
    { id: 'community', name: 'Comunidad', value: property.expenses - mortgagePayment - (ibi / 12), isPaid: false, category: 'community' },
  ];

  // Add home insurance if exists
  if (property.homeInsurance?.cost) {
    fixedExpenseItems.push({
      id: 'home-insurance',
      name: 'Seguro de Hogar',
      value: property.homeInsurance.cost / 12,
      isPaid: property.homeInsurance.isPaid || false,
      category: 'insurance'
    });
  }

  // Add life insurance if exists
  if (property.lifeInsurance?.cost) {
    fixedExpenseItems.push({
      id: 'life-insurance',
      name: 'Seguro de Vida',
      value: property.lifeInsurance.cost / 12,
      isPaid: property.lifeInsurance.isPaid || false,
      category: 'insurance'
    });
  }

  // Combine fixed expenses with monthly expenses
  const allExpenses = [
    ...fixedExpenseItems,
    ...currentMonthExpenses.map(expense => ({
      id: expense.id,
      name: expense.name,
      value: expense.amount,
      isPaid: expense.isPaid,
      category: expense.category
    }))
  ];

  // Calculate total expenses - only using the current month's expenses plus fixed costs
  const totalExpensesCalculated = allExpenses.reduce((sum, expense) => sum + expense.value, 0);
  const totalPaidExpenses = allExpenses.filter(expense => expense.isPaid)
    .reduce((sum, expense) => sum + expense.value, 0);
  
  const handleAddExpense = () => {
    if (onExpenseAdd && newExpense.name && newExpense.amount) {
      onExpenseAdd(newExpense);
      toast.success(`Gasto "${newExpense.name}" añadido correctamente`);
      setIsExpenseDialogOpen(false);
      setNewExpense({
        name: '',
        amount: 0,
        isPaid: false,
        category: 'utilities',
      });
    }
  };
  
  const handleToggleExpensePaid = (expenseId: string, isPaid: boolean) => {
    const expense = allExpenses.find(e => e.id === expenseId);
    
    if (expense) {
      // Handle the built-in expense types
      if (expenseId === 'home-insurance') {
        // Update the home insurance isPaid status
        const updatedHomeInsurance = { ...property.homeInsurance, isPaid: !isPaid };
        // Here you'd call a prop method to update the property
        toast.success(`Estado de pago actualizado: ${isPaid ? 'No pagado' : 'Pagado'}`);
        return;
      }
      
      if (expenseId === 'life-insurance') {
        // Update the life insurance isPaid status
        const updatedLifeInsurance = { ...property.lifeInsurance, isPaid: !isPaid };
        // Here you'd call a prop method to update the property
        toast.success(`Estado de pago actualizado: ${isPaid ? 'No pagado' : 'Pagado'}`);
        return;
      }
      
      if (['mortgage', 'ibi', 'community'].includes(expenseId)) {
        // These are fixed expenses that don't have individual records
        toast.success(`Estado de pago actualizado: ${isPaid ? 'No pagado' : 'Pagado'}`);
        return;
      }
      
      // For regular monthly expenses
      if (onExpenseUpdate) {
        onExpenseUpdate(expenseId, { isPaid: !isPaid });
        toast.success(`Estado de pago actualizado: ${isPaid ? 'No pagado' : 'Pagado'}`);
      }
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      utilities: 'bg-blue-100 text-blue-800',
      community: 'bg-green-100 text-green-800',
      taxes: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      insurance: 'bg-purple-100 text-purple-800',
      mortgage: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    
    const categoryName = expenseCategories.find(c => c.id === category)?.name || 'Otro';
    const colorClass = colors[category as keyof typeof colors] || colors.other;
    
    return (
      <Badge variant="outline" className={`text-xs font-normal ${colorClass}`}>
        {categoryName}
      </Badge>
    );
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
            <p className="text-2xl font-bold mt-2">-{totalExpensesCalculated.toFixed(0)}€<span className="text-xs text-muted-foreground ml-1">/mes</span></p>
            <p className="text-xs text-muted-foreground mt-1">Pagados: {totalPaidExpenses.toFixed(0)}€</p>
          </div>

          <div className="bg-secondary/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Beneficio</h3>
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
            <p className={`text-2xl font-bold mt-2 ${monthlyRevenue - totalExpensesCalculated >= 0 ? 'text-success' : 'text-destructive'}`}>
              {(monthlyRevenue - totalExpensesCalculated).toFixed(0)}€<span className="text-xs text-muted-foreground ml-1">/mes</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{(monthlyRevenue - totalExpensesCalculated) * 12}€ al año</p>
          </div>
        </div>

        {/* Desglose de gastos */}
        <div>
          <h3 className="text-sm font-medium mb-3">Desglose de gastos</h3>
          <div className="space-y-2">
            {allExpenses.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 rounded-full ${item.isPaid ? 'text-success' : 'text-muted-foreground'}`}
                    onClick={() => handleToggleExpensePaid(item.id, item.isPaid)}
                    title={item.isPaid ? 'Marcar como no pagado' : 'Marcar como pagado'}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <div className="flex flex-col">
                    <span className={`text-sm ${item.isPaid ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                      {item.name}
                    </span>
                    <div className="mt-0.5">
                      {getCategoryBadge(item.category)}
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-medium ${item.isPaid ? 'text-muted-foreground line-through' : 'text-destructive'}`}>
                  {item.value.toFixed(0)}€/mes
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-2 mt-2">
              <span className="font-medium">Total</span>
              <span className="font-medium text-destructive">{totalExpensesCalculated.toFixed(0)}€/mes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFinances;
