
import React from 'react';
import { HistoricalEntry } from '@/types/historical';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Euro, Calendar, FileText } from 'lucide-react';

interface TypeSelectorProps {
  value: HistoricalEntry['type'];
  onChange: (value: HistoricalEntry['type']) => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Tipo de Registro</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="income">
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-green-600" />
              Ingreso
            </div>
          </SelectItem>
          <SelectItem value="expense">
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-red-600" />
              Gasto
            </div>
          </SelectItem>
          <SelectItem value="occupancy">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Estado de Ocupación
            </div>
          </SelectItem>
          <SelectItem value="incident">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-600" />
              Incidencia
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TypeSelector;
