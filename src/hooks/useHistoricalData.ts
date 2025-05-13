
import { useMemo } from 'react';
import { Property } from '@/types/property';
import { 
  generateHistoricalData,
  generateAllTransactions,
  generatePerformanceMetrics,
  calculateAnnualTotals
} from './historical';

export const useHistoricalData = (properties: Property[], selectedYear: number) => {
  // Generate the data with memoization to avoid recalculation on re-renders
  const historicalData = useMemo(() => generateHistoricalData(properties, selectedYear), [properties, selectedYear]);
  const allTransactions = useMemo(() => generateAllTransactions(historicalData, selectedYear), [historicalData, selectedYear]);
  const performanceMetrics = useMemo(() => generatePerformanceMetrics(historicalData), [historicalData]);
  
  return {
    historicalData,
    calculateAnnualTotals,
    allTransactions,
    performanceMetrics
  };
};
