
export interface PropertyYearData {
  tenants: Array<{
    name: string;
    startMonth: string; // "2025-02"
    endMonth?: string;
    email?: string;
    phone?: string;
  }>;
  payments: Array<{
    month: string; // "2025-01"
    amount: number;
    createdAt: string;
    immutable?: boolean;
    isPaid?: boolean;
    notes?: string;
  }>;
  expenses: Array<{
    concept: string;
    amount: number;
    deductible: boolean;
    category?: string;
    date: string;
  }>;
  notes: string;
  rent?: number;
  rentPaid?: boolean;
}

export interface PropertyWithYearData {
  id: string;
  name: string;
  address: string;
  image?: string;
  years: {
    [year: number]: PropertyYearData;
  };
  // Propiedades que no cambian por año
  mortgage?: {
    monthlyPayment: number;
  };
  homeInsurance?: {
    company: string;
    cost: number;
  };
  lifeInsurance?: {
    company: string;
    cost: number;
  };
}
