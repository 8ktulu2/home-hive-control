
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { PropertyHistoricalData } from './types';
import HistoricalHeader from './HistoricalHeader';
import HistoricalTabs from './HistoricalTabs';
import AnnualSummaryCards from './AnnualSummaryCards';
import ExpensesContent from './ExpensesContent';
import MonthlyContent from './MonthlyContent';
import FiscalDetailContent from './FiscalDetailContent';
import { useHistoricalData } from './hooks/useHistoricalData';

interface HistoricalDataProps {
  properties: Property[];
  selectedYear: number;
  onPreviousYear: () => void;
  onNextYear: () => void;
}

const HistoricalData = ({ properties, selectedYear, onPreviousYear, onNextYear }: HistoricalDataProps) => {
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("summary");

  const { historicalData, calculateAnnualTotals } = useHistoricalData(properties, selectedYear);
  
  const filteredData = selectedProperty === "all" 
    ? historicalData 
    : historicalData.filter(data => data.propertyId === selectedProperty);
  
  const annualTotals = calculateAnnualTotals(filteredData);

  return (
    <Card className="bg-[#1A1F2C] text-white rounded-lg overflow-hidden">
      <HistoricalHeader
        properties={properties}
        selectedYear={selectedYear}
        onPreviousYear={onPreviousYear}
        onNextYear={onNextYear}
        selectedProperty={selectedProperty}
        onPropertyChange={setSelectedProperty}
      />
      
      <HistoricalTabs activeTab={activeTab} setActiveTab={setActiveTab}>
        <TabsContent value="summary">
          <AnnualSummaryCards {...annualTotals} />
        </TabsContent>
        
        <TabsContent value="monthly">
          <MonthlyContent filteredData={filteredData} selectedYear={selectedYear} />
        </TabsContent>
        
        <TabsContent value="expenses">
          <ExpensesContent filteredData={filteredData} />
        </TabsContent>

        <TabsContent value="fiscal">
          <FiscalDetailContent filteredData={filteredData} selectedYear={selectedYear} />
        </TabsContent>
      </HistoricalTabs>
    </Card>
  );
};

export default HistoricalData;
