
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { mockProperties } from '@/data/mockData';
import { Property, Tenant } from '@/types/property';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import PropertyFormHeader from '@/components/property-edit/PropertyFormHeader';
import BasicInfoTab from '@/components/property-edit/BasicInfoTab';
import TenantsTab from '@/components/property-edit/TenantsTab';
import ContactsTab from '@/components/property-edit/ContactsTab';
import FinancesTab from '@/components/property-edit/FinancesTab';

const PropertyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isNewProperty = id === 'new';
  
  const { createNewProperty, updatePropertyImage } = usePropertyManagement(property);

  useEffect(() => {
    if (isNewProperty) {
      const newProperty = createNewProperty();
      setProperty(newProperty);
      setLoading(false);
    } else {
      const savedProperties = localStorage.getItem('properties');
      let foundProperty = null;
      
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        foundProperty = properties.find((p: Property) => p.id === id);
      }
      
      if (!foundProperty) {
        foundProperty = mockProperties.find(p => p.id === id);
      }
      
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        toast.error('Propiedad no encontrada');
        navigate('/');
      }
      setLoading(false);
    }
  }, [id, isNewProperty, navigate, createNewProperty]);

  const handleImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && property) {
      const imageUrl = URL.createObjectURL(file);
      setProperty({ ...property, image: imageUrl });
      updatePropertyImage(imageUrl);
      toast.success('Imagen subida correctamente');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (property.id) {
          const savedImages = localStorage.getItem('propertyImages') || '{}';
          const images = JSON.parse(savedImages);
          images[property.id] = base64String;
          localStorage.setItem('propertyImages', JSON.stringify(images));
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

  const calculateTotalExpenses = () => {
    let total = 0;
    
    if (property?.mortgage?.monthlyPayment) {
      total += property.mortgage.monthlyPayment;
    }
    
    if (property?.ibi) {
      total += property.ibi / 12;
    }
    
    if (property?.homeInsurance?.cost) {
      total += property.homeInsurance.cost / 12;
    }
    
    if (property?.lifeInsurance?.cost) {
      total += property.lifeInsurance.cost / 12;
    }
    
    if (property?.monthlyExpenses) {
      property.monthlyExpenses.forEach(expense => {
        if (!expense.isPaid) {
          total += expense.amount;
        }
      });
    }
    
    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (property) {
      const expenses = calculateTotalExpenses();
      const netIncome = property.rent - expenses;
      
      const updatedProperty = {
        ...property,
        expenses,
        netIncome
      };
      
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const properties = JSON.parse(savedProperties);
        
        if (isNewProperty) {
          properties.push(updatedProperty);
        } else {
          const index = properties.findIndex((p: Property) => p.id === property.id);
          if (index >= 0) {
            properties[index] = updatedProperty;
          } else {
            properties.push(updatedProperty);
          }
        }
        
        localStorage.setItem('properties', JSON.stringify(properties));
      } else {
        localStorage.setItem('properties', JSON.stringify([updatedProperty]));
      }
      
      toast.success(isNewProperty ? 'Propiedad creada con éxito' : 'Propiedad actualizada con éxito');
      navigate(`/property/${property.id}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <p className="text-xl">Cargando...</p>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <p className="text-xl text-destructive">Error al cargar la propiedad</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PropertyFormHeader isNewProperty={isNewProperty} propertyName={property.name} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="tenants">Inquilinos</TabsTrigger>
            <TabsTrigger value="contacts">Contactos</TabsTrigger>
            <TabsTrigger value="finances">Finanzas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicInfoTab 
              property={property}
              imageInputRef={imageInputRef}
              handleImageUpload={handleImageUpload}
              handleImageChange={handleImageChange}
              setProperty={setProperty}
            />
          </TabsContent>

          <TabsContent value="tenants">
            <TenantsTab
              property={property}
              addTenant={addTenant}
              updateTenant={updateTenant}
              removeTenant={removeTenant}
            />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsTab
              property={property}
              updateContactDetails={updateContactDetails}
            />
          </TabsContent>

          <TabsContent value="finances">
            <FinancesTab
              property={property}
              setProperty={setProperty}
              calculateTotalExpenses={calculateTotalExpenses}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit">
            {isNewProperty ? 'Crear Propiedad' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default PropertyEdit;
