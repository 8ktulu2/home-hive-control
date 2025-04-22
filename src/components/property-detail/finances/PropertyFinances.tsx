
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { ExpenseList } from './ExpenseList';
import { AddExpenseDialog } from './AddExpenseDialog';
import KPIBar from './KPIBar';

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

  // Valores seguros para evitar errores si property no tiene ciertos campos:
  const rent = property.rent || 0;
  const expenses = property.expenses || 0;
  const netIncome = property.netIncome || (rent - expenses);

  return (
    <div className="w-full">
      <KPIBar 
        rent={rent}
        expenses={expenses}
        netIncome={netIncome}
        onExpensesClick={() => setShowExpenses((v) => !v)}
      />
      {showExpenses && (
        <div className="animate-fade-in">
          <ExpenseList 
            property={property} 
            onExpenseUpdate={onExpenseUpdate} 
            onlyDetails // nuevo prop (abajo lo documentamos)
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

