
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { months } from './constants';

interface DateSelectorProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  month,
  year,
  onMonthChange,
  onYearChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="month">Mes</Label>
        <Select value={month.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((monthName, index) => (
              <SelectItem key={index} value={index.toString()}>
                {monthName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Año</Label>
        <Input
          type="number"
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          min="2000"
          max={new Date().getFullYear()}
        />
      </div>
    </div>
  );
};

export default DateSelector;
