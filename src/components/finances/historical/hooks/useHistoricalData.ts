
import { useState } from 'react';
import { Property } from '@/types/property';
import { PropertyHistoricalData } from '../types';

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
        
        if (Math.random() > 0.5) {
          expenses.push({
            id: `exp-${property.id}-${month}-1`,
            name: 'Comunidad',
            amount: Math.round(property.rent * 0.1),
            isPaid: true
          });
        }
        
        if (Math.random() > 0.7) {
          expenses.push({
            id: `exp-${property.id}-${month}-2`,
            name: 'Reparación',
            amount: Math.round(property.rent * 0.15 * (Math.random() + 0.5)),
            isPaid: true
          });
        }
        
        if (Math.random() > 0.8) {
          expenses.push({
            id: `exp-${property.id}-${month}-3`,
            name: 'IBI (proporcional)',
            amount: Math.round(property.rent * 0.08),
            isPaid: true
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
          date: new Date(selectedYear, i, 1) // Create a date object for the first day of each month
        });
      }
      
      historicalData.push(propertyData);
    }
    
    return historicalData;
  };

  const calculateAnnualTotals = (filteredData: PropertyHistoricalData[]) => {
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
    
    return {
      totalRent,
      totalExpenses,
      totalProfit,
      rentedMonths,
      vacantMonths,
      occupancyRate
    };
  };

  const historicalData = generateHistoricalData();
  
  return {
    historicalData,
    calculateAnnualTotals
  };
};
