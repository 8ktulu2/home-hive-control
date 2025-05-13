
import { PropertyHistoricalData, Transaction } from '@/components/finances/historical/types';

export const generateAllTransactions = (
  data: PropertyHistoricalData[], 
  selectedYear: number
): Transaction[] => {
  const transactions: Transaction[] = [];
  
  // Add rent payments and expenses for all properties
  data.forEach(property => {
    property.months.forEach(monthData => {
      if (monthData.wasRented) {
        transactions.push({
          id: `rent-${property.propertyId}-${monthData.month}`,
          date: monthData.date || new Date(selectedYear, 0, 1), // Default to Jan 1st if no date
          propertyId: property.propertyId,
          propertyName: property.propertyName,
          type: 'income',
          category: 'rent',
          description: `Alquiler ${monthData.month} ${selectedYear}`,
          amount: monthData.rentAmount,
          notes: monthData.notes,
          documents: Math.random() > 0.7 ? ['recibo_alquiler.pdf'] : []
        });
      }
      
      // Add all expenses as transactions
      monthData.expenses.forEach(expense => {
        transactions.push({
          id: expense.id,
          date: monthData.date || new Date(selectedYear, 0, 1),
          propertyId: property.propertyId,
          propertyName: property.propertyName,
          type: 'expense',
          category: expense.category || 'otros',
          description: expense.name,
          amount: -expense.amount, // Negative for expenses
          notes: `Gasto ${expense.name} de ${monthData.month}`,
          documents: Math.random() > 0.8 ? ['factura.pdf'] : []
        });
      });
    });
  });
  
  // Sort by date
  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
