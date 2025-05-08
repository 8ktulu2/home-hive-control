
import React from 'react';
import { Property } from '@/types/property';
import PropertyInfo from './PropertyInfo';
import FinancialSection from './finances/FinancialSection';

interface MainContentProps {
  property: Property;
  setProperty: (property: Property) => void;
  handleExpenseDelete?: (expenseId: string) => void;
}

const MainContent = ({ property, setProperty, handleExpenseDelete }: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1 lg:col-span-3">
        <PropertyInfo property={property} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <FinancialSection 
          property={property} 
          setProperty={setProperty}
          handleExpenseDelete={handleExpenseDelete}
        />
      </div>
    </div>
  );
};

export default MainContent;
