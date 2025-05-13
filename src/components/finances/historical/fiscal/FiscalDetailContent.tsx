
import React from 'react';
import { PropertyHistoricalData } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import FiscalDetailCard from './components/FiscalDetailCard';
import PropertyFiscalSection from './components/PropertyFiscalSection';
import EmptyFiscalState from './components/EmptyFiscalState';
import { useFiscalData } from './hooks/useFiscalData';

interface FiscalDetailContentProps {
  filteredData: PropertyHistoricalData[];
  selectedYear: number;
}

const FiscalDetailContent = ({ filteredData, selectedYear }: FiscalDetailContentProps) => {
  const { fiscalData, handleSaveFiscalData } = useFiscalData(filteredData, selectedYear);
  
  if (filteredData.length === 0) {
    return <EmptyFiscalState />;
  }

  return (
    <div className="space-y-6">
      <FiscalDetailCard selectedYear={selectedYear} />

      {filteredData.map(property => {
        const propertyFiscalData = fiscalData[property.propertyId];
        
        return propertyFiscalData ? (
          <PropertyFiscalSection
            key={property.propertyId}
            property={property}
            selectedYear={selectedYear}
            fiscalData={propertyFiscalData}
            onSaveFiscalData={handleSaveFiscalData}
          />
        ) : null;
      })}
    </div>
  );
};

export default FiscalDetailContent;
