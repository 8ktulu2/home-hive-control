
import React from 'react';
import { Property, Tenant } from '@/types/property';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from '../BasicInfoTab';
import TenantsTab from '../TenantsTab';
import ContactsTab from '../ContactsTab';
import FinancesTab from '../FinancesTab';
import { RefObject } from 'react';

interface PropertyFormTabsProps {
  property: Property;
  setProperty: (property: Property) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  imageInputRef: RefObject<HTMLInputElement>;
  handleImageUpload: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  calculateTotalExpenses: () => number;
  addTenant: () => void;
  updateTenant: (index: number, field: keyof Tenant, value: string) => void;
  removeTenant: (index: number) => void;
  updateContactDetails: (type: 'communityManager' | 'waterProvider' | 'electricityProvider' | 'insuranceCompany', field: string, value: string) => void;
  updateInsuranceCompany: (value: string) => void;
}

const PropertyFormTabs = ({
  property,
  setProperty,
  activeTab,
  setActiveTab,
  imageInputRef,
  handleImageUpload,
  handleImageChange,
  calculateTotalExpenses,
  addTenant,
  updateTenant,
  removeTenant,
  updateContactDetails,
  updateInsuranceCompany
}: PropertyFormTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="w-full overflow-x-auto pb-2">
        <TabsList className="mb-6 w-full h-auto">
          <TabsTrigger value="basic" className="py-2">Información Básica</TabsTrigger>
          <TabsTrigger value="tenants" className="py-2">Inquilinos</TabsTrigger>
          <TabsTrigger value="contacts" className="py-2">Contactos</TabsTrigger>
          <TabsTrigger value="finances" className="py-2">Finanzas</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="basic" className="mt-2 overflow-x-visible">
        <BasicInfoTab 
          property={property}
          imageInputRef={imageInputRef}
          handleImageUpload={handleImageUpload}
          handleImageChange={handleImageChange}
          setProperty={setProperty}
        />
      </TabsContent>

      <TabsContent value="tenants" className="mt-2 overflow-x-visible">
        <TenantsTab
          property={property}
          addTenant={addTenant}
          updateTenant={updateTenant}
          removeTenant={removeTenant}
        />
      </TabsContent>

      <TabsContent value="contacts" className="mt-2 overflow-x-visible">
        <ContactsTab
          property={property}
          updateContactDetails={updateContactDetails}
        />
      </TabsContent>

      <TabsContent value="finances" className="mt-2 overflow-x-visible">
        <FinancesTab
          property={property}
          setProperty={setProperty}
          calculateTotalExpenses={calculateTotalExpenses}
          updateInsuranceCompany={updateInsuranceCompany}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PropertyFormTabs;
