import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Property, Tenant, ContactDetails, Utility } from '@/types/property';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { usePropertyImage } from '@/hooks/usePropertyImage';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import PropertyFormHeader from '@/components/property-edit/PropertyFormHeader';
import PropertyEditLoading from '@/components/property-edit/PropertyEditLoading';
import PropertyEditError from '@/components/property-edit/PropertyEditError';
import PropertyFormTabs from '@/components/property-edit/form/PropertyFormTabs';
import PropertyFormActions from '@/components/property-edit/form/PropertyFormActions';
import { calculateTotalExpenses } from '@/utils/expenseCalculations';
import { v4 as uuidv4 } from 'uuid';

const PropertyEdit = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('basic');
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const { property, setProperty, loading, isNewProperty } = usePropertyLoader(id);
  const { updatePropertyImage } = usePropertyManagement(property);
  
  // Use the extracted calculateTotalExpenses function
  const calculatePropertyExpenses = () => {
    if (!property) return 0;
    return calculateTotalExpenses(property);
  };

  const { handleImageUpload, handleImageChange } = usePropertyImage(
    property,
    imageInputRef,
    updatePropertyImage
  );

  const { handleSubmit } = usePropertyForm(property, calculatePropertyExpenses);

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

  const addOtherUtility = () => {
    if (property) {
      const newUtility: Utility = {
        id: uuidv4(),
        name: '',
      };
      
      setProperty({
        ...property,
        otherUtilities: [...(property.otherUtilities || []), newUtility]
      });
    }
  };

  const updateContactDetails = (
    type: 'communityManager' | 'waterProvider' | 'electricityProvider' | 'insuranceCompany' | 'gasProvider' | 'internetProvider', 
    field: string, 
    value: string
  ) => {
    if (property) {
      let detailsField: keyof Property;
      let providerField: keyof Property | undefined;
      
      // Map the type to the correct property field name
      switch (type) {
        case 'insuranceCompany':
          detailsField = 'insuranceDetails';
          providerField = 'insuranceCompany';
          break;
        case 'communityManager':
          detailsField = 'communityManagerDetails';
          providerField = 'communityManager';
          break;
        case 'waterProvider':
          detailsField = 'waterProviderDetails';
          providerField = 'waterProvider';
          break;
        case 'electricityProvider':
          detailsField = 'electricityProviderDetails';
          providerField = 'electricityProvider';
          break;
        case 'gasProvider':
          detailsField = 'gasProviderDetails';
          providerField = 'gasProvider';
          break;
        case 'internetProvider':
          detailsField = 'internetProviderDetails';
          providerField = 'internetProvider';
          break;
        default:
          detailsField = `${type}Details` as keyof Property;
      }
      
      const currentDetails = property[detailsField] as ContactDetails || {};
      
      if (field === 'name' && providerField) {
        setProperty({
          ...property,
          [providerField]: value,
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
      <div className="max-w-full overflow-hidden">
        <PropertyFormHeader isNewProperty={isNewProperty} propertyName={property.name || 'Nueva propiedad'} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <PropertyFormTabs
            property={property}
            setProperty={setProperty}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            imageInputRef={imageInputRef}
            handleImageUpload={handleImageUpload}
            handleImageChange={handleImageChange}
            calculateTotalExpenses={calculatePropertyExpenses}
            addTenant={addTenant}
            updateTenant={updateTenant}
            removeTenant={removeTenant}
            updateContactDetails={updateContactDetails}
            updateInsuranceCompany={updateInsuranceCompany}
            addOtherUtility={addOtherUtility}
          />

          <PropertyFormActions isNewProperty={isNewProperty} />
        </form>
      </div>
    </Layout>
  );
};

export default PropertyEdit;
