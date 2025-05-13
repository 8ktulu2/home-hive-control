import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { PropertyHistoricalData, Transaction } from './types';
import HistoricalHeader from './HistoricalHeader';
import HistoricalTabs from './HistoricalTabs';
import AnnualSummaryCards from './AnnualSummaryCards';
import ExpensesContent from './ExpensesContent';
import MonthlyContent from './MonthlyContent';
import FiscalDetailContent from './FiscalDetailContent';
import { useHistoricalData } from '@/hooks/useHistoricalData';
import OccupancyTimeline from './OccupancyTimeline';
import TransactionsTable from './TransactionsTable';
import FinancialReports from './FinancialReports';
import PropertyPerformanceContent from './PropertyPerformanceContent';
import HistoricalTransactionModal from './HistoricalTransactionModal';

interface HistoricalDataProps {
  properties: Property[];
  selectedYear: number;
  onPreviousYear: () => void;
  onNextYear: () => void;
}

const HistoricalData = ({ properties, selectedYear, onPreviousYear, onNextYear }: HistoricalDataProps) => {
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const { 
    historicalData, 
    calculateAnnualTotals,
    allTransactions,
    performanceMetrics
  } = useHistoricalData(properties, selectedYear);
  
  const filteredData = selectedProperty === "all" 
    ? historicalData 
    : historicalData.filter(data => data.propertyId === selectedProperty);
  
  const annualTotals = calculateAnnualTotals(filteredData);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setSelectedTransaction(null);
  };

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
          <div className="space-y-6">
            <OccupancyTimeline 
              data={filteredData} 
              year={selectedYear}
            />
            <AnnualSummaryCards {...annualTotals} />
          </div>
        </TabsContent>
        
        <TabsContent value="monthly">
          <MonthlyContent filteredData={filteredData} selectedYear={selectedYear} />
        </TabsContent>
        
        <TabsContent value="expenses">
          <ExpensesContent filteredData={filteredData} />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTable 
            transactions={allTransactions || []} 
            filteredPropertyId={selectedProperty !== "all" ? selectedProperty : undefined}
            onTransactionClick={handleTransactionClick}
          />
        </TabsContent>

        <TabsContent value="performance">
          <PropertyPerformanceContent 
            metrics={performanceMetrics || []}
            filteredPropertyId={selectedProperty !== "all" ? selectedProperty : undefined}
            year={selectedYear}
          />
        </TabsContent>

        <TabsContent value="reports">
          <FinancialReports 
            properties={properties} 
            selectedYear={selectedYear} 
            selectedPropertyId={selectedProperty} 
            historicalData={filteredData}
            annualTotals={annualTotals}
          />
        </TabsContent>

        <TabsContent value="fiscal">
          <FiscalDetailContent filteredData={filteredData} selectedYear={selectedYear} />
        </TabsContent>
      </HistoricalTabs>

      <HistoricalTransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        transaction={selectedTransaction}
      />
    </Card>
  );
};

export default HistoricalData;
