
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CategoryValues {
  alquiler: number;
  hipoteca: number;
  comunidad: number;
  ibi: number;
  seguroVida: number;
  seguroHogar: number;
  compras: number;
  averias: number;
  suministros: number;
}

interface CategoriesInputProps {
  categoryValues: CategoryValues;
  onCategoryChange: (category: keyof CategoryValues, value: string) => void;
}

const categories = [
  { key: 'alquiler', label: 'Alquiler', icon: '🏠', type: 'income' },
  { key: 'hipoteca', label: 'Hipoteca', icon: '🏦', type: 'expense' },
  { key: 'comunidad', label: 'Comunidad', icon: '🏢', type: 'expense' },
  { key: 'ibi', label: 'IBI', icon: '📄', type: 'expense' },
  { key: 'seguroVida', label: 'Seguro de Vida', icon: '💼', type: 'expense' },
  { key: 'seguroHogar', label: 'Seguro de Hogar', icon: '🛡️', type: 'expense' },
  { key: 'compras', label: 'Compras', icon: '🛒', type: 'expense' },
  { key: 'averias', label: 'Averías', icon: '🔧', type: 'expense' },
  { key: 'suministros', label: 'Suministros', icon: '⚡', type: 'expense' }
];

const CategoriesInput: React.FC<CategoriesInputProps> = ({
  categoryValues,
  onCategoryChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Valores de Categorías</CardTitle>
        <p className="text-sm text-muted-foreground">
          Introduce los valores y haz clic en un mes para guardar
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map(category => (
          <div key={category.key} className="space-y-2">
            <Label className="flex items-center gap-2">
              <span className={category.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                {category.icon}
              </span>
              {category.label}
            </Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={categoryValues[category.key as keyof CategoryValues] || ''}
              onChange={(e) => onCategoryChange(category.key as keyof CategoryValues, e.target.value)}
              placeholder="0.00"
              className="text-right"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoriesInput;
