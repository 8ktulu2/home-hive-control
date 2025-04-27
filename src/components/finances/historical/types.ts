
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
