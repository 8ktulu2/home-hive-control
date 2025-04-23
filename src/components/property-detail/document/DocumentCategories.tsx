
import { FolderOpen, FileText, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const DocumentCategories = ({ activeCategory, onCategoryChange }: DocumentCategoriesProps) => {
  const categories = [
    { id: 'all', name: 'Todos', icon: <FolderOpen className="h-4 w-4" /> },
    { id: 'tenant-contract', name: 'C. Alquiler', icon: <FileText className="h-4 w-4" /> },
    { id: 'supply-contract', name: 'C. Suministros', icon: <FileText className="h-4 w-4" /> },
    { id: 'insurance', name: 'C. Seguros', icon: <FileText className="h-4 w-4" /> },
    { id: 'invoice', name: 'Facturas', icon: <FileText className="h-4 w-4" /> },
    { id: 'other', name: 'Otros', icon: <Folder className="h-4 w-4" /> }
  ];

  return (
    <div className="grid grid-cols-3 gap-1 mb-4">
      {categories.map(category => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          className="flex items-center justify-center gap-1 px-2 h-9"
          onClick={() => onCategoryChange(category.id)}
          size="sm"
        >
          {category.icon}
          <span className="text-xs">{category.name}</span>
        </Button>
      ))}
    </div>
  );
};
