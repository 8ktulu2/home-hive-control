
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { usePropertyImage } from '@/hooks/usePropertyImage';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import { calculateTotalExpenses } from '@/utils/expenseCalculations';
import PropertyFormHeader from './PropertyFormHeader';
import PropertyEditLoading from './PropertyEditLoading';
import PropertyEditError from './PropertyEditError';
import PropertyFormTabs from './form/PropertyFormTabs';
import PropertyFormActions from './form/PropertyFormActions';
import { usePropertyState } from './hooks/usePropertyState';
import { usePropertyHandlers } from './hooks/usePropertyHandlers';

const PropertyEditContainer = () => {
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState('basic');
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const { property: baseProperty, loading, isNewProperty } = usePropertyLoader(id);
  const { property, setProperty } = usePropertyState(baseProperty, undefined, id);

  const { updatePropertyImage } = usePropertyManagement(property);
  
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

  const {
    addTenant,
    updateTenant,
    removeTenant,
    updateInsuranceCompany,
    addOtherUtility,
    updateContactDetails
  } = usePropertyHandlers(property, setProperty);

  if (loading) return <PropertyEditLoading />;
  if (!property) return <PropertyEditError />;

  return (
    <div className="max-w-full overflow-hidden">
      <PropertyFormHeader 
        isNewProperty={isNewProperty} 
        propertyName={property.name || 'Nueva propiedad'}
      />

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
  );
};

export default PropertyEditContainer;
