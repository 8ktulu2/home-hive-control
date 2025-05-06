
import { Property } from '@/types/property';

export function useTaxCalculations(property: Property) {
  // Calcular valores basados en los datos de la propiedad
  const calculateGrossIncome = () => {
    const monthlyRent = property.rent || 0;
    const monthsRented = 12; // Por defecto año completo, podría hacerse variable
    return monthlyRent * monthsRented;
  };

  const calculateDeductibleExpenses = () => {
    let expenses = 0;
    
    // Intereses de hipoteca (usar valor directo de taxInfo si está disponible)
    if (property.taxInfo?.mortgageInterest) {
      expenses += property.taxInfo.mortgageInterest;
    } else if (property.mortgage?.monthlyPayment) {
      // Estimación de intereses si no está especificado
      expenses += property.mortgage.monthlyPayment * 0.8 * 12; // 80% del pago como intereses, durante 12 meses
    }
    
    // IBI (impuesto sobre bienes inmuebles)
    if (property.ibi) {
      expenses += property.ibi;
    }
    
    // Cuotas de comunidad
    if (property.communityFee) {
      expenses += property.communityFee * 12; // Asumiendo que communityFee es mensual
    }
    
    // Seguro del hogar
    if (property.homeInsurance?.cost) {
      expenses += property.homeInsurance.cost;
    }
    
    // Seguro de vida
    if (property.lifeInsurance?.cost) {
      expenses += property.lifeInsurance.cost;
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
    
    // Gastos de conservación y reparación
    if (property.taxInfo?.conservationExpenses) {
      expenses += property.taxInfo.conservationExpenses;
    }
    
    // Gastos de formalización de contrato
    if (property.taxInfo?.contractFormalizationExpenses) {
      expenses += property.taxInfo.contractFormalizationExpenses;
    }
    
    // Gastos jurídicos
    if (property.taxInfo?.legalExpenses) {
      expenses += property.taxInfo.legalExpenses;
    }
    
    // Suministros del hogar
    if (property.taxInfo?.homeSuppliesExpenses) {
      expenses += property.taxInfo.homeSuppliesExpenses;
    }
    
    // Otros gastos mensuales
    if (property.monthlyExpenses) {
      property.monthlyExpenses.forEach(expense => {
        expenses += expense.amount; // Sumamos todos los gastos registrados
      });
    }
    
    return expenses;
  };

  // Determinar el porcentaje de reducción basado en los datos de la propiedad
  const calculateReductionPercentage = () => {
    // Reducción base para vivienda habitual
    if (property.taxInfo?.isPrimaryResidence) {
      // Inquilino joven en área tensionada: 70%
      if (property.taxInfo?.isTensionedArea && property.taxInfo?.hasYoungTenant) {
        return 70;
      }
      // Reducción de alquiler en área tensionada: 90%
      else if (property.taxInfo?.isTensionedArea && property.taxInfo?.rentReduction) {
        return 90;
      }
      // Renovación reciente: 60%
      else if (property.taxInfo?.recentlyRenovated) {
        return 60;
      }
      // Reducción por defecto para vivienda habitual
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
