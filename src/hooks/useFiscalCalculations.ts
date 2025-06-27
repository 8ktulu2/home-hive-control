
import { useMemo } from 'react';
import { Property } from '@/types/property';

export interface FiscalData {
  grossIncome: number;
  deductibleExpenses: number;
  netProfit: number;
  taxableBase: number;
  irpfQuota: number;
  retentions: number;
  iva: number;
  finalLiquidity: number;
  depreciation: number;
  financialExpenses: number;
  propertyDetails: PropertyFiscalDetail[];
}

export interface PropertyFiscalDetail {
  id: string;
  name: string;
  grossIncome: number;
  expenses: number;
  netProfit: number;
  depreciation: number;
  taxableBase: number;
}

export const useFiscalCalculations = (properties: Property[], year: number): FiscalData => {
  return useMemo(() => {
    console.log('Calculando datos fiscales para año:', year);
    
    let totalGrossIncome = 0;
    let totalDeductibleExpenses = 0;
    let totalDepreciation = 0;
    let totalFinancialExpenses = 0;
    let totalRetentions = 0;
    let totalIva = 0;
    
    const propertyDetails: PropertyFiscalDetail[] = properties.map(property => {
      // Ingresos brutos anuales (alquiler mensual × 12)
      const grossIncome = (property.rent || 0) * 12;
      
      // Gastos deducibles
      let expenses = 0;
      
      // IBI anual
      if (property.taxInfo?.ibiAnnual) {
        expenses += property.taxInfo.ibiAnnual;
      } else if (property.ibi) {
        expenses += property.ibi;
      }
      
      // Gastos de comunidad anuales
      if (property.taxInfo?.communityFeesAnnual) {
        expenses += property.taxInfo.communityFeesAnnual;
      } else if (property.communityFee) {
        expenses += property.communityFee * 12;
      }
      
      // Seguros
      if (property.homeInsurance?.cost) {
        expenses += property.homeInsurance.cost;
      }
      if (property.lifeInsurance?.cost) {
        expenses += property.lifeInsurance.cost;
      }
      
      // Gastos mensuales registrados
      if (property.monthlyExpenses) {
        const yearlyExpenses = property.monthlyExpenses
          .filter(expense => expense.year === year && expense.isPaid)
          .reduce((sum, expense) => sum + expense.amount, 0);
        expenses += yearlyExpenses;
      }
      
      // Amortización (3% sobre valor de construcción)
      let depreciation = 0;
      if (property.taxInfo?.buildingDepreciation) {
        depreciation = property.taxInfo.buildingDepreciation;
      } else if (property.taxInfo?.acquisitionCost && property.taxInfo?.landValue) {
        const constructionValue = property.taxInfo.acquisitionCost - property.taxInfo.landValue;
        depreciation = constructionValue * 0.03;
      }
      
      // Gastos financieros (intereses de hipoteca)
      let financialExpenses = 0;
      if (property.taxInfo?.mortgageInterest) {
        financialExpenses = property.taxInfo.mortgageInterest;
      } else if (property.mortgage?.annualInterest) {
        financialExpenses = property.mortgage.annualInterest;
      }
      
      expenses += depreciation + financialExpenses;
      
      const netProfit = grossIncome - expenses;
      const taxableBase = Math.max(0, netProfit);
      
      // Acumular totales
      totalGrossIncome += grossIncome;
      totalDeductibleExpenses += expenses;
      totalDepreciation += depreciation;
      totalFinancialExpenses += financialExpenses;
      
      return {
        id: property.id,
        name: property.name,
        grossIncome,
        expenses,
        netProfit,
        depreciation,
        taxableBase
      };
    });
    
    const netProfit = totalGrossIncome - totalDeductibleExpenses;
    const taxableBase = Math.max(0, netProfit);
    
    // Estimación IRPF (tipo medio aproximado del 24%)
    const irpfQuota = taxableBase * 0.24;
    
    // Retenciones estimadas (19% sobre ingresos brutos si aplica)
    const retentions = totalGrossIncome * 0.19;
    
    // Liquidez final
    const finalLiquidity = netProfit - irpfQuota + retentions;
    
    return {
      grossIncome: totalGrossIncome,
      deductibleExpenses: totalDeductibleExpenses,
      netProfit,
      taxableBase,
      irpfQuota,
      retentions: totalRetentions,
      iva: totalIva,
      finalLiquidity,
      depreciation: totalDepreciation,
      financialExpenses: totalFinancialExpenses,
      propertyDetails
    };
  }, [properties, year]);
};
