
export interface Property {
  id: string;
  name: string;
  address: string;
  image: string;
  rent: number;
  rentPaid: boolean;
  expenses: number;
  netIncome: number;
  cadastralReference?: string;
  insuranceCompany?: string;
  communityManager?: string;
  waterProvider?: string;
  electricityProvider?: string;
  tenants?: Tenant[];
  mortgage?: Mortgage;
  ibi?: number;
  documents?: Document[];
  tasks?: Task[];
  paymentHistory?: PaymentRecord[];
  financialMetrics?: FinancialMetrics;
}

export interface Tenant {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  identificationNumber?: string;
}

export interface Mortgage {
  bank?: string;
  monthlyPayment?: number;
  endDate?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
}

export interface FinancialSummary {
  totalRent: number;
  totalExpenses: number;
  netIncome: number;
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
