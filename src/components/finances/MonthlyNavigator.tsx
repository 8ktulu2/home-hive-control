
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MonthlyNavigatorProps {
  selectedMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const MonthlyNavigator = ({ selectedMonth, onPreviousMonth, onNextMonth }: MonthlyNavigatorProps) => {
  const formattedMonth = format(selectedMonth, 'MMMM yyyy', { locale: es });

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousMonth}
      >
        &lt;
      </Button>
      <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-md">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{formattedMonth}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onNextMonth}
      >
        &gt;
      </Button>
    </div>
  );
};

export default MonthlyNavigator;
