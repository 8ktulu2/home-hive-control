
import React, { useState } from 'react';
import { Property } from '@/types/property';
import PropertyFinances from './PropertyFinances';
import { useExpenseManagement } from '@/hooks/useExpenseManagement';

interface FinancialSectionProps {
  property: Property;
  setProperty: (property: Property) => void;
  handleExpenseDelete?: (expenseId: string) => void;
}

const FinancialSection = ({ property, setProperty, handleExpenseDelete }: FinancialSectionProps) => {
  const { handleExpenseAdd, handleExpenseUpdate } = useExpenseManagement(property, setProperty);
  const [showExpenses, setShowExpenses] = useState(false);

  return (
    <div className="col-span-2">
      <PropertyFinances 
        property={property} 
        onExpenseAdd={handleExpenseAdd} 
        onExpenseUpdate={handleExpenseUpdate}
        onExpenseDelete={handleExpenseDelete}
        showExpenses={showExpenses}
        setShowExpenses={setShowExpenses}
      />
    </div>
  );
};

export default FinancialSection;
