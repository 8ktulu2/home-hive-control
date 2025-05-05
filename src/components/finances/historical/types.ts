
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
  date: Date; // Added date field to ensure it's present
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
  
  // Amortizaciones
  buildingDepreciation: number; // 3% del valor de construcción
  furnitureDepreciation: number; // 10% del valor de muebles
  
  // Saldos de dudoso cobro
  badDebts: number;
  
  // Totales calculados
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  
  // Reducciones
  applicableReduction: number; // 50%, 60%, 70% o 90%
  reducedNetProfit: number;
  
  // Información adicional para cálculos
  inTensionedArea: boolean;
  rentLoweredFromPrevious: boolean;
  youngTenant: boolean; // 18-35 años
  recentlyRenovated: boolean; // Rehabilitada en los últimos 2 años
}
