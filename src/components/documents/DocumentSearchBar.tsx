
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DocumentSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const DocumentSearchBar = ({ searchTerm, onSearchChange }: DocumentSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar documentos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};
