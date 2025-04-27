
import { Search, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PropertyGridHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onDeleteClick: () => void;
}

const PropertyGridHeader = ({
  searchTerm,
  onSearchChange,
  selectedCount,
  onDeleteClick,
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
      {selectedCount > 0 && (
        <Button 
          variant="destructive"
          onClick={onDeleteClick}
          className="flex items-center gap-2"
          data-delete-properties
        >
          <Trash className="h-4 w-4" />
          <span>Eliminar ({selectedCount})</span>
        </Button>
      )}
    </div>
  );
};

export default PropertyGridHeader;

