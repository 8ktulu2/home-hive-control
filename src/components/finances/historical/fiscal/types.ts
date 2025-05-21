
import { FiscalData } from '../types';

export interface FiscalSectionProps {
  form: any;
}

export interface FiscalFormProps {
  initialData: FiscalData;
  onSave: (data: FiscalData) => void;
  propertyName: string;
  selectedYear: number;
}
