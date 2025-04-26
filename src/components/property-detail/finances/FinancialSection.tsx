
import React from 'react';
import { Property } from '@/types/property';
import PropertyFinances from './PropertyFinances';
import { useExpenseManagement } from '@/hooks/useExpenseManagement';

interface FinancialSectionProps {
  property: Property;
  setProperty: (property: Property) => void;
}

const FinancialSection = ({ property, setProperty }: FinancialSectionProps) => {
  const { handleExpenseAdd, handleExpenseUpdate } = useExpenseManagement(property, setProperty);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PropertyFinances 
        property={property} 
        onExpenseAdd={handleExpenseAdd} 
        onExpenseUpdate={handleExpenseUpdate} 
      />
    </div>
  );
};

export default FinancialSection;
