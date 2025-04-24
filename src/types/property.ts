export interface Property {
  id: string;
  name: string;
  address: string;
  image: string;
  images?: string[];  // Nueva propiedad para múltiples imágenes
  squareMeters?: number; // Metros cuadrados
  bedrooms?: number; // Número de habitaciones
  bathrooms?: number; // Número de baños
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
  communityFee?: number; // Nuevo campo para gastos de comunidad
  documents?: Document[];
  tasks?: Task[];
  paymentHistory?: PaymentRecord[];
  financialMetrics?: FinancialMetrics;
  insuranceDetails?: ContactDetails;
  communityManagerDetails?: ContactDetails;
  waterProviderDetails?: ContactDetails;
  electricityProviderDetails?: ContactDetails;
  homeInsurance?: Insurance;
  lifeInsurance?: Insurance;
  monthlyExpenses?: MonthlyExpense[];
  inventory?: InventoryItem[];
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

export interface Insurance {
  company?: string;
  policyNumber?: string;
  cost?: number;
  renewalDate?: string;
  isPaid?: boolean;
  paymentFrequency?: 'monthly' | 'quarterly' | 'annually';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  category?: 'tenant-contract' | 'supply-contract' | 'insurance' | 'invoice' | 'other';
  isPrimary?: boolean;
  propertyName?: string; // Added property name for referencing in the Documents page
  propertyId?: string;   // Added property id for referencing in the Documents page
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdDate: string;
  completedDate?: string;
  notification?: TaskNotification;
}

export interface TaskNotification {
  enabled: boolean;
  date: string;
  reminderDays?: number;
  type?: 'email' | 'push' | 'both';
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

export interface ContactDetails {
  phone?: string;
  email?: string;
  website?: string;
  contactPerson?: string;
  notes?: string;
}

export interface MonthlyExpense {
  id: string;
  name: string;
  amount: number;
  isPaid: boolean;
  date: string;
  paymentDate?: string; // Nueva propiedad para la fecha de pago
  category: string;
  propertyId: string;
  month: number;
  year: number;
}

export interface InventoryItem {
  id: string;
  type: 'furniture' | 'appliance' | 'other';
  name: string;
  condition: 'new' | 'good' | 'fair' | 'poor';
  acquisitionDate?: string;
  notes?: string;
}
