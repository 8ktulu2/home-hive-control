
import React from 'react';
import { Property, Tenant } from '@/types/property';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from '../BasicInfoTab';
import TenantsTab from '../TenantsTab';
import ContactsTab from '../ContactsTab';
import FinancesTab from '../FinancesTab';
import UtilitiesTab from '../UtilitiesTab';
import TaxInfoTab from '../TaxInfoTab';
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
      <div className="w-full mb-6 overflow-visible">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto gap-1">
          <TabsTrigger value="basic" className="py-2 text-xs md:text-sm">Información Básica</TabsTrigger>
          <TabsTrigger value="tenants" className="py-2 text-xs md:text-sm">Inquilinos</TabsTrigger>
          <TabsTrigger value="utilities" className="py-2 text-xs md:text-sm">Suministros</TabsTrigger>
          <TabsTrigger value="contacts" className="py-2 text-xs md:text-sm">Contactos</TabsTrigger>
          <TabsTrigger value="finances" className="py-2 text-xs md:text-sm">Finanzas</TabsTrigger>
          <TabsTrigger value="taxinfo" className="py-2 text-xs md:text-sm">Datos Fiscales</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="basic" className="mt-2">
        <BasicInfoTab 
          property={property}
          imageInputRef={imageInputRef}
          handleImageUpload={handleImageUpload}
          handleImageChange={handleImageChange}
          setProperty={setProperty}
        />
      </TabsContent>

      <TabsContent value="tenants" className="mt-2">
        <TenantsTab
          property={property}
          addTenant={addTenant}
          updateTenant={updateTenant}
          removeTenant={removeTenant}
        />
      </TabsContent>
      
      <TabsContent value="utilities" className="mt-2">
        <UtilitiesTab
          property={property}
          setProperty={setProperty}
        />
      </TabsContent>

      <TabsContent value="contacts" className="mt-2">
        <ContactsTab
          property={property}
          updateContactDetails={updateContactDetails}
        />
      </TabsContent>

      <TabsContent value="finances" className="mt-2">
        <FinancesTab
          property={property}
          setProperty={setProperty}
          calculateTotalExpenses={calculateTotalExpenses}
          updateInsuranceCompany={updateInsuranceCompany}
        />
      </TabsContent>
      
      <TabsContent value="taxinfo" className="mt-2">
        <TaxInfoTab
          property={property}
          setProperty={setProperty}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PropertyFormTabs;
