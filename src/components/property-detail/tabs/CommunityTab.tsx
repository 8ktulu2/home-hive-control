
import { Property } from '@/types/property';
import { Building, FileBarChart } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface CommunityTabProps {
  property: Property;
}

const CommunityTab = ({ property }: CommunityTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Gastos de Comunidad Anual</p>
          <p className="text-sm text-muted-foreground">
            {property.communityFee ? formatCurrency(property.communityFee) : 'No especificado'}
          </p>
        </div>
      </div>
      
      <div className="flex items-start gap-2">
        <FileBarChart className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Gastos Mensuales</p>
          <p className="text-sm text-muted-foreground">
            {property.communityFee ? formatCurrency(property.communityFee / 12) : '€0,00'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityTab;
