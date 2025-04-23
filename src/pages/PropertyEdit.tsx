
import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { Property, Tenant } from '@/types/property';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { usePropertyImage } from '@/hooks/usePropertyImage';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import PropertyFormHeader from '@/components/property-edit/PropertyFormHeader';
import PropertyEditLoading from '@/components/property-edit/PropertyEditLoading';
import PropertyEditError from '@/components/property-edit/PropertyEditError';
import PropertyFormTabs from '@/components/property-edit/form/PropertyFormTabs';
import PropertyFormActions from '@/components/property-edit/form/PropertyFormActions';

const PropertyEdit = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('basic');
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const { property, setProperty, loading, isNewProperty } = usePropertyLoader(id);
  const { createNewProperty, updatePropertyImage } = usePropertyManagement(property);
  
  const calculateTotalExpenses = () => {
    let total = 0;
    if (property) {
      if (property.mortgage?.monthlyPayment) total += property.mortgage.monthlyPayment;
      if (property.ibi) total += property.ibi / 12;
      if (property.homeInsurance?.cost) total += property.homeInsurance.cost / 12;
      if (property.lifeInsurance?.cost) total += property.lifeInsurance.cost / 12;
      if (property.monthlyExpenses) {
        property.monthlyExpenses.forEach(expense => {
          if (!expense.isPaid) total += expense.amount;
        });
      }
    }
    return total;
  };

  const { handleImageUpload, handleImageChange } = usePropertyImage(
    property,
    imageInputRef,
    updatePropertyImage
  );

  const { handleSubmit } = usePropertyForm(property, calculateTotalExpenses);

  const addTenant = () => {
    if (property) {
      const newTenant: Tenant = {
        id: `tenant-${Date.now()}`,
        name: '',
      };
      setProperty({
        ...property,
        tenants: [...(property.tenants || []), newTenant],
      });
    }
  };

  const updateTenant = (index: number, field: keyof Tenant, value: string) => {
    if (property && property.tenants) {
      const updatedTenants = [...property.tenants];
      updatedTenants[index] = { 
        ...updatedTenants[index], 
        [field]: value 
      };
      setProperty({
        ...property,
        tenants: updatedTenants
      });
    }
  };

  const removeTenant = (index: number) => {
    if (property && property.tenants) {
      const updatedTenants = [...property.tenants];
      updatedTenants.splice(index, 1);
      setProperty({
        ...property,
        tenants: updatedTenants
      });
    }
  };

  const updateInsuranceCompany = (value: string) => {
    if (property) {
      setProperty({
        ...property,
        insuranceCompany: value
      });
    }
  };

  const updateContactDetails = (type: 'communityManager' | 'waterProvider' | 'electricityProvider' | 'insuranceCompany', field: string, value: string) => {
    if (property) {
      const detailsField = `${type}Details` as keyof Property;
      const currentDetails = property[detailsField] as any || {};
      
      const updatedDetails = {
        ...currentDetails,
        [field]: value
      };

      setProperty({
        ...property,
        [type]: field === 'name' ? value : property[type],
        [detailsField]: updatedDetails
      });
    }
  };

  if (loading) return <PropertyEditLoading />;
  if (!property) return <PropertyEditError />;

  return (
    <Layout>
      <PropertyFormHeader isNewProperty={isNewProperty} propertyName={property.name} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <PropertyFormTabs
          property={property}
          setProperty={setProperty}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          imageInputRef={imageInputRef}
          handleImageUpload={handleImageUpload}
          handleImageChange={handleImageChange}
          calculateTotalExpenses={calculateTotalExpenses}
          addTenant={addTenant}
          updateTenant={updateTenant}
          removeTenant={removeTenant}
          updateContactDetails={updateContactDetails}
          updateInsuranceCompany={updateInsuranceCompany}
        />

        <PropertyFormActions isNewProperty={isNewProperty} />
      </form>
    </Layout>
  );
};

export default PropertyEdit;
