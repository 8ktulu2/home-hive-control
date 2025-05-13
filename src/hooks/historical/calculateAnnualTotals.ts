
import { AnnualTotals, PropertyHistoricalData } from '@/components/finances/historical/types';

export const calculateAnnualTotals = (filteredData: PropertyHistoricalData[]): AnnualTotals => {
  const allMonthsData = filteredData.flatMap(property => 
    property.months.map(month => ({
      propertyName: property.propertyName,
      ...month
    }))
  );
  
  const totalRent = allMonthsData.reduce((sum, month) => sum + month.rentAmount, 0);
  const totalExpenses = allMonthsData.reduce((sum, month) => sum + month.totalExpenses, 0);
  const totalProfit = totalRent - totalExpenses;
  const rentedMonths = allMonthsData.filter(month => month.wasRented).length;
  const vacantMonths = allMonthsData.length - rentedMonths;
  const occupancyRate = (rentedMonths / allMonthsData.length) * 100;
  
  // Calculate expense breakdown by category
  const expensesByCategory = allMonthsData.flatMap(month => month.expenses)
    .reduce((acc, expense) => {
      const category = expense.category || 'otros';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  
  return {
    totalRent,
    totalExpenses,
    totalProfit,
    rentedMonths,
    vacantMonths,
    occupancyRate,
    expensesByCategory
  };
};
