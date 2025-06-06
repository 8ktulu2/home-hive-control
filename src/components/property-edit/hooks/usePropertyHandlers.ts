
import { Tenant, ContactDetails, Utility, Property } from '@/types/property';
import { v4 as uuidv4 } from 'uuid';

export const usePropertyHandlers = (
  property: Property | null,
  setProperty: (property: Property) => void
) => {
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

  return {
    addTenant,
    updateTenant,
    removeTenant,
    updateInsuranceCompany,
    addOtherUtility,
    updateContactDetails
  };
};
