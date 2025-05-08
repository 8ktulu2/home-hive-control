
import { Property, MonthlyExpense } from '@/types/property';

/**
 * Calculates the total expenses for a property
 */
export const calculateTotalExpenses = (propertyToCalculate: Property) => {
  let totalExpenses = 0;
  
  // Add mortgage payment
  if (propertyToCalculate.mortgage?.monthlyPayment) {
    totalExpenses += propertyToCalculate.mortgage.monthlyPayment;
  }
  
  // Add IBI (property tax) divided by 12 for monthly amount
  if (propertyToCalculate.ibi) {
    totalExpenses += propertyToCalculate.ibi / 12;
  }
  
  // Add community fee
  if (propertyToCalculate.communityFee) {
    totalExpenses += propertyToCalculate.communityFee;
  }
  
  // Add home insurance
  if (propertyToCalculate.homeInsurance?.cost && !propertyToCalculate.homeInsurance.isPaid) {
    totalExpenses += propertyToCalculate.homeInsurance.cost / 12;
  }
  
  // Add life insurance
  if (propertyToCalculate.lifeInsurance?.cost && !propertyToCalculate.lifeInsurance.isPaid) {
    totalExpenses += propertyToCalculate.lifeInsurance.cost / 12;
  }
  
  // Add unpaid monthly expenses
  if (propertyToCalculate.monthlyExpenses) {
    propertyToCalculate.monthlyExpenses.forEach(expense => {
      if (!expense.isPaid) {
        totalExpenses += expense.amount;
      }
    });
  }
  
  return totalExpenses;
};

/**
 * Calculates the impact of an expense update on the total expenses
 */
export const calculateExpenseImpact = (
  expense: MonthlyExpense, 
  updates: Partial<MonthlyExpense>
) => {
  let expenseDifference = 0;
  
  // Handle isPaid status change
  if (updates.isPaid !== undefined && expense.isPaid !== updates.isPaid) {
    // If marked as paid, subtract from total (was counted, now shouldn't be)
    if (updates.isPaid) {
      expenseDifference = -expense.amount;
    } 
    // If marked as unpaid, add to total (wasn't counted, now should be)
    else {
      expenseDifference = expense.amount;
    }
  }
  
  // Handle amount change for unpaid expenses
  if (updates.amount !== undefined && !expense.isPaid) {
    const amountDifference = updates.amount - expense.amount;
    expenseDifference += amountDifference;
  }
  
  return expenseDifference;
};
