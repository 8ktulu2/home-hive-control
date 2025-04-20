
import { Property } from '@/types/property';
import { toast } from 'sonner';

export function usePropertyCreation() {
  const createNewProperty = (propertyData: Partial<Property> = {}): Property => {
    const newPropertyId = `property-${Date.now()}`;
    const newProperty: Property = {
      id: newPropertyId,
      name: propertyData.name || "Nueva Propiedad",
      address: propertyData.address || "",
      image: propertyData.image || "/placeholder.svg",
      rent: propertyData.rent || 0,
      expenses: propertyData.expenses || 0,
      rentPaid: false,
      netIncome: (propertyData.rent || 0) - (propertyData.expenses || 0),
      cadastralReference: propertyData.cadastralReference || "",
      communityManager: propertyData.communityManager || "",
      waterProvider: propertyData.waterProvider || "",
      electricityProvider: propertyData.electricityProvider || "",
      tenants: propertyData.tenants || [],
      monthlyExpenses: propertyData.monthlyExpenses || [],
      paymentHistory: propertyData.paymentHistory || [],
      documents: propertyData.documents || [],
      tasks: propertyData.tasks || [],
      inventory: propertyData.inventory || [],
      communityFee: propertyData.communityFee || 0,
      insuranceCompany: propertyData.insuranceCompany || "",
      insuranceDetails: propertyData.insuranceDetails || {
        phone: "",
        email: "",
        website: "",
        contactPerson: "",
        notes: ""
      },
      communityManagerDetails: propertyData.communityManagerDetails || {
        phone: "",
        email: "",
        website: "",
        contactPerson: "",
        notes: ""
      },
      waterProviderDetails: propertyData.waterProviderDetails || {
        phone: "",
        email: "",
        website: "",
        contactPerson: "",
        notes: ""
      },
      electricityProviderDetails: propertyData.electricityProviderDetails || {
        phone: "",
        email: "",
        website: "",
        contactPerson: "",
        notes: ""
      }
    };
    
    const savedProperties = localStorage.getItem('properties');
    let allProperties = [];
    
    if (savedProperties) {
      allProperties = JSON.parse(savedProperties);
      allProperties.push(newProperty);
    } else {
      allProperties = [newProperty];
    }
    
    localStorage.setItem('properties', JSON.stringify(allProperties));
    toast.success(`Propiedad "${newProperty.name}" creada correctamente`);

    return newProperty;
  };

  return {
    createNewProperty,
  };
}
