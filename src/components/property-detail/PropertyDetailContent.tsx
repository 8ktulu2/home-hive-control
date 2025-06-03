
import { Property } from '@/types/property';
import MonthlyPaymentStatus from '@/components/properties/MonthlyPaymentStatus';
import MainContent from './MainContent';
import SecondaryContent from './SecondaryContent';
import HistoricalSection from './historical/HistoricalSection';
import HistoricalPropertyView from './historical/HistoricalPropertyView';
import { useState } from 'react';

interface PropertyDetailContentProps {
  property: Property;
  onRentPaidChange: (paid: boolean) => void;
  onPaymentUpdate: (month: number, year: number, isPaid: boolean, notes?: string) => void;
  handleTaskToggle: (taskId: string, completed: boolean) => void;
  handleTaskAdd: (task: { title: string; description?: string }) => void;
  handleTaskDelete: (taskId: string) => void;
  handleTaskUpdate: (taskId: string, updates: any) => void;
  handleDocumentDelete: (documentId: string) => void;
  handleDocumentAdd: (document: any) => void;
  handleExpenseDelete?: (expenseId: string) => void;
  setProperty: (property: Property | null) => void;
}

const PropertyDetailContent = ({
  property,
  onRentPaidChange,
  onPaymentUpdate,
  handleTaskToggle,
  handleTaskAdd,
  handleTaskDelete,
  handleTaskUpdate,
  handleDocumentDelete,
  handleDocumentAdd,
  handleExpenseDelete,
  setProperty
}: PropertyDetailContentProps) => {
  const [selectedHistoricalYear, setSelectedHistoricalYear] = useState<number | null>(null);

  const handleYearSelect = (year: number) => {
    setSelectedHistoricalYear(year);
  };

  const handleBackToCurrentYear = () => {
    setSelectedHistoricalYear(null);
  };

  // If historical year is selected, show historical view
  if (selectedHistoricalYear) {
    return (
      <HistoricalPropertyView 
        property={property}
        year={selectedHistoricalYear}
        onBack={handleBackToCurrentYear}
      />
    );
  }

  // Current year view
  return (
    <div className="space-y-6">
      <HistoricalSection 
        property={property} 
        onYearSelect={handleYearSelect}
      />

      <div className="pb-1">
        <MonthlyPaymentStatus 
          property={property}
          onPaymentUpdate={onPaymentUpdate}
          compact={true}
        />
      </div>

      <MainContent 
        property={property} 
        setProperty={setProperty}
        handleExpenseDelete={handleExpenseDelete}
      />

      <SecondaryContent
        property={property}
        onTaskToggle={handleTaskToggle}
        onTaskAdd={handleTaskAdd}
        onTaskDelete={handleTaskDelete}
        onTaskUpdate={handleTaskUpdate}
        onDocumentDelete={handleDocumentDelete}
        onDocumentAdd={handleDocumentAdd}
      />
    </div>
  );
};

export default PropertyDetailContent;
