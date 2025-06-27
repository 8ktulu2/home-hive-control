
export interface InventoryItem {
  id: string;
  type: 'furniture' | 'appliance' | 'other';
  name: string;
  condition: 'new' | 'good' | 'fair' | 'poor';
  acquisitionDate?: string;
  price?: number; // Add price field
  notes?: string;
}
