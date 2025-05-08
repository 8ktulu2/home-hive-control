
import React, { useState } from 'react';
import { Property, MonthlyExpense } from '@/types/property';
import { ExpenseList } from './expense-components/ExpenseList';
import { AddExpenseDialog } from './AddExpenseDialog';
import KPIBar from './KPIBar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyFinancesProps {
  property: Property;
  onExpenseAdd?: (expense: Partial<MonthlyExpense>) => void;
  onExpenseUpdate?: (expenseId: string, updates: Partial<MonthlyExpense>) => void;
}

const PropertyFinances: React.FC<PropertyFinancesProps> = ({ 
  property, 
  onExpenseAdd, 
  onExpenseUpdate 
}) => {
  const [showExpenses, setShowExpenses] = useState(false);

  // Get unpaid expenses
  const unpaidExpenses = property.monthlyExpenses?.filter(expense => !expense.isPaid) || [];

  // Valores seguros para evitar errores si property no tiene ciertos campos
  const rent = property.rent || 0;
  const expenses = property.expenses || 0;
  const netIncome = property.netIncome || (rent - expenses);

  const handleMarkAsPaid = (expenseId: string) => {
    if (onExpenseUpdate) {
      onExpenseUpdate(expenseId, { isPaid: true, paymentDate: new Date().toISOString() });
    }
  };

  return (
    <div className="w-full space-y-4">
      <KPIBar 
        rent={rent}
        expenses={expenses}
        netIncome={netIncome}
        onExpensesClick={() => setShowExpenses((v) => !v)}
        showExpenses={showExpenses}
      />

      {/* Expanded Expenses Section */}
      {showExpenses && (
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-sm">Desglose de Gastos</CardTitle>
            <div className="flex items-center gap-2">
              <AddExpenseDialog onExpenseAdd={onExpenseAdd} />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowExpenses(false)}
                className="h-8 w-8 p-0"
              >
                <ChevronUp className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ExpenseList 
              property={property} 
              onExpenseUpdate={onExpenseUpdate}
              simplified={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Unpaid Expenses Section */}
      {unpaidExpenses.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-sm text-destructive">Gastos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unpaidExpenses.map((expense) => (
                <div 
                  key={expense.id}
                  className="flex items-center justify-between p-2 bg-background/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{expense.name}</p>
                    <p className="text-sm text-muted-foreground">{expense.amount.toFixed(0)}€</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleMarkAsPaid(expense.id)}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Marcar como pagado</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyFinances;
