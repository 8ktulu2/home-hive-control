
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PropertyGridHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onDeleteClick: () => void;
}

const PropertyGridHeader = ({
  searchTerm,
  onSearchChange,
}: PropertyGridHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar propiedades..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};

export default PropertyGridHeader;
