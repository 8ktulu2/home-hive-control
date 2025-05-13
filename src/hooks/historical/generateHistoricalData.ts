
import { Property } from '@/types/property';
import { PropertyHistoricalData } from '@/components/finances/historical/types';

export const generateHistoricalData = (properties: Property[], selectedYear: number): PropertyHistoricalData[] => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const historicalData: PropertyHistoricalData[] = [];
  
  for (const property of properties) {
    const propertyData: PropertyHistoricalData = {
      propertyId: property.id,
      propertyName: property.name,
      months: []
    };
    
    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      const rentAmount = property.rent * (0.9 + Math.random() * 0.2);
      const wasRented = Math.random() > 0.2; // 80% probabilidad de estar alquilado
      
      const expenses = [];
      
      // Generate more diverse expenses for better reporting
      if (Math.random() > 0.5) {
        expenses.push({
          id: `exp-${property.id}-${month}-1`,
          name: 'Comunidad',
          amount: Math.round(property.rent * 0.1),
          isPaid: true,
          category: 'comunidad'
        });
      }
      
      if (Math.random() > 0.7) {
        expenses.push({
          id: `exp-${property.id}-${month}-2`,
          name: 'Reparación',
          amount: Math.round(property.rent * 0.15 * (Math.random() + 0.5)),
          isPaid: true,
          category: 'reparaciones'
        });
      }
      
      if (Math.random() > 0.8) {
        expenses.push({
          id: `exp-${property.id}-${month}-3`,
          name: 'IBI (proporcional)',
          amount: Math.round(property.rent * 0.08),
          isPaid: true,
          category: 'impuestos'
        });
      }
      
      if (Math.random() > 0.85) {
        expenses.push({
          id: `exp-${property.id}-${month}-4`,
          name: 'Seguro hogar',
          amount: Math.round(property.rent * 0.05),
          isPaid: true,
          category: 'seguro'
        });
      }

      if (Math.random() > 0.9) {
        expenses.push({
          id: `exp-${property.id}-${month}-5`,
          name: 'Agua',
          amount: Math.round(property.rent * 0.03),
          isPaid: true,
          category: 'suministros'
        });
      }
      
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const netIncome = wasRented ? rentAmount - totalExpenses : -totalExpenses;
      
      propertyData.months.push({
        month,
        wasRented,
        rentAmount: wasRented ? rentAmount : 0,
        expenses,
        totalExpenses,
        netIncome,
        date: new Date(selectedYear, i, 1), // Create a date object for the first day of each month
        notes: wasRented ? 
          Math.random() > 0.8 ? 'Pago con retraso' : 'Pago recibido puntual' : 
          'Propiedad vacante'
      });
    }
    
    historicalData.push(propertyData);
  }
  
  return historicalData;
};
