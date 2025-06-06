
import React, { useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { usePropertyImage } from '@/hooks/usePropertyImage';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import { calculateTotalExpenses } from '@/utils/expenseCalculations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import PropertyFormHeader from './PropertyFormHeader';
import PropertyEditLoading from './PropertyEditLoading';
import PropertyEditError from './PropertyEditError';
import PropertyFormTabs from './form/PropertyFormTabs';
import PropertyFormActions from './form/PropertyFormActions';
import { usePropertyState } from './hooks/usePropertyState';
import { usePropertyHandlers } from './hooks/usePropertyHandlers';

const PropertyEditContainer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const historicalYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
  
  const [activeTab, setActiveTab] = useState('basic');
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const { property: baseProperty, loading, isNewProperty } = usePropertyLoader(id);
  const { property, setProperty } = usePropertyState(baseProperty, historicalYear, id);

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
      {/* Historical mode warning */}
      {historicalYear && (
        <Alert className="bg-yellow-50 border-yellow-200 mb-4">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 text-sm">
            <strong>Editando Histórico {historicalYear}</strong> - Todos los cambios se aplicarán únicamente al año {historicalYear}
          </AlertDescription>
        </Alert>
      )}

      <PropertyFormHeader 
        isNewProperty={isNewProperty} 
        propertyName={property.name || 'Nueva propiedad'}
        historicalYear={historicalYear}
      />

      <form onSubmit={handleSubmit} className={`space-y-6 ${
        historicalYear ? 'bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4' : ''
      }`}>
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
          historicalYear={historicalYear}
        />

        <PropertyFormActions 
          isNewProperty={isNewProperty} 
          historicalYear={historicalYear}
        />
      </form>
    </div>
  );
};

export default PropertyEditContainer;
