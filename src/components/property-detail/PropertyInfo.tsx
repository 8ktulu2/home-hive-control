
import { Property, Tenant, InventoryItem } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import PropertyInfoTabs from './property-info/PropertyInfoTabs';
import { useState } from 'react';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property: initialProperty }: PropertyInfoProps) => {
  const [activeTab, setActiveTab] = useState('general');
  
  const handleTenantClick = (tenant: Tenant) => {
    // Handle tenant click event in the future
  };

  const handleContactClick = (title: string, details: any) => {
    // Handle contact click event in the future 
  };

  const handleAddInventoryClick = () => {
    // Handle adding inventory item in the future
  };

  const handleEditInventoryItem = (item: InventoryItem) => {
    // Handle editing inventory item in the future
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    // Handle deleting inventory item in the future
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span className="truncate">Información General</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <PropertyInfoTabs 
          property={initialProperty} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTenantClick={handleTenantClick}
          onContactClick={handleContactClick}
          onAddInventoryClick={handleAddInventoryClick}
          onEditInventoryItem={handleEditInventoryItem}
          onDeleteInventoryItem={handleDeleteInventoryItem}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyInfo;
