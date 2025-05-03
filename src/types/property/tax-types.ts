
export interface TaxInfo {
  acquisitionCost?: number;
  landValue?: number;
  propertyType?: 'residential' | 'commercial' | 'garage' | 'storage' | 'land' | 'industrial' | 'office' | 'tourist';
  isPrimaryResidence?: boolean;
  isTensionedArea?: boolean;
  hasYoungTenant?: boolean;
  recentlyRenovated?: boolean;
  rentReduction?: boolean;
  renovationYear?: number;
  mortgageInterest?: number;
  totalMortgagePayment?: number;
  additionalDeductions?: string[];
  notes?: string;
}
