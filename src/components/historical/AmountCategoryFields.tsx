
import React from 'react';
import { HistoricalEntry } from '@/types/historical';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { expenseCategories, incomeCategories } from './constants';

interface AmountCategoryFieldsProps {
  type: HistoricalEntry['type'];
  amount: number;
  category: HistoricalEntry['category'];
  onAmountChange: (amount: number) => void;
  onCategoryChange: (category: HistoricalEntry['category']) => void;
  amountError?: string;
}

const AmountCategoryFields: React.FC<AmountCategoryFieldsProps> = ({
  type,
  amount,
  category,
  onAmountChange,
  onCategoryChange,
  amountError
}) => {
  if (type !== 'income' && type !== 'expense') {
    return null;
  }

  const categories = type === 'expense' ? expenseCategories : incomeCategories;
  
  // Ensure we have a valid category value, fallback to first category if empty/undefined
  const validCategory = category && category.trim() !== '' ? category : categories[0]?.value || 'other';

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="amount">Importe (€) *</Label>
        <Input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
        />
        {amountError && <p className="text-sm text-red-500">{amountError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select value={validCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value || 'other'}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default AmountCategoryFields;
