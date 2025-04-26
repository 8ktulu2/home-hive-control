
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
          <p className="text-sm font-medium">Gastos de Comunidad</p>
          <p className="text-sm text-muted-foreground">
            {property.communityFee ? formatCurrency(property.communityFee) + '/año' : 'No especificado'}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <FileBarChart className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">IBI</p>
          <p className="text-sm text-muted-foreground">
            {property.ibi ? formatCurrency(property.ibi) + '/año' : 'No especificado'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityTab;
