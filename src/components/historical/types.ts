
import { HistoricalEntry } from '@/types/historical';

export interface HistoricalFormData {
  propertyId: string;
  propertyName: string;
  year: number;
  month: number;
  type: HistoricalEntry['type'];
  amount: number;
  description: string;
  category: HistoricalEntry['category'];
  isOccupied: boolean;
  tenantName: string;
}

export interface FormErrors {
  [key: string]: string;
}
