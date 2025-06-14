
import React from 'react';
import Layout from '@/components/layout/Layout';
import PropertyDetailHeader from '@/components/property-detail/PropertyDetailHeader';
import PropertyDetailContent from '@/components/property-detail/PropertyDetailContent';
import HistoricalPropertyLoader from '@/components/historical/HistoricalPropertyLoader';
import HistoricalPropertyErrorState from '@/components/historical/HistoricalPropertyErrorState';
import HistoricalPropertyHeader from '@/components/historical/HistoricalPropertyHeader';
import HistoricalPropertyAlerts from '@/components/historical/HistoricalPropertyAlerts';
import HistoricalPropertyActions from '@/components/historical/HistoricalPropertyActions';
import { useHistoricalPropertyData } from '@/hooks/useHistoricalPropertyData';
import { createHistoricalProperty } from '@/utils/historicalPropertyMapper';

const HistoricalPropertyView = () => {
  const {
    propertyId,
    yearNumber,
    isHistoricalYear,
    baseProperty,
    yearData,
    loading,
    handleYearDataUpdate
  } = useHistoricalPropertyData();

  if (loading) {
    return <HistoricalPropertyLoader yearNumber={yearNumber} />;
  }

  if (!baseProperty || !yearData) {
    return <HistoricalPropertyErrorState />;
  }

  const historicalProperty = createHistoricalProperty(
    baseProperty,
    yearData,
    yearNumber,
    propertyId || ''
  );

  return (
    <Layout>
      <div className="space-y-4">
        <div className="space-y-3">
          <HistoricalPropertyHeader />
          <HistoricalPropertyAlerts 
            yearNumber={yearNumber}
            isHistoricalYear={isHistoricalYear}
          />
        </div>

        <PropertyDetailHeader 
          property={historicalProperty}
          onRentPaidChange={(paid) => {
            const updatedYearData = {
              ...yearData,
              rentPaid: paid
            };
            handleYearDataUpdate(updatedYearData);
          }}
          historicalYear={yearNumber}
        />

        <PropertyDetailContent
          property={historicalProperty}
          onRentPaidChange={(paid) => {
            const updatedYearData = {
              ...yearData,
              rentPaid: paid
            };
            handleYearDataUpdate(updatedYearData);
          }}
          onPaymentUpdate={() => {
            console.log('Payment updated for year', yearNumber);
          }}
          handleTaskToggle={() => {}}
          handleTaskAdd={() => {}}
          handleTaskDelete={() => {}}
          handleTaskUpdate={() => {}}
          handleDocumentDelete={() => {}}
          handleDocumentAdd={() => {}}
          setProperty={(updatedProperty) => {
            const updatedYearData = {
              ...yearData,
              rent: updatedProperty.rent || 0,
              rentPaid: updatedProperty.rentPaid || false,
              expenses: updatedProperty.monthlyExpenses?.map(expense => ({
                concept: expense.name,
                amount: expense.amount,
                deductible: false,
                category: expense.category,
                date: expense.date
              })) || []
            };
            handleYearDataUpdate(updatedYearData);
          }}
        />

        <HistoricalPropertyActions 
          propertyId={propertyId || ''}
          yearNumber={yearNumber}
        />
      </div>
    </Layout>
  );
};

export default HistoricalPropertyView;
