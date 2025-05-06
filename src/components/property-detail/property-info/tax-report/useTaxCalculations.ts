
import { Property } from '@/types/property';

export function useTaxCalculations(property: Property) {
  // Calculate values based on property data
  const calculateGrossIncome = () => {
    const monthlyRent = property.rent || 0;
    const monthsRented = 12; // Default to full year, could be made variable
    return monthlyRent * monthsRented;
  };

  const calculateDeductibleExpenses = () => {
    let expenses = 0;
    
    // Mortgage interest (use direct value from taxInfo if available)
    if (property.taxInfo?.mortgageInterest) {
      expenses += property.taxInfo.mortgageInterest;
    } else if (property.mortgage?.monthlyPayment) {
      // Fallback to estimated interest if not specified
      expenses += property.mortgage.monthlyPayment * 0.8 * 12; // 80% of payment as interest, for 12 months
    }
    
    // IBI (annual property tax)
    if (property.ibi) {
      expenses += property.ibi;
    }
    
    // Community fees
    if (property.communityFee) {
      expenses += property.communityFee * 12; // Asumiendo que communityFee es mensual
    }
    
    // Home insurance
    if (property.homeInsurance?.cost) {
      expenses += property.homeInsurance.cost;
    }
    
    // Depreciaciones
    // Inmueble (3% sobre el valor de construcción)
    if (property.taxInfo?.acquisitionCost && property.taxInfo?.landValue) {
      const constructionValue = property.taxInfo.acquisitionCost - property.taxInfo.landValue;
      expenses += constructionValue * 0.03; // 3% de amortización anual
    }
    
    // Mobiliario (10% sobre el valor del mobiliario)
    if (property.taxInfo?.furnitureValue) {
      expenses += property.taxInfo.furnitureValue * 0.1; // 10% de amortización anual
    }
    
    // Monthly expenses
    if (property.monthlyExpenses) {
      property.monthlyExpenses.forEach(expense => {
        expenses += expense.amount; // Sumamos todos los gastos registrados
      });
    }
    
    return expenses;
  };

  // Determine reduction percentage based on property data
  const calculateReductionPercentage = () => {
    // Base reduction for primary residence
    if (property.taxInfo?.isPrimaryResidence) {
      // Young tenant in tensioned area: 70%
      if (property.taxInfo?.isTensionedArea && property.taxInfo?.hasYoungTenant) {
        return 70;
      }
      // Rent reduction in tensioned area: 90%
      else if (property.taxInfo?.isTensionedArea && property.taxInfo?.rentReduction) {
        return 90;
      }
      // Recent renovation: 60%
      else if (property.taxInfo?.recentlyRenovated) {
        return 60;
      }
      // Default reduction for primary residence
      return 50;
    }
    return 0;
  };

  const grossIncome = calculateGrossIncome();
  const expenses = calculateDeductibleExpenses();
  const netIncome = grossIncome - expenses;
  const reductionPercentage = calculateReductionPercentage();
  const reduction = netIncome > 0 ? (netIncome * reductionPercentage) / 100 : 0;
  const taxableIncome = netIncome - reduction;

  return {
    grossIncome,
    expenses,
    netIncome,
    reductionPercentage,
    reduction,
    taxableIncome
  };
}
