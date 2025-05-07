
export interface Mortgage {
  lender?: string;
  monthlyPayment: number;
  totalAmount?: number;
  startDate?: string;
  endDate?: string;
  interestRate?: number;
  remainingAmount?: number;
  paymentHistory?: MortgagePayment[];
  annualInterest?: number; // Intereses anuales para la declaración de la renta
}

export interface MortgagePayment {
  date: string;
  amount: number;
  interest: number;
  principal: number;
  remainingDebt: number;
}

export interface MonthlyExpense {
  id: string;
  name: string;
  amount: number;
  dueDate?: string;
  paymentDate?: string;
  isPaid: boolean;
  recurring?: boolean;
  category?: 'hipoteca' | 'seguro' | 'suministros' | 'mantenimiento' | 'reparaciones' | 'impuestos' | 'administrativos' | 'juridicos' | 'conservacion' | 'formalizacion' | 'amortizacion' | 'comunidad' | 'compra' | 'otros';
  notes?: string;
  propertyId?: string;
  month?: number;
  year?: number;
  date?: string;
}

export interface FinancialMetrics {
  grossRentalYield?: number;
  netRentalYield?: number;
  cashOnCashReturn?: number;
  capRate?: number;
  roi?: number;
  breakEvenRatio?: number;
  debtServiceCoverageRatio?: number;
  vacancyRate?: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  type: 'rent' | 'expense' | 'income';
  description?: string;
  paymentMethod?: 'cash' | 'transfer' | 'card' | 'other';
  category?: string;
  isPaid: boolean;
  month?: number;
  year?: number;
  notes?: string;
}

export interface Insurance {
  company: string;
  policyNumber?: string;
  startDate?: string;
  endDate?: string;
  cost: number;
  isPaid?: boolean;
  coverage?: string;
  documents?: string[];
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  type?: 'hogar' | 'vida' | 'otro'; // Tipo de seguro
}
