
import { useState } from 'react';
import { PropertyHistoricalData, FiscalData } from '../../types';

export const useFiscalData = (filteredData: PropertyHistoricalData[], selectedYear: number) => {
  const [fiscalData, setFiscalData] = useState<Record<string, FiscalData>>(() => {
    // Initialize with default data for each property
    const initialData: Record<string, FiscalData> = {};
    
    filteredData.forEach(property => {
      // Calculate some initial values based on the monthly data
      const totalRent = property.months.reduce((sum, month) => sum + month.rentAmount, 0);
      const totalExpenses = property.months.reduce((sum, month) => sum + month.totalExpenses, 0);
      const netProfit = totalRent - totalExpenses;
      
      // Default reduction is 50%
      const reducedNetProfit = netProfit > 0 ? netProfit * 0.5 : netProfit;
      
      initialData[property.propertyId] = {
        // Basic info
        year: selectedYear,
        propertyId: property.propertyId,
        totalIncome: totalRent,
        totalExpenses: Math.round(totalRent * 0.6),
        netIncome: Math.round(totalRent * 0.4),
        
        // Ingresos
        rentalIncome: totalRent,
        subsidies: 0,
        otherIncome: 0,
        
        // Gastos deducibles
        ibi: Math.round(totalRent * 0.05),
        communityFees: Math.round(totalRent * 0.1),
        mortgageInterest: Math.round(totalRent * 0.2),
        homeInsurance: Math.round(totalRent * 0.03),
        maintenance: Math.round(totalRent * 0.05),
        agencyFees: 0,
        administrativeFees: 0,
        propertyDepreciation: 0,
        buildingDepreciation: Math.round(totalRent * 0.15),
        furnitureDepreciation: Math.round(totalRent * 0.05),
        utilities: 0,
        municipalTaxes: Math.round(totalRent * 0.02),
        legalFees: 0,
        badDebts: 0,
        otherExpenses: 0,
        
        // Original fields
        deductibleExpenses: {
          ibi: Math.round(totalRent * 0.05),
          community: Math.round(totalRent * 0.1),
          mortgage: Math.round(totalRent * 0.2),
          insurance: Math.round(totalRent * 0.03),
          maintenance: Math.round(totalRent * 0.05),
        },
        amortization: Math.round(totalRent * 0.15) + Math.round(totalRent * 0.05),
        
        // Reducciones
        applicableReduction: 50,
        reducedNetProfit: Math.round(totalRent * 0.4 * 0.5),
        taxableIncome: Math.round(totalRent * 0.4 * 0.5),
        
        // Additional reduction info
        inTensionedArea: false,
        rentLoweredFromPrevious: false,
        youngTenant: false,
        recentlyRenovated: false
      };
    });
    
    return initialData;
  });
  
  const handleSaveFiscalData = (propertyId: string, data: FiscalData) => {
    setFiscalData(prev => ({
      ...prev,
      [propertyId]: data
    }));
  };

  return {
    fiscalData,
    handleSaveFiscalData
  };
};
