
export interface InventoryItem {
  id: string;
  type: 'furniture' | 'appliance' | 'other';
  name: string;
  condition: 'new' | 'good' | 'fair' | 'poor';
  acquisitionDate?: string;
  price?: number;
  notes?: string;
  purchaseDate?: string;
  cost?: number;
}
