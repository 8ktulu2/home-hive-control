
import React, { useState } from 'react';
import { Property, MonthlyExpense } from '@/types/property';
import { ExpenseList } from './ExpenseList';
import { AddExpenseDialog } from './AddExpenseDialog';
import KPIBar from './KPIBar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyFinancesProps {
  property: Property;
  onExpenseAdd?: (expense: Partial<any>) => void;
  onExpenseUpdate?: (expenseId: string, updates: Partial<any>) => void;
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
      />

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

      {/* Complete Expense List */}
      {showExpenses && (
        <div className="animate-fade-in">
          <ExpenseList 
            property={property} 
            onExpenseUpdate={onExpenseUpdate} 
            onlyDetails
          />
          <div className="flex justify-end mt-2">
            <AddExpenseDialog onExpenseAdd={onExpenseAdd} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFinances;
