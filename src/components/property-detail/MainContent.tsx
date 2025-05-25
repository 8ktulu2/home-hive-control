
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import PropertyInfo from './PropertyInfo';
import FinancialSection from './finances/FinancialSection';

interface MainContentProps {
  property: Property;
  setProperty: (property: Property | null) => void;
  handleExpenseDelete?: (expenseId: string) => void;
}

const MainContent = ({ property, setProperty, handleExpenseDelete }: MainContentProps) => {
  const [currentProperty, setCurrentProperty] = useState(property);

  // Update current property when prop changes
  useEffect(() => {
    setCurrentProperty(property);
  }, [property]);

  // Listen for storage events to update in real-time
  useEffect(() => {
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === 'properties' && e.newValue) {
        try {
          const properties = JSON.parse(e.newValue);
          const updatedProperty = properties.find((p: Property) => p.id === property.id);
          if (updatedProperty) {
            setCurrentProperty(updatedProperty);
            setProperty(updatedProperty);
          }
        } catch (error) {
          console.error('Error parsing storage update:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, [property.id, setProperty]);

  const handlePropertyUpdate = (updatedProperty: Property) => {
    setCurrentProperty(updatedProperty);
    setProperty(updatedProperty);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <PropertyInfo 
          property={currentProperty} 
          setProperty={handlePropertyUpdate}
        />
      </div>
      
      <FinancialSection 
        property={currentProperty} 
        setProperty={handlePropertyUpdate}
        handleExpenseDelete={handleExpenseDelete}
      />
    </div>
  );
};

export default MainContent;
