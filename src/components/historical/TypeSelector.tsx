
import React from 'react';
import { HistoricalEntry } from '@/types/historical';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Euro, Calendar, FileText } from 'lucide-react';

interface TypeSelectorProps {
  value: HistoricalEntry['type'];
  onChange: (value: HistoricalEntry['type']) => void;
}

const typeOptions = [
  { value: 'income', label: 'Ingreso', icon: Euro, color: 'text-green-600' },
  { value: 'expense', label: 'Gasto', icon: Euro, color: 'text-red-600' },
  { value: 'occupancy', label: 'Estado de Ocupación', icon: Calendar, color: 'text-blue-600' },
  { value: 'incident', label: 'Incidencia', icon: FileText, color: 'text-orange-600' }
] as const;

const TypeSelector: React.FC<TypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Tipo de Registro</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map(option => {
            const IconComponent = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <IconComponent className={`h-4 w-4 ${option.color}`} />
                  {option.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TypeSelector;
