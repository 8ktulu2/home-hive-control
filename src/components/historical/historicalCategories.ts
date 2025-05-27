
import { HistoricalEntry } from '@/types/historical';

export interface HistoricalCategory {
  key: string;
  label: string;
  type: HistoricalEntry['type'];
  category: HistoricalEntry['category'];
  icon: string;
}

export const historicalCategories: HistoricalCategory[] = [
  {
    key: 'rent',
    label: 'Alquiler',
    type: 'income',
    category: 'rent',
    icon: '🏠'
  },
  {
    key: 'mortgage',
    label: 'Hipoteca',
    type: 'expense',
    category: 'other',
    icon: '🏦'
  },
  {
    key: 'community',
    label: 'Comunidad',
    type: 'expense',
    category: 'community',
    icon: '🏢'
  },
  {
    key: 'ibi',
    label: 'IBI',
    type: 'expense',
    category: 'ibi',
    icon: '📄'
  },
  {
    key: 'lifeInsurance',
    label: 'Seguro de Vida',
    type: 'expense',
    category: 'insurance',
    icon: '💼'
  },
  {
    key: 'homeInsurance',
    label: 'Seguro de Hogar',
    type: 'expense',
    category: 'insurance',
    icon: '🛡️'
  },
  {
    key: 'purchases',
    label: 'Compras',
    type: 'expense',
    category: 'other',
    icon: '🛒'
  },
  {
    key: 'repairs',
    label: 'Averías',
    type: 'expense',
    category: 'repairs',
    icon: '🔧'
  },
  {
    key: 'utilities',
    label: 'Suministros',
    type: 'expense',
    category: 'utilities',
    icon: '⚡'
  }
];
