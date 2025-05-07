
import { Property, MonthlyExpense } from '@/types/property';
import { toast } from 'sonner';

export function useExpenseManagement(
  property: Property | null,
  setProperty: (property: Property | null) => void
) {
  const handleExpenseAdd = (expense: Partial<MonthlyExpense>) => {
    if (property) {
      const newExpense: MonthlyExpense = {
        id: `expense-${Date.now()}`,
        name: expense.name || '',
        amount: expense.amount || 0,
        isPaid: expense.isPaid || false,
        category: expense.category || 'compra',
        propertyId: property.id,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        date: expense.date || new Date().toISOString(),
        paymentDate: expense.paymentDate
      };
      
      // Solo contar como gasto si no está pagado
      const newTotalExpenses = property.expenses + newExpense.amount;
      const newNetIncome = property.rent - newTotalExpenses;
      
      const updatedProperty = {
        ...property,
        monthlyExpenses: [...(property.monthlyExpenses || []), newExpense],
        expenses: newTotalExpenses,
        netIncome: newNetIncome
      };
      
      setProperty(updatedProperty);
      
      // Guardar en localStorage
      try {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
          toast.success('Gasto añadido correctamente', { duration: 2000 });
        }
      } catch (error) {
        toast.error('Error al guardar el gasto', { duration: 2000 });
        console.error('Error saving expense:', error);
      }
    }
  };
  
  const handleExpenseUpdate = (expenseId: string, updates: Partial<MonthlyExpense>) => {
    if (property && property.monthlyExpenses) {
      const expense = property.monthlyExpenses.find(e => e.id === expenseId);
      if (!expense) return;
      
      // Calcular impacto del gasto
      let expenseDifference = 0;
      
      // Si estamos cambiando el estado de pagado
      if (updates.isPaid !== undefined && expense.isPaid !== updates.isPaid) {
        // Si se marca como pagado, restar del total (estaba contabilizado, ahora no debe estarlo)
        if (updates.isPaid) {
          expenseDifference = -expense.amount;
          updates.paymentDate = new Date().toISOString();
        } 
        // Si se marca como no pagado, añadir al total (no estaba contabilizado, ahora debe estarlo)
        else {
          expenseDifference = expense.amount;
          updates.paymentDate = undefined;
        }
      }
      
      // Si estamos cambiando la cantidad
      if (updates.amount !== undefined && !expense.isPaid) {
        const amountDifference = updates.amount - expense.amount;
        expenseDifference += amountDifference;
      }
      
      const updatedExpenses = property.monthlyExpenses.map(expense => 
        expense.id === expenseId ? { ...expense, ...updates } : expense
      );
      
      const newTotalExpenses = property.expenses + expenseDifference;
      const newNetIncome = property.rent - newTotalExpenses;
      
      const updatedProperty = {
        ...property,
        monthlyExpenses: updatedExpenses,
        expenses: newTotalExpenses,
        netIncome: newNetIncome
      };
      
      setProperty(updatedProperty);
      
      // Guardar en localStorage
      try {
        const savedProperties = localStorage.getItem('properties');
        if (savedProperties) {
          const properties = JSON.parse(savedProperties);
          const updatedProperties = properties.map((p: Property) => 
            p.id === property.id ? updatedProperty : p
          );
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
          toast.success('Gasto actualizado correctamente', { duration: 2000 });
        }
      } catch (error) {
        toast.error('Error al actualizar el gasto', { duration: 2000 });
        console.error('Error updating expense:', error);
      }
    }
  };

  const calculateTotalExpenses = (propertyToCalculate: Property) => {
    let totalExpenses = 0;
    
    // Añadir pago de hipoteca
    if (propertyToCalculate.mortgage?.monthlyPayment) {
      totalExpenses += propertyToCalculate.mortgage.monthlyPayment;
    }
    
    // Añadir IBI (impuesto sobre bienes inmuebles) dividido por 12 para cantidad mensual
    if (propertyToCalculate.ibi) {
      totalExpenses += propertyToCalculate.ibi / 12;
    }
    
    // Añadir cuota de comunidad
    if (propertyToCalculate.communityFee) {
      totalExpenses += propertyToCalculate.communityFee;
    }
    
    // Añadir seguros
    if (propertyToCalculate.homeInsurance?.cost && !propertyToCalculate.homeInsurance.isPaid) {
      totalExpenses += propertyToCalculate.homeInsurance.cost / 12;
    }
    
    if (propertyToCalculate.lifeInsurance?.cost && !propertyToCalculate.lifeInsurance.isPaid) {
      totalExpenses += propertyToCalculate.lifeInsurance.cost / 12;
    }
    
    // Añadir gastos mensuales que no están pagados
    if (propertyToCalculate.monthlyExpenses) {
      propertyToCalculate.monthlyExpenses.forEach(expense => {
        if (!expense.isPaid) {
          totalExpenses += expense.amount;
        }
      });
    }
    
    return totalExpenses;
  };

  return {
    handleExpenseAdd,
    handleExpenseUpdate,
    calculateTotalExpenses
  };
}
