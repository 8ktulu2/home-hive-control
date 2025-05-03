
import { Tenant } from './tenant-types';
import { Mortgage, MonthlyExpense, FinancialMetrics, PaymentRecord, Insurance } from './financial-types';
import { Document, LegalDocument } from './document-types';
import { Utility } from './utility-types';
import { Task } from './task-types';
import { TaxInfo } from './tax-types';
import { ContactDetails } from './contact-types';
import { InventoryItem } from './maintenance-types';

export interface Property {
  id: string;
  name: string;
  address: string;
  image: string;
  images?: string[];
  squareMeters?: number;
  bedrooms?: number;
  bathrooms?: number;
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
  communityFee?: number;
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
  taxInfo?: TaxInfo;
}

export interface Contract {
  startDate?: string;
  endDate?: string;
  monthlyRent?: number;
  paymentMethod?: string;
  deposit?: number;
  inventoryNotes?: string;
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
