
import { FolderOpen, FileText, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const DocumentCategories = ({ activeCategory, onCategoryChange }: DocumentCategoriesProps) => {
  const categories = [
    { id: 'all', name: 'Todos', icon: <FolderOpen className="h-4 w-4" /> },
    { id: 'tenant-contract', name: 'Contratos de Alquiler', icon: <FileText className="h-4 w-4" /> },
    { id: 'supply-contract', name: 'Contratos de Suministros', icon: <FileText className="h-4 w-4" /> },
    { id: 'insurance', name: 'Contratos de Seguros', icon: <FileText className="h-4 w-4" /> },
    { id: 'invoice', name: 'Facturas', icon: <FileText className="h-4 w-4" /> },
    { id: 'other', name: 'Otros', icon: <Folder className="h-4 w-4" /> }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
      {categories.map(category => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          className="flex items-center gap-2 justify-center"
          onClick={() => onCategoryChange(category.id)}
        >
          {category.icon}
          <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
            {category.name}
          </span>
        </Button>
      ))}
    </div>
  );
};
