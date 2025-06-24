
import React from 'react';
import { Property } from '@/types/property';
import PropertyDetailContent from '../PropertyDetailContent';
import HistoricalHeader from './HistoricalHeader';
import PropertyDetailHeader from '../PropertyDetailHeader';
import { useHistoricalPropertyState } from './hooks/useHistoricalPropertyState';
import { useHistoricalHandlers } from './hooks/useHistoricalHandlers';

interface HistoricalPropertyViewProps {
  property: Property;
  year: number;
  onBack: () => void;
}

const HistoricalPropertyView: React.FC<HistoricalPropertyViewProps> = ({ 
  property, 
  year, 
  onBack 
}) => {
  const { historicalProperty, setHistoricalProperty } = useHistoricalPropertyState(property, year);
  
  const {
    handleHistoricalPaymentUpdate,
    handleHistoricalInventoryAdd,
    handleHistoricalInventoryEdit,
    handleHistoricalInventoryDelete,
    handleHistoricalTaskAdd,
    handleHistoricalTaskToggle,
    handleHistoricalTaskDelete,
    handleHistoricalTaskUpdate,
    handleHistoricalDocumentAdd,
    handleHistoricalDocumentDelete,
    handleHistoricalExpenseDelete,
    handleRentPaidChange
  } = useHistoricalHandlers(property, year, historicalProperty, setHistoricalProperty);

  if (!historicalProperty) {
    return <div>Cargando datos históricos...</div>;
  }

  return (
    <div 
      className="min-h-screen font-serif" 
      style={{ 
        background: 'linear-gradient(to bottom, #fefce8, #fef3c7)',
      }}
    >
      <div className="max-w-7xl mx-auto p-4">
        <HistoricalHeader 
          property={property}
          year={year}
          onBack={onBack}
        />

        <div className="space-y-2">
          <PropertyDetailHeader 
            property={historicalProperty}
            onRentPaidChange={handleRentPaidChange}
            historicalYear={year}
          />
          
          <PropertyDetailContent
            property={historicalProperty}
            onRentPaidChange={handleRentPaidChange}
            onPaymentUpdate={handleHistoricalPaymentUpdate}
            handleTaskToggle={handleHistoricalTaskToggle}
            handleTaskAdd={handleHistoricalTaskAdd}
            handleTaskDelete={handleHistoricalTaskDelete}
            handleTaskUpdate={handleHistoricalTaskUpdate}
            handleDocumentDelete={handleHistoricalDocumentDelete}
            handleDocumentAdd={handleHistoricalDocumentAdd}
            handleExpenseDelete={handleHistoricalExpenseDelete}
            setProperty={setHistoricalProperty}
            onInventoryAdd={handleHistoricalInventoryAdd}
            onInventoryEdit={handleHistoricalInventoryEdit}
            onInventoryDelete={handleHistoricalInventoryDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoricalPropertyView;
