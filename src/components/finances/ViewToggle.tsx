
import { Button } from '@/components/ui/button';
import { Building, Filter } from 'lucide-react';

interface ViewToggleProps {
  showAllProperties: boolean;
  onToggleView: (showAll: boolean) => void;
}

const ViewToggle = ({ showAllProperties, onToggleView }: ViewToggleProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={showAllProperties ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => onToggleView(true)}
      >
        <Building className="h-4 w-4" />
        <span>Todas las propiedades</span>
      </Button>
      <Button
        variant={!showAllProperties ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => onToggleView(false)}
      >
        <Filter className="h-4 w-4" />
        <span>Por propiedad</span>
      </Button>
    </div>
  );
};

export default ViewToggle;
