
import { useMemo } from 'react';
import { Property } from '@/types/property';
import { PropertyHistoricalData, Transaction, PerformanceMetric, AnnualTotals } from '../types';

export const useHistoricalData = (properties: Property[], selectedYear: number) => {
  const generateHistoricalData = () => {
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

  // Generate transactions for transaction list view
  const generateAllTransactions = (data: PropertyHistoricalData[]): Transaction[] => {
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

  // Calculate performance metrics
  const generatePerformanceMetrics = (data: PropertyHistoricalData[]): PerformanceMetric[] => {
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

  const calculateAnnualTotals = (filteredData: PropertyHistoricalData[]): AnnualTotals => {
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

  // Generate the data with memoization to avoid recalculation on re-renders
  const historicalData = useMemo(() => generateHistoricalData(), [properties, selectedYear]);
  const allTransactions = useMemo(() => generateAllTransactions(historicalData), [historicalData, selectedYear]);
  const performanceMetrics = useMemo(() => generatePerformanceMetrics(historicalData), [historicalData]);
  
  return {
    historicalData,
    calculateAnnualTotals,
    allTransactions,
    performanceMetrics
  };
};
