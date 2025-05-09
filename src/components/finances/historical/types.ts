
export interface OccupancyMonth {
  month: string;
  wasRented: boolean;
  rentAmount: number;
  expenses: ExpenseItem[];
  totalExpenses: number;
  netIncome: number;
  date?: Date;
  notes?: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  isPaid: boolean;
  category?: string;
}

export interface PropertyHistoricalData {
  propertyId: string;
  propertyName: string;
  months: OccupancyMonth[];
}

export interface PerformanceMetric {
  propertyId: string;
  propertyName: string;
  occupancyRate: number;
  vacancyRate: number;
  grossRentalIncome: number;
  totalExpenses: number;
  netOperatingIncome: number;
  estimatedValue: number;
  capRate: number;
  cashOnCashReturn: number;
  expenseRatio: number;
  grossYield: number;
}

export interface Transaction {
  id: string;
  date: Date;
  propertyId: string;
  propertyName: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  notes?: string;
  documents?: string[];
}

export interface AnnualTotals {
  totalRent: number;
  totalExpenses: number;
  totalProfit: number;
  rentedMonths: number;
  vacantMonths: number;
  occupancyRate: number;
  expensesByCategory?: Record<string, number>;
}

export interface FiscalData {
  year: number;
  propertyId: string;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  deductibleExpenses: Record<string, number>;
  amortization: number;
  applicableReduction: number;
  taxableIncome: number;
}
