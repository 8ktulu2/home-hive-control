
import React, { useState } from 'react';
import { Property, Tenant, InventoryItem } from '@/types/property';
import PropertyInfo from './PropertyInfo';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Euro } from 'lucide-react';
import CombinedFinancesTab from './finances/CombinedFinancesTab';

interface MainContentProps {
  property: Property;
  setProperty: (property: Property) => void;
}

const MainContent = ({ property, setProperty }: MainContentProps) => {
  const [activeTab, setActiveTab] = useState<string>('info');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="lg:col-span-3"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger 
            value="info" 
            className="flex items-center gap-2"
            data-state={activeTab === 'info' ? 'active' : ''}
          >
            <FileText className="h-4 w-4" />
            Información del Inmueble
          </TabsTrigger>
          <TabsTrigger 
            value="finances" 
            className="flex items-center gap-2"
            data-state={activeTab === 'finances' ? 'active' : ''}
          >
            <Euro className="h-4 w-4" />
            Finanzas e Informe Fiscal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6 mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PropertyInfo property={property} />
          </div>
        </TabsContent>

        <TabsContent value="finances" className="mt-2">
          <CombinedFinancesTab property={property} setProperty={setProperty} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MainContent;
