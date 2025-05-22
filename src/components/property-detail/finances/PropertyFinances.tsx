
import React from 'react';
import { Property, MonthlyExpense } from '@/types/property';
import { ExpenseList } from './expense-components/ExpenseList';
import { AddExpenseDialog } from './AddExpenseDialog';
import KPIBar from './KPIBar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PropertyFinancesProps {
  property: Property;
  onExpenseAdd?: (expense: Partial<MonthlyExpense>) => void;
  onExpenseUpdate?: (expenseId: string, updates: Partial<MonthlyExpense>) => void;
  onExpenseDelete?: (expenseId: string) => void;
  showExpenses?: boolean;
  setShowExpenses?: (show: boolean) => void;
}

const PropertyFinances: React.FC<PropertyFinancesProps> = ({ 
  property, 
  onExpenseAdd, 
  onExpenseUpdate,
  onExpenseDelete,
  showExpenses = false,
  setShowExpenses
}) => {
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
      <Collapsible>
        <div className="flex items-center justify-between">
          <KPIBar 
            rent={rent}
            expenses={expenses}
            netIncome={netIncome}
          />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronUp className="h-4 w-4" />
              <span className="sr-only">Mostrar/Ocultar Gastos</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-4">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm">Desglose de Gastos</CardTitle>
              <AddExpenseDialog onExpenseAdd={onExpenseAdd} />
            </CardHeader>
            <CardContent className="pt-0">
              <ExpenseList 
                property={property} 
                onExpenseUpdate={onExpenseUpdate}
                onExpenseDelete={onExpenseDelete}
                simplified={true}
              />
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

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
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 mr-1"
                      onClick={() => handleMarkAsPaid(expense.id)}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Marcar como pagado</span>
                    </Button>
                    {onExpenseDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => onExpenseDelete(expense.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        <span className="sr-only">Eliminar gasto</span>
                      </Button>
                    )}
                  </div>
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
