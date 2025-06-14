
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
import { useYearMode } from '@/contexts/YearModeContext';

const HistoricalPropertyEditContainer = () => {
  const { id, year } = useParams();
  const historicalYear = year ? parseInt(year) : new Date().getFullYear();
  const { selectedYear, isHistoricalMode } = useYearMode();
  
  const [activeTab, setActiveTab] = useState('basic');
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const { property: baseProperty, loading, isNewProperty } = usePropertyLoader(id);
  const { historicalProperty, setHistoricalProperty } = useHistoricalPropertyState(baseProperty, historicalYear);

  const { updatePropertyImage } = usePropertyManagement(historicalProperty);
  
  const calculatePropertyExpenses = () => {
    if (!historicalProperty) return 0;
    return calculateTotalExpenses(historicalProperty);
  };

  const { handleImageUpload, handleImageChange } = usePropertyImage(
    historicalProperty,
    imageInputRef,
    updatePropertyImage
  );

  const { handleSubmit } = usePropertyForm(historicalProperty, calculatePropertyExpenses, historicalYear);

  const {
    addTenant,
    updateTenant,
    removeTenant,
    updateInsuranceCompany,
    addOtherUtility,
    updateContactDetails
  } = usePropertyHandlers(historicalProperty, setHistoricalProperty);

  if (loading) return <PropertyEditLoading />;
  if (!historicalProperty) return <PropertyEditError />;

  return (
    <div 
      className="max-w-full overflow-hidden min-h-screen"
      style={{ 
        background: isHistoricalMode 
          ? 'linear-gradient(to bottom, #fefce8, #fef3c7)' 
          : 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
      }}
    >
      <div className="max-w-7xl mx-auto p-4">
        {isHistoricalMode && (
          <div className="mb-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg p-3 shadow-md">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-yellow-900 bg-yellow-200 px-2 py-1 rounded">
                ⚠️ EDITANDO HISTÓRICO: {selectedYear}
              </span>
              <span className="text-yellow-700">|</span>
              <span className="font-medium text-yellow-800">{historicalProperty.name}</span>
              <span className="text-yellow-700">|</span>
              <span className="text-xs text-yellow-600">
                Los cambios NO afectarán el año actual
              </span>
            </div>
          </div>
        )}

        <PropertyFormHeader 
          isNewProperty={false} 
          propertyName={`${historicalProperty.name} ${isHistoricalMode ? `(Histórico ${selectedYear})` : ''}`}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <PropertyFormTabs
            property={historicalProperty}
            setProperty={setHistoricalProperty}
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
            propertyId={historicalProperty.id}
          />
        </form>
      </div>
    </div>
  );
};

export default HistoricalPropertyEditContainer;
