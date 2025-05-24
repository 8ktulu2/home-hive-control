
import { Property, MonthlyExpense } from '@/types/property';

/**
 * Calculates the total expenses for a property
 */
export const calculateTotalExpenses = (propertyToCalculate: Property) => {
  let totalExpenses = 0;
  
  // Add mortgage payment (always counts as unpaid recurring expense)
  if (propertyToCalculate.mortgage?.monthlyPayment) {
    totalExpenses += propertyToCalculate.mortgage.monthlyPayment;
  }
  
  // Add IBI (property tax) divided by 12 for monthly amount (always counts as unpaid recurring expense)
  if (propertyToCalculate.ibi) {
    totalExpenses += propertyToCalculate.ibi / 12;
  }
  
  // Add community fee (always counts as unpaid recurring expense)
  if (propertyToCalculate.communityFee) {
    totalExpenses += propertyToCalculate.communityFee;
  }
  
  // Add home insurance (monthly amount if not paid)
  if (propertyToCalculate.homeInsurance?.cost && !propertyToCalculate.homeInsurance.isPaid) {
    totalExpenses += propertyToCalculate.homeInsurance.cost / 12;
  }
  
  // Add life insurance (monthly amount if not paid)
  if (propertyToCalculate.lifeInsurance?.cost && !propertyToCalculate.lifeInsurance.isPaid) {
    totalExpenses += propertyToCalculate.lifeInsurance.cost / 12;
  }
  
  // Add ONLY unpaid monthly expenses (including inventory purchases)
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
  
  // Handle amount change for unpaid expenses only
  if (updates.amount !== undefined && !expense.isPaid && !updates.isPaid) {
    const amountDifference = updates.amount - expense.amount;
    expenseDifference += amountDifference;
  }
  
  return expenseDifference;
};
