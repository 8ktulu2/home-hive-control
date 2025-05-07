
import { Badge } from '@/components/ui/badge';

export const expenseCategories = [
  { id: 'suministros', name: 'Suministros' },
  { id: 'comunidad', name: 'Comunidad' },
  { id: 'impuestos', name: 'Impuestos' },
  { id: 'mantenimiento', name: 'Mantenimiento' },
  { id: 'seguro', name: 'Seguros' },
  { id: 'hipoteca', name: 'Hipoteca' },
  { id: 'conservacion', name: 'Conservación' },
  { id: 'reparaciones', name: 'Reparaciones' },
  { id: 'formalizacion', name: 'Formalización de Contrato' },
  { id: 'juridicos', name: 'Defensa Jurídica' },
  { id: 'administrativos', name: 'Administrativos' },
  { id: 'amortizacion', name: 'Amortización' },
  { id: 'otros', name: 'Otros' }
];

export const getCategoryBadge = (category: string) => {
  const colors = {
    suministros: 'bg-blue-100 text-blue-800',
    comunidad: 'bg-green-100 text-green-800',
    impuestos: 'bg-red-100 text-red-800',
    mantenimiento: 'bg-yellow-100 text-yellow-800',
    seguro: 'bg-purple-100 text-purple-800',
    hipoteca: 'bg-pink-100 text-pink-800',
    conservacion: 'bg-amber-100 text-amber-800',
    reparaciones: 'bg-orange-100 text-orange-800',
    formalizacion: 'bg-indigo-100 text-indigo-800',
    juridicos: 'bg-rose-100 text-rose-800',
    administrativos: 'bg-cyan-100 text-cyan-800',
    amortizacion: 'bg-lime-100 text-lime-800',
    otros: 'bg-gray-100 text-gray-800'
  };
  
  const categoryName = expenseCategories.find(c => c.id === category)?.name || 'Otro';
  const colorClass = colors[category as keyof typeof colors] || colors.otros;
  
  return (
    <Badge variant="outline" className={`text-xs font-normal ${colorClass}`}>
      {categoryName}
    </Badge>
  );
};
