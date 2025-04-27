
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface YearNavigatorProps {
  selectedYear: number;
  onPreviousYear: () => void;
  onNextYear: () => void;
}

const YearNavigator = ({ selectedYear, onPreviousYear, onNextYear }: YearNavigatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousYear}
        className="bg-transparent border-[#8E9196] text-white hover:bg-[#292F3F] hover:text-white"
      >
        &lt;
      </Button>
      <div className="flex items-center gap-2 bg-[#292F3F] px-3 py-1 rounded-md">
        <Calendar className="h-4 w-4 text-[#E5DEFF]" />
        <span className="font-medium text-[#E5DEFF]">Ejercicio Fiscal {selectedYear}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onNextYear}
        className="bg-transparent border-[#8E9196] text-white hover:bg-[#292F3F] hover:text-white"
      >
        &gt;
      </Button>
    </div>
  );
};

export default YearNavigator;
