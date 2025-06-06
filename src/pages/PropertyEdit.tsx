import React, { useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Property, Tenant, ContactDetails, Utility } from '@/types/property';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { usePropertyImage } from '@/hooks/usePropertyImage';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import { useHistoricalDataIsolation } from '@/hooks/useHistoricalDataIsolation';
import PropertyFormHeader from '@/components/property-edit/PropertyFormHeader';
import PropertyEditLoading from '@/components/property-edit/PropertyEditLoading';
import PropertyEditError from '@/components/property-edit/PropertyEditError';
import PropertyFormTabs from '@/components/property-edit/form/PropertyFormTabs';
import PropertyFormActions from '@/components/property-edit/form/PropertyFormActions';
import { calculateTotalExpenses } from '@/utils/expenseCalculations';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const PropertyEdit = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const historicalYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
  
  const [activeTab, setActiveTab] = useState('basic');
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const { property: baseProperty, setProperty: setBaseProperty, loading, isNewProperty } = usePropertyLoader(id);
  const { getRecordsByPropertyYear } = useHistoricalStorage();
  const { getHistoricalInventory, getHistoricalTasks } = useHistoricalDataIsolation();
  
  // Create historical property if we're in historical mode
  const [property, setProperty] = useState<Property | null>(null);

  // Initialize property (historical or current)
  React.useEffect(() => {
    if (!baseProperty) return;

    if (historicalYear && id !== 'new') {
      // Create historical "ficha completa" - completely independent data for this year
      const records = getRecordsByPropertyYear(baseProperty.id, historicalYear);
      const historicalInventory = getHistoricalInventory(baseProperty.id, historicalYear);
      const historicalTasks = getHistoricalTasks(baseProperty.id, historicalYear);
      
      const historicalProperty: Property = {
        // Base reference data (immutable)
        id: baseProperty.id,
        name: baseProperty.name,
        address: baseProperty.address,
        image: baseProperty.image,
        
        // Historical financial data - ISOLATED FOR THIS YEAR
        rent: records.length > 0 ? records[0].categorias.alquiler : baseProperty.rent,
        rentPaid: false,
        
        // Historical mortgage - ISOLATED
        mortgage: records.length > 0 && records[0].categorias.hipoteca > 0 ? {
          ...baseProperty.mortgage,
          monthlyPayment: records[0].categorias.hipoteca
        } : baseProperty.mortgage,
        
        // Historical costs - ISOLATED
        communityFee: records.length > 0 ? records[0].categorias.comunidad : baseProperty.communityFee,
        ibi: records.length > 0 ? records[0].categorias.ibi * 12 : baseProperty.ibi,
        
        // Historical insurance - ISOLATED
        lifeInsurance: records.length > 0 ? {
          ...baseProperty.lifeInsurance,
          cost: records[0].categorias.seguroVida * 12
        } : baseProperty.lifeInsurance,
        homeInsurance: records.length > 0 ? {
          ...baseProperty.homeInsurance,
          cost: records[0].categorias.seguroHogar * 12
        } : baseProperty.homeInsurance,
        
        // Historical specific data - COMPLETELY ISOLATED
        inventory: historicalInventory.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          condition: item.condition,
          notes: item.notes,
          acquisitionDate: item.acquisitionDate,
          price: item.price
        })),
        
        tasks: historicalTasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.completed,
          dueDate: task.dueDate,
          createdDate: task.createdDate,
          completedDate: task.completedDate,
          notification: task.notification
        })),
        
        // Copy other reference data but these should be editable for historical context
        tenants: baseProperty.tenants || [],
        documents: baseProperty.documents || [],
        expenses: 0,
        netIncome: 0,
        monthlyExpenses: [],
        
        // Contact and utility data (editable for historical context)
        communityManager: baseProperty.communityManager,
        waterProvider: baseProperty.waterProvider,
        electricityProvider: baseProperty.electricityProvider,
        gasProvider: baseProperty.gasProvider,
        internetProvider: baseProperty.internetProvider,
        insuranceCompany: baseProperty.insuranceCompany,
        
        // Contact details (editable for historical context)
        communityManagerDetails: baseProperty.communityManagerDetails,
        waterProviderDetails: baseProperty.waterProviderDetails,
        electricityProviderDetails: baseProperty.electricityProviderDetails,
        gasProviderDetails: baseProperty.gasProviderDetails,
        internetProviderDetails: baseProperty.internetProviderDetails,
        insuranceDetails: baseProperty.insuranceDetails,
        
        // Other utilities (editable for historical context)
        otherUtilities: baseProperty.otherUtilities || []
      };
      
      setProperty(historicalProperty);
    } else {
      // Current year - use base property
      setProperty(baseProperty);
    }
  }, [baseProperty, historicalYear, id, getRecordsByPropertyYear, getHistoricalInventory, getHistoricalTasks]);

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
    </Layout>
  );
};

export default PropertyEdit;
