
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { usePropertyImage } from '@/hooks/usePropertyImage';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import { calculateTotalExpenses } from '@/utils/expenseCalculations';
import PropertyFormHeader from '../PropertyFormHeader';
import PropertyEditLoading from '../PropertyEditLoading';
import PropertyEditError from '../PropertyEditError';
import PropertyFormTabs from '../form/PropertyFormTabs';
import HistoricalPropertyFormActions from './HistoricalPropertyFormActions';
import { useHistoricalPropertyState } from '@/components/property-detail/historical/hooks/useHistoricalPropertyState';
import { usePropertyHandlers } from '../hooks/usePropertyHandlers';

const HistoricalPropertyEditContainer = () => {
  const { id, year } = useParams();
  const historicalYear = year ? parseInt(year) : new Date().getFullYear();
  
  const [activeTab, setActiveTab] = useState('basic');
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const { property: baseProperty, loading, isNewProperty } = usePropertyLoader(id);
  const { property, setProperty } = useHistoricalPropertyState(baseProperty, historicalYear);

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

  const { handleSubmit } = usePropertyForm(property, calculatePropertyExpenses, historicalYear);

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
    <div 
      className="max-w-full overflow-hidden min-h-screen"
      style={{ 
        background: 'linear-gradient(to bottom, #fefce8, #fef3c7)',
      }}
    >
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg p-3 shadow-md">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-yellow-900 bg-yellow-200 px-2 py-1 rounded">
              EDITANDO HISTÓRICO: {historicalYear}
            </span>
            <span className="text-yellow-700">|</span>
            <span className="font-medium text-yellow-800">{property.name}</span>
          </div>
        </div>

        <PropertyFormHeader 
          isNewProperty={false} 
          propertyName={`${property.name} (Histórico ${historicalYear})`}
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

          <HistoricalPropertyFormActions 
            historicalYear={historicalYear}
            propertyId={property.id}
          />
        </form>
      </div>
    </div>
  );
};

export default HistoricalPropertyEditContainer;
