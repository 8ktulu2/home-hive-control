
import { Badge } from '@/components/ui/badge';

export const expenseCategories = [
  { id: 'utilities', name: 'Suministros' },
  { id: 'community', name: 'Comunidad' },
  { id: 'taxes', name: 'Impuestos' },
  { id: 'maintenance', name: 'Mantenimiento' },
  { id: 'insurance', name: 'Seguros' },
  { id: 'mortgage', name: 'Hipoteca' },
  { id: 'other', name: 'Otros' }
];

export const getCategoryBadge = (category: string) => {
  const colors = {
    utilities: 'bg-blue-100 text-blue-800',
    community: 'bg-green-100 text-green-800',
    taxes: 'bg-red-100 text-red-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    insurance: 'bg-purple-100 text-purple-800',
    mortgage: 'bg-pink-100 text-pink-800',
    other: 'bg-gray-100 text-gray-800'
  };
  
  const categoryName = expenseCategories.find(c => c.id === category)?.name || 'Otro';
  const colorClass = colors[category as keyof typeof colors] || colors.other;
  
  return (
    <Badge variant="outline" className={`text-xs font-normal ${colorClass}`}>
      {categoryName}
    </Badge>
  );
};
