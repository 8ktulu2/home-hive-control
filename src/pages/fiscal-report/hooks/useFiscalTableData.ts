
import { useMemo } from 'react';
import { Property } from '@/types/property';
import { generateHistoricalData } from '../components/utils/fiscalReportUtils';

export interface FiscalReportItem {
  propertyId: string;
  propertyName: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  reducedNetProfit: number;
  applicableReduction: number;
}

export const useFiscalTableData = (
  properties: Property[],
  selectedPropertyIds: string[],
  selectedYears: number[]
) => {
  // Filter properties based on selection
  const selectedProperties = properties.filter(
    property => selectedPropertyIds.includes(property.id)
  );

  // Generate fiscal data for table without using hooks in loops
  const fiscalReportData = useMemo(() => {
    const data: FiscalReportItem[] = [];

    selectedProperties.forEach(property => {
      selectedYears.forEach(year => {
        // Generate historical data for this property and year
        const historicalData = generateHistoricalData(property.id, property, year);
        
        // Calculate fiscal data manually instead of using the hook
        // This recreates the logic from useFiscalData but without using hooks
        const totalRent = historicalData.months.reduce((sum, month) => sum + month.rentAmount, 0);
        const totalExpenses = historicalData.months.reduce((sum, month) => sum + month.totalExpenses, 0);
        const netIncome = Math.round(totalRent * 0.4); // Simplified calculation, matching the useFiscalData logic
        const applicableReduction = 50; // Default reduction as in useFiscalData
        const reducedNetProfit = Math.round(netIncome * 0.5); // Apply the 50% reduction
        
        data.push({
          propertyId: property.id,
          propertyName: property.name,
          year: year,
          totalIncome: totalRent,
          totalExpenses: Math.round(totalRent * 0.6), // Same calculation as in useFiscalData
          netIncome: netIncome,
          reducedNetProfit: reducedNetProfit,
          applicableReduction: applicableReduction,
        });
      });
    });

    return data;
  }, [selectedProperties, selectedYears]);

  return {
    fiscalReportData,
    hasSelection: selectedPropertyIds.length > 0 && selectedYears.length > 0
  };
};
