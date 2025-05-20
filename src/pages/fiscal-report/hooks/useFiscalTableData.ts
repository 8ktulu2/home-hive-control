
import { useMemo } from 'react';
import { Property } from '@/types/property';
import { useFiscalData } from '@/components/finances/historical/fiscal/hooks/useFiscalData';
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

  // Generate fiscal data for table
  const fiscalReportData = useMemo(() => {
    const data: FiscalReportItem[] = [];

    selectedProperties.forEach(property => {
      selectedYears.forEach(year => {
        // Generate historical data for this property and year
        const historicalData = generateHistoricalData(property.id, property, year);
        
        // Get fiscal data using the existing hook
        const { fiscalData } = useFiscalData([historicalData], year);
        const propertyFiscalData = fiscalData[property.id];
        
        if (propertyFiscalData) {
          data.push({
            propertyId: property.id,
            propertyName: property.name,
            year: year,
            totalIncome: propertyFiscalData.totalIncome || 0,
            totalExpenses: propertyFiscalData.totalExpenses || 0,
            netIncome: propertyFiscalData.netIncome || 0,
            reducedNetProfit: propertyFiscalData.reducedNetProfit || 0,
            applicableReduction: propertyFiscalData.applicableReduction || 0,
          });
        }
      });
    });

    return data;
  }, [selectedProperties, selectedYears]);

  return {
    fiscalReportData,
    hasSelection: selectedPropertyIds.length > 0 && selectedYears.length > 0
  };
};
