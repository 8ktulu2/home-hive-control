
import { Property, Tenant, ContactDetails, InventoryItem } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyInfoTabs from './property-info/PropertyInfoTabs';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property: initialProperty }: PropertyInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span>Información General</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PropertyInfoTabs property={initialProperty} />
      </CardContent>
    </Card>
  );
};

export default PropertyInfo;
