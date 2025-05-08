import React from 'react';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { ExpenseList } from './expense-components/ExpenseList';
import { AddExpenseDialog } from './AddExpenseDialog';

interface CombinedFinancesTabProps {
  property: Property;
}

const CombinedFinancesTab: React.FC<CombinedFinancesTabProps> = ({ property }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Gastos</h3>
          <AddExpenseDialog />
        </div>
        <ExpenseList property={property} />
      </CardContent>
    </Card>
  );
};

export default CombinedFinancesTab;
