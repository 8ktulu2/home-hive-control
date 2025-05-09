
import { UseFormReturn } from "react-hook-form";
import { FiscalData } from '../types';

export interface FiscalSectionProps {
  form: UseFormReturn<FiscalData>;
}

export interface FiscalFormProps {
  initialData: FiscalData;
  onSave: (data: FiscalData) => void;
  propertyName: string;
  selectedYear: number;
}
