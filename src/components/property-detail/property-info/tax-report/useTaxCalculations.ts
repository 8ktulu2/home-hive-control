
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
    
    // Intereses de hipoteca (usar valor directo de taxInfo o mortgage si está disponible)
    if (property.taxInfo?.mortgageInterest) {
      expenses += property.taxInfo.mortgageInterest;
    } else if (property.mortgage?.annualInterest) {
      expenses += property.mortgage.annualInterest;
    } else if (property.mortgage?.monthlyPayment && property.mortgage?.interestRate) {
      // Estimación de intereses si no está especificado
      const monthlyPayment = property.mortgage.monthlyPayment;
      const interestRate = property.mortgage.interestRate;
      expenses += monthlyPayment * 12 * (interestRate / 100);
    }
    
    // IBI (impuesto sobre bienes inmuebles)
    if (property.taxInfo?.ibiAnnual) {
      expenses += property.taxInfo.ibiAnnual;
    } else if (property.ibi) {
      expenses += property.ibi;
    }
    
    // Cuotas de comunidad
    if (property.taxInfo?.communityFeesAnnual) {
      expenses += property.taxInfo.communityFeesAnnual;
    } else if (property.communityFee) {
      expenses += property.communityFee * 12; // Asumiendo que communityFee es mensual
    }
    
    // Seguro del hogar
    if (property.taxInfo?.homeInsuranceAnnual) {
      expenses += property.taxInfo.homeInsuranceAnnual;
    } else if (property.homeInsurance?.cost) {
      expenses += property.homeInsurance.cost;
    }
    
    // Seguro de vida
    if (property.taxInfo?.lifeInsuranceAnnual) {
      expenses += property.taxInfo.lifeInsuranceAnnual;
    } else if (property.lifeInsurance?.cost) {
      expenses += property.lifeInsurance.cost;
    }
    
    // Amortización inmueble (3% sobre el valor de construcción)
    if (property.taxInfo?.buildingDepreciation) {
      expenses += property.taxInfo.buildingDepreciation;
    } else if (property.taxInfo?.acquisitionCost && property.taxInfo?.landValue) {
      const constructionValue = property.taxInfo.acquisitionCost - property.taxInfo.landValue;
      expenses += constructionValue * 0.03; // 3% de amortización anual
    }
    
    // Amortización mobiliario (10% sobre el valor del mobiliario)
    if (property.taxInfo?.furnitureDepreciation) {
      expenses += property.taxInfo.furnitureDepreciation;
    } else if (property.taxInfo?.furnitureValue) {
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
    
    // Gastos administrativos
    if (property.taxInfo?.administrativeExpenses) {
      expenses += property.taxInfo.administrativeExpenses;
    }
    
    // Saldos de dudoso cobro
    if (property.taxInfo?.badDebtsExpenses) {
      expenses += property.taxInfo.badDebtsExpenses;
    }
    
    // Otros gastos deducibles
    if (property.taxInfo?.otherDeductibleExpenses) {
      expenses += property.taxInfo.otherDeductibleExpenses;
    }
    
    // Otros gastos mensuales
    if (property.monthlyExpenses) {
      property.monthlyExpenses.forEach(expense => {
        // Solo agregamos si aún no se han contabilizado en las categorías anteriores
        // y están registrados como pagados (para evitar doble contabilización)
        if (expense.isPaid) {
          expenses += expense.amount; // Sumamos todos los gastos registrados
        }
      });
    }
    
    return expenses;
  };

  // Determinar el porcentaje de reducción basado en los datos de la propiedad
  const calculateReductionPercentage = () => {
    // Reducción base para vivienda habitual
    if (property.taxInfo?.isPrimaryResidence) {
      // Solo consideramos las reducciones especiales si es zona tensionada
      if (property.taxInfo?.isTensionedArea) {
        // Inquilino joven en área tensionada: 70%
        if (property.taxInfo?.hasYoungTenant) {
          return 70;
        }
        // Reducción de alquiler en área tensionada: 90%
        else if (property.taxInfo?.rentReduction) {
          return 90;
        }
      }
      
      // Renovación reciente: 60% (aplicable independientemente de si es zona tensionada)
      if (property.taxInfo?.recentlyRenovated) {
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
