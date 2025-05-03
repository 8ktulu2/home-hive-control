
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
  gasProvider?: string;
  internetProvider?: string;
  otherUtilities?: Utility[];
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
  gasProviderDetails?: ContactDetails;
  internetProviderDetails?: ContactDetails;
  homeInsurance?: Insurance;
  lifeInsurance?: Insurance;
  monthlyExpenses?: MonthlyExpense[];
  inventory?: InventoryItem[];
  contract?: Contract;
  legalDocuments?: LegalDocument[];
  taxes?: Tax;
  maintenance?: Maintenance;
  taxInfo?: TaxInfo; // Nueva propiedad para información fiscal
}

export interface TaxInfo {
  acquisitionCost?: number;     // Coste de adquisición del inmueble
  landValue?: number;           // Valor del suelo (no se amortiza)
  propertyType?: 'residential' | 'commercial' | 'garage' | 'storage' | 'land' | 'industrial' | 'office' | 'tourist';
  isPrimaryResidence?: boolean; // Es vivienda habitual del inquilino (reducción 50%)
  isTensionedArea?: boolean;    // Está en zona de mercado tensionado
  hasYoungTenant?: boolean;     // Inquilino joven (18-35 años)
  recentlyRenovated?: boolean;  // Rehabilitación en los últimos 2 años
  rentReduction?: boolean;      // Reducción de renta respecto a contrato anterior
  renovationYear?: number;      // Año de la rehabilitación
  mortgageInterest?: number;    // Intereses de hipoteca deducibles (anual)
  totalMortgagePayment?: number; // Cuota total de hipoteca (anual)
  additionalDeductions?: string[]; // Deducciones autonómicas adicionales
  notes?: string;               // Notas adicionales para información fiscal
}

export interface Utility {
  id: string;
  name: string;
  provider?: string;
  contractNumber?: string;
  accountHolder?: string;
  initialReading?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
}

export interface Contract {
  startDate?: string;
  endDate?: string;
  monthlyRent?: number;
  paymentMethod?: string;
  deposit?: number;
  inventoryNotes?: string;
}

export interface LegalDocument {
  id: string;
  type: 'deed' | 'energyCertificate' | 'habitabilityCertificate' | 'technicalInspection' | 'other';
  name: string;
  dateIssued?: string;
  expiryDate?: string;
  fileUrl?: string;
  notes?: string;
}

export interface Tax {
  ibiAmount?: number;
  ibiContactPhone?: string;
  ibiContactEmail?: string;
  ibiOrganization?: string;
  ibiAddress?: string;
  otherTaxes?: {
    name: string;
    amount: number;
    dueDate?: string;
  }[];
}

export interface Maintenance {
  plumberContact?: string;
  electricianContact?: string;
  applianceInstructions?: string;
  otherMaintenance?: {
    type: string;
    contact: string;
    notes?: string;
  }[];
}

export interface Tenant {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  identificationNumber?: string;
  alternativeAddress?: string;
  references?: string;
  economicSolvency?: string;
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
  type?: 'property' | 'liability' | 'nonPayment' | 'other';
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
