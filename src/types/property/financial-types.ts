
export interface Mortgage {
  bank?: string;
  monthlyPayment?: number;
  endDate?: string;
}

export interface Insurance {
  company?: string;
  policyNumber?: string;
  cost?: number;
  renewalDate?: string;
  isPaid?: boolean;
  paymentFrequency?: 'monthly' | 'quarterly' | 'annually';
  type?: 'property' | 'liability' | 'nonPayment' | 'other';
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  isPaid: boolean;
  notes?: string;
  month: number;
  year: number;
}

export interface FinancialMetrics {
  roi?: number;
  cashOnCash?: number;
  capRate?: number;
  grossRentMultiplier?: number;
  netOperatingIncome?: number;
  annualizedReturn?: number;
}

export interface MonthlyExpense {
  id: string;
  name: string;
  amount: number;
  isPaid: boolean;
  date: string;
  paymentDate?: string;
  category: string;
  propertyId: string;
  month: number;
  year: number;
}
