
import React, { useState } from 'react';
import { Property, Tenant, InventoryItem } from '@/types/property';
import PropertyInfo from './PropertyInfo';
import FinancialSection from './finances/FinancialSection';
import TaxReportTab from './property-info/TaxReportTab';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Euro } from 'lucide-react';

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
            value="tax" 
            className="flex items-center gap-2"
            data-state={activeTab === 'tax' ? 'active' : ''}
          >
            <Euro className="h-4 w-4" />
            Informe Fiscal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6 mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PropertyInfo property={property} />
            <FinancialSection property={property} setProperty={setProperty} />
          </div>
        </TabsContent>

        <TabsContent value="tax" className="mt-2">
          <TaxReportTab property={property} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MainContent;
