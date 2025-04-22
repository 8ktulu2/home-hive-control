
import React from 'react';
import { Property } from '@/types/property';
import { ExpenseList } from './ExpenseList';
import { AddExpenseDialog } from './AddExpenseDialog';

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
  return (
    <div className="space-y-4">
      <ExpenseList 
        property={property} 
        onExpenseUpdate={onExpenseUpdate} 
      />
      <div className="flex justify-end">
        <AddExpenseDialog onExpenseAdd={onExpenseAdd} />
      </div>
    </div>
  );
};

export default PropertyFinances;
