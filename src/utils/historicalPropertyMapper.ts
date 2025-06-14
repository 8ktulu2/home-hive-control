
import { Property } from '@/types/property';
import { PropertyYearData } from '@/types/property/property-year-data';

export const createHistoricalProperty = (
  baseProperty: Property,
  yearData: PropertyYearData,
  yearNumber: number,
  propertyId: string
): Property => {
  return {
    ...baseProperty,
    rent: yearData.rent || 0,
    rentPaid: yearData.rentPaid || false,
    paymentHistory: yearData.payments.map((payment, index) => ({
      id: `${yearNumber}-${payment.month}-${index}`,
      date: payment.createdAt,
      amount: payment.amount,
      type: 'rent' as const,
      isPaid: payment.isPaid || false,
      month: parseInt(payment.month.split('-')[1]) || 1,
      year: yearNumber,
      description: payment.notes || 'Alquiler'
    })),
    monthlyExpenses: yearData.expenses.map((expense, index) => ({
      id: `${yearNumber}-${expense.concept}-${index}`,
      name: expense.concept,
      amount: expense.amount,
      category: (expense.category as "otros" | "hipoteca" | "seguro" | "suministros" | "mantenimiento" | "reparaciones" | "impuestos" | "administrativos" | "juridicos" | "conservacion" | "formalizacion" | "amortizacion" | "comunidad" | "compra") || 'otros',
      date: expense.date,
      isPaid: false,
      dueDate: undefined,
      paymentDate: undefined,
      recurring: false,
      notes: undefined,
      propertyId: propertyId,
      month: new Date(expense.date).getMonth() + 1,
      year: yearNumber
    })),
    tasks: baseProperty.tasks || [],
    documents: baseProperty.documents || [],
    inventory: baseProperty.inventory || []
  };
};
