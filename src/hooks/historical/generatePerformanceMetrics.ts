
import { PerformanceMetric, PropertyHistoricalData } from '@/components/finances/historical/types';

export const generatePerformanceMetrics = (data: PropertyHistoricalData[]): PerformanceMetric[] => {
  return data.map(property => {
    // Calculate totals for this property
    const totalRent = property.months.reduce((sum, month) => sum + month.rentAmount, 0);
    const totalExpenses = property.months.reduce((sum, month) => sum + month.totalExpenses, 0);
    const netIncome = totalRent - totalExpenses;
    const rentedMonths = property.months.filter(month => month.wasRented).length;
    const occupancyRate = (rentedMonths / property.months.length) * 100;
    
    // Property value estimation (mock data)
    const estimatedValue = property.months[0].rentAmount * 12 * (10 + Math.random() * 5);
    
    // Calculate all metrics
    const capRate = (netIncome / estimatedValue) * 100;
    const cashOnCash = (netIncome / (estimatedValue * 0.3)) * 100; // Assuming 30% down payment
    const expenseRatio = (totalExpenses / totalRent) * 100;
    const grossYield = (totalRent / estimatedValue) * 100;
    
    return {
      propertyId: property.propertyId,
      propertyName: property.propertyName,
      occupancyRate,
      vacancyRate: 100 - occupancyRate,
      grossRentalIncome: totalRent,
      totalExpenses,
      netOperatingIncome: netIncome,
      estimatedValue,
      capRate,
      cashOnCashReturn: cashOnCash,
      expenseRatio,
      grossYield
    };
  });
};
