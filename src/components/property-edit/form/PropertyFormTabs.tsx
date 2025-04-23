
import React from 'react';
import { Property } from '@/types/property';
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
  updateContactDetails
}: PropertyFormTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="basic">Información Básica</TabsTrigger>
        <TabsTrigger value="tenants">Inquilinos</TabsTrigger>
        <TabsTrigger value="contacts">Contactos</TabsTrigger>
        <TabsTrigger value="finances">Finanzas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <BasicInfoTab 
          property={property}
          imageInputRef={imageInputRef}
          handleImageUpload={handleImageUpload}
          handleImageChange={handleImageChange}
          setProperty={setProperty}
        />
      </TabsContent>

      <TabsContent value="tenants">
        <TenantsTab
          property={property}
          addTenant={addTenant}
          updateTenant={updateTenant}
          removeTenant={removeTenant}
        />
      </TabsContent>

      <TabsContent value="contacts">
        <ContactsTab
          property={property}
          updateContactDetails={updateContactDetails}
        />
      </TabsContent>

      <TabsContent value="finances">
        <FinancesTab
          property={property}
          setProperty={setProperty}
          calculateTotalExpenses={calculateTotalExpenses}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PropertyFormTabs;

