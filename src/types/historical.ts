
export interface HistoricalEntry {
  id: string;
  propertyId: string;
  propertyName: string;
  year: number;
  month: number; // 0-11 (enero-diciembre)
  type: 'income' | 'expense' | 'occupancy' | 'incident';
  amount?: number; // Para ingresos y gastos
  description: string;
  category?: 'rent' | 'deposit' | 'ibi' | 'community' | 'insurance' | 'maintenance' | 'repairs' | 'utilities' | 'legal' | 'other';
  isOccupied?: boolean; // Para registros de ocupación
  tenantName?: string; // Nombre del inquilino si estaba ocupado
  createdAt: string;
  updatedAt: string;
  isHistorical: true; // Flag para distinguir de datos actuales
}

export interface HistoricalSummary {
  propertyId: string;
  propertyName: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  occupancyRate: number; // Porcentaje de meses ocupados
  months: MonthlyHistoricalData[];
}

export interface MonthlyHistoricalData {
  month: number;
  income: number;
  expenses: number;
  isOccupied: boolean;
  tenantName?: string;
  incidentsCount: number;
}

export interface HistoricalFilters {
  propertyId?: string;
  year?: number;
  type?: HistoricalEntry['type'];
  category?: HistoricalEntry['category'];
}
