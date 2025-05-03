
export interface TaxInfo {
  // Property specific information
  propertyType?: 'residential' | 'commercial' | 'industrial' | 'land';
  propertyValue?: number; // Value for depreciation calculation (3%)
  furnitureValue?: number; // Value for furniture depreciation calculation (10%)
  
  // Tax deduction eligibility
  isPrimaryResidence?: boolean; // Is this the primary residence of the tenant?
  isTensionedArea?: boolean; // Is the property in a tensioned housing market zone?
  hasYoungTenant?: boolean; // Is tenant between 18-35 years old?
  rentReduction?: boolean; // Has rent been reduced by ≥5% from previous contract?
  recentlyRenovated?: boolean; // Was the property renovated in the last 2 years?
  
  // Direct tax deduction values
  mortgageInterest?: number; // Annual mortgage interest (deductible)
  subsidies?: number; // Annual subsidies received
  otherIncome?: number; // Other income related to the property
  
  // Regional tax information
  autonomousCommunity?: string; // Which autonomous community the property is in
  regionalDeductions?: string[]; // Regional deductions applicable
}

export interface TaxReport {
  // Basic property identification
  propertyId: string;
  propertyName: string;
  taxYear: number;
  
  // Income section
  rentalIncome: number; // Annual rental income
  subsidies: number; // Government subsidies
  otherIncome: number; // Any other property-related income
  totalIncome: number; // Sum of all income
  
  // Expenses section
  ibi: number; // Property tax (IBI)
  communityFees: number; // Community fees
  mortgageInterest: number; // Only interest is deductible, not principal
  homeInsurance: number; // Home insurance costs
  maintenance: number; // Maintenance and repairs
  administrativeFees: number; // Administrative expenses
  agencyFees: number; // Real estate agency fees
  propertyDepreciation: number; // 3% of property value (excluding land)
  furnitureDepreciation: number; // 10% of furniture value
  utilities: number; // Non-recoverable utilities
  municipalTaxes: number; // Municipal taxes
  legalFees: number; // Legal expenses
  badDebts: number; // Doubtful debts (unpaid rent)
  otherExpenses: number; // Other deductible expenses
  totalExpenses: number; // Sum of all expenses
  
  // Results
  netProfit: number; // Total income - total expenses
  applicableReduction: number; // Percentage reduction (50%, 60%, 70%, or 90%)
  reducedNetProfit: number; // Net profit after reduction
  
  // Explanation of reduction
  reductionExplanation: string; // Why this reduction percentage applies
  
  // Generated on
  generatedDate: string; // When this report was generated
}
