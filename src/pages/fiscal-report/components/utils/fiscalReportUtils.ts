
import { Property } from '@/types/property';
import { PropertyHistoricalData } from '@/components/finances/historical/types';

/**
 * Genera datos históricos para una propiedad y año específicos
 */
export const generateHistoricalData = (propId: string, property: Property, year: number): PropertyHistoricalData => {
  if (!property) {
    throw new Error(`Property with ID ${propId} not found`);
  }
  
  // Calcular gastos de la propiedad
  const monthlyExpenses = property.expenses || 0;
  const monthRentAmount = property.rent || 0;
  
  // Obtener interés hipotecario si está disponible
  const mortgageInterestRate = property.mortgage?.interestRate || 0;
  const mortgageAmount = property.mortgage?.totalAmount || 0;
  const estimatedAnnualMortgageInterest = mortgageAmount * (mortgageInterestRate / 100);
  
  // Nombres de los meses en español
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  return {
    propertyId: property.id,
    propertyName: property.name,
    months: Array(12).fill(0).map((_, idx) => {
      // Usar datos de gastos reales si están disponibles
      let expensesData: any[] = [];
      if (property.monthlyExpenses) {
        // Filtrar gastos para este mes/año
        expensesData = property.monthlyExpenses
          .filter(e => e.month === idx && e.year === year)
          .map(e => ({
            id: e.id,
            name: e.name,
            amount: e.amount,
            isPaid: e.isPaid,
          }));
      }
      
      return {
        month: monthNames[idx],
        year: year,
        rentAmount: monthRentAmount,
        totalExpenses: monthlyExpenses,
        wasRented: true, // Asumimos alquilado por simplicidad
        expenses: expensesData,
        netIncome: monthRentAmount - monthlyExpenses,
        date: new Date(year, idx, 1)
      };
    })
  };
};
