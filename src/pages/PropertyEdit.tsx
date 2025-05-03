import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Property, Tenant, ContactDetails } from '@/types/property';
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
  const { updatePropertyImage } = usePropertyManagement(property);
  
  const calculateTotalExpenses = () => {
    let total = 0;
    if (property) {
      // Include all possible expenses in calculation
      if (property.mortgage?.monthlyPayment) total += property.mortgage.monthlyPayment;
      if (property.ibi) total += property.ibi / 12; // Monthly equivalent of annual IBI
      if (property.homeInsurance?.cost) total += property.homeInsurance.cost / 12; // Monthly equivalent
      if (property.lifeInsurance?.cost) total += property.lifeInsurance.cost / 12; // Monthly equivalent
      if (property.communityFee) total += property.communityFee / 12; // Monthly equivalent of annual community fee
      
      // Additional monthly expenses
      if (property.monthlyExpenses) {
        property.monthlyExpenses.forEach(expense => {
          if (!expense.isPaid) total += expense.amount;
        });
      }
    }
    return parseFloat(total.toFixed(2)); // Round to 2 decimal places for currency
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
      let detailsField: keyof Property;
      
      // Map the type to the correct property field name
      switch (type) {
        case 'insuranceCompany':
          detailsField = 'insuranceDetails';
          break;
        case 'communityManager':
          detailsField = 'communityManagerDetails';
          break;
        case 'waterProvider':
          detailsField = 'waterProviderDetails';
          break;
        case 'electricityProvider':
          detailsField = 'electricityProviderDetails';
          break;
        default:
          detailsField = `${type}Details` as keyof Property;
      }
      
      const currentDetails = property[detailsField] as ContactDetails || {};
      
      if (field === 'name') {
        setProperty({
          ...property,
          [type]: value,
          [detailsField]: currentDetails
        });
      } else {
        setProperty({
          ...property,
          [detailsField]: {
            ...currentDetails,
            [field]: value
          }
        });
      }
    }
  };

  if (loading) return <PropertyEditLoading />;
  if (!property) return <PropertyEditError />;

  return (
    <Layout>
      <div className="max-w-full overflow-x-hidden">
        <PropertyFormHeader isNewProperty={isNewProperty} propertyName={property.name || 'Nueva propiedad'} />

        <form onSubmit={handleSubmit} className="space-y-6 overflow-visible">
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
      </div>
    </Layout>
  );
};

export default PropertyEdit;
