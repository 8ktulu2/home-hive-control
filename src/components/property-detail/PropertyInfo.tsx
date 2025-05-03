
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import PropertyInfoTabs from './property-info/PropertyInfoTabs';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property: initialProperty }: PropertyInfoProps) => {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span className="truncate">Información General</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <PropertyInfoTabs property={initialProperty} />
      </CardContent>
    </Card>
  );
};

export default PropertyInfo;
