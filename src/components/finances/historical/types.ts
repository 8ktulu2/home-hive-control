export interface HistoricalExpense {
  id: string;
  name: string;
  amount: number;
  isPaid: boolean;
}

export interface MonthlyData {
  month: string;
  wasRented: boolean;
  rentAmount: number;
  expenses: HistoricalExpense[];
  totalExpenses: number;
  netIncome: number;
}

export interface PropertyHistoricalData {
  propertyId: string;
  propertyName: string;
  months: MonthlyData[];
}

export interface FiscalData {
  // Ingresos
  rentalIncome: number;
  subsidies: number;
  otherIncome: number;
  
  // Gastos deducibles
  ibi: number;
  communityFees: number;
  mortgageInterest: number;
  homeInsurance: number;
  maintenance: number;
  agencyFees: number;
  administrativeFees: number;
  propertyDepreciation: number;
  utilities: number;
  municipalTaxes: number;
  legalFees: number;
  otherExpenses: number;
  
  // Totales calculados
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}
