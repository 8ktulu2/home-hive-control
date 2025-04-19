import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { mockProperties } from '@/data/mockData';
import { Property, Tenant, ContactDetails } from '@/types/property';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash, Plus, Upload, User } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';

const PropertyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isNewProperty = id === 'new';
  
  const { updatePropertyImage } = usePropertyManagement(property);
  
  useEffect(() => {
    if (isNewProperty) {
      setProperty({
        id: `property-${Date.now()}`,
        name: '',
        address: '',
        image: '/placeholder.svg',
        rent: 0,
        rentPaid: false,
        expenses: 0,
        netIncome: 0,
        tasks: [],
        documents: [],
        tenants: [],
        paymentHistory: [],
        monthlyExpenses: [],
      });
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
  }, [id, isNewProperty, navigate]);

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
      const currentDetails = property[detailsField] as ContactDetails || {};
      
      const updatedDetails = {
        ...currentDetails,
        [field]: value
      } as ContactDetails;

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {isNewProperty ? 'Nueva Propiedad' : `Editar ${property.name}`}
        </h1>
        <p className="text-muted-foreground">
          {isNewProperty
            ? 'Crea una nueva propiedad en tu cartera'
            : 'Modifica los detalles de la propiedad'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="tenants">Inquilinos</TabsTrigger>
            <TabsTrigger value="contacts">Contactos</TabsTrigger>
            <TabsTrigger value="finances">Finanzas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-1/3 flex flex-col items-center gap-2">
                    <div className="relative w-full h-48 overflow-hidden rounded-lg border">
                      <img 
                        src={property.image} 
                        alt={property.name || "Imagen de propiedad"} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleImageUpload}
                      className="w-full flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Cambiar imagen</span>
                    </Button>
                    <input 
                      ref={imageInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </div>
                  
                  <div className="w-full md:w-2/3 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre de la Propiedad</Label>
                      <Input
                        id="name"
                        value={property.name}
                        onChange={(e) => setProperty({ ...property, name: e.target.value })}
                        placeholder="Ej: Apartamento Centro"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={property.address}
                        onChange={(e) => setProperty({ ...property, address: e.target.value })}
                        placeholder="Ej: Calle Principal 123"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cadastralReference">Referencia Catastral</Label>
                      <Input
                        id="cadastralReference"
                        value={property.cadastralReference || ''}
                        onChange={(e) =>
                          setProperty({ ...property, cadastralReference: e.target.value })
                        }
                        placeholder="Ej: 9872023VH5797S0001WX"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="rent">Alquiler Mensual (€)</Label>
                    <Input
                      id="rent"
                      type="number"
                      value={property.rent}
                      onChange={(e) => {
                        const rent = parseInt(e.target.value);
                        const expenses = calculateTotalExpenses();
                        const netIncome = rent - expenses;
                        setProperty({ ...property, rent, netIncome });
                      }}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Inquilinos</CardTitle>
                <Button type="button" size="sm" onClick={addTenant}>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Inquilino
                </Button>
              </CardHeader>
              <CardContent>
                {property.tenants && property.tenants.length > 0 ? (
                  <div className="space-y-6">
                    {property.tenants.map((tenant, index) => (
                      <div key={tenant.id} className="p-4 border rounded-md space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-medium">Inquilino {index + 1}</h3>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTenant(index)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`tenant-${index}-name`}>Nombre</Label>
                            <Input
                              id={`tenant-${index}-name`}
                              value={tenant.name}
                              onChange={(e) => updateTenant(index, 'name', e.target.value)}
                              placeholder="Nombre del inquilino"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`tenant-${index}-id`}>Identificación</Label>
                            <Input
                              id={`tenant-${index}-id`}
                              value={tenant.identificationNumber || ''}
                              onChange={(e) => updateTenant(index, 'identificationNumber', e.target.value)}
                              placeholder="DNI / NIE / Pasaporte"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`tenant-${index}-phone`}>Teléfono</Label>
                            <Input
                              id={`tenant-${index}-phone`}
                              value={tenant.phone || ''}
                              onChange={(e) => updateTenant(index, 'phone', e.target.value)}
                              placeholder="Teléfono de contacto"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`tenant-${index}-email`}>Email</Label>
                            <Input
                              id={`tenant-${index}-email`}
                              value={tenant.email || ''}
                              onChange={(e) => updateTenant(index, 'email', e.target.value)}
                              placeholder="Email de contacto"
                              type="email"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay inquilinos registrados</p>
                    <p className="text-sm mt-2">Haz clic en "Añadir Inquilino" para empezar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contactos y Proveedores</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Administrador de la Comunidad</h3>
                  
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={property.communityManager || ''}
                      onChange={(e) => updateContactDetails('communityManager', 'name', e.target.value)}
                      placeholder="Nombre del administrador"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      value={property.communityManagerDetails?.phone || ''}
                      onChange={(e) => updateContactDetails('communityManager', 'phone', e.target.value)}
                      placeholder="Teléfono de contacto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={property.communityManagerDetails?.email || ''}
                      onChange={(e) => updateContactDetails('communityManager', 'email', e.target.value)}
                      placeholder="Email de contacto"
                      type="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sitio web</Label>
                    <Input
                      value={property.communityManagerDetails?.website || ''}
                      onChange={(e) => updateContactDetails('communityManager', 'website', e.target.value)}
                      placeholder="Sitio web"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notas</Label>
                    <Textarea
                      value={property.communityManagerDetails?.notes || ''}
                      onChange={(e) => updateContactDetails('communityManager', 'notes', e.target.value)}
                      placeholder="Notas adicionales"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Compañía de Seguros</h3>
                  
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={property.insuranceCompany || ''}
                      onChange={(e) => updateContactDetails('insuranceCompany', 'name', e.target.value)}
                      placeholder="Nombre de la aseguradora"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      value={property.insuranceDetails?.phone || ''}
                      onChange={(e) => updateContactDetails('insuranceCompany', 'phone', e.target.value)}
                      placeholder="Teléfono de contacto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={property.insuranceDetails?.email || ''}
                      onChange={(e) => updateContactDetails('insuranceCompany', 'email', e.target.value)}
                      placeholder="Email de contacto"
                      type="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Persona de contacto</Label>
                    <Input
                      value={property.insuranceDetails?.contactPerson || ''}
                      onChange={(e) => updateContactDetails('insuranceCompany', 'contactPerson', e.target.value)}
                      placeholder="Persona de contacto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notas</Label>
                    <Textarea
                      value={property.insuranceDetails?.notes || ''}
                      onChange={(e) => updateContactDetails('insuranceCompany', 'notes', e.target.value)}
                      placeholder="Notas adicionales"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Proveedor de Agua</h3>
                  
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={property.waterProvider || ''}
                      onChange={(e) => setProperty({ ...property, waterProvider: e.target.value })}
                      placeholder="Nombre del proveedor"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      value={property.waterProviderDetails?.phone || ''}
                      onChange={(e) => updateContactDetails('waterProvider', 'phone', e.target.value)}
                      placeholder="Teléfono de contacto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={property.waterProviderDetails?.email || ''}
                      onChange={(e) => updateContactDetails('waterProvider', 'email', e.target.value)}
                      placeholder="Email de contacto"
                      type="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sitio web</Label>
                    <Input
                      value={property.waterProviderDetails?.website || ''}
                      onChange={(e) => updateContactDetails('waterProvider', 'website', e.target.value)}
                      placeholder="Sitio web"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notas</Label>
                    <Textarea
                      value={property.waterProviderDetails?.notes || ''}
                      onChange={(e) => updateContactDetails('waterProvider', 'notes', e.target.value)}
                      placeholder="Notas adicionales"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Proveedor de Electricidad</h3>
                  
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={property.electricityProvider || ''}
                      onChange={(e) => setProperty({ ...property, electricityProvider: e.target.value })}
                      placeholder="Nombre del proveedor"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      value={property.electricityProviderDetails?.phone || ''}
                      onChange={(e) => updateContactDetails('electricityProvider', 'phone', e.target.value)}
                      placeholder="Teléfono de contacto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={property.electricityProviderDetails?.email || ''}
                      onChange={(e) => updateContactDetails('electricityProvider', 'email', e.target.value)}
                      placeholder="Email de contacto"
                      type="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sitio web</Label>
                    <Input
                      value={property.electricityProviderDetails?.website || ''}
                      onChange={(e) => updateContactDetails('electricityProvider', 'website', e.target.value)}
                      placeholder="Sitio web"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notas</Label>
                    <Textarea
                      value={property.electricityProviderDetails?.notes || ''}
                      onChange={(e) => updateContactDetails('electricityProvider', 'notes', e.target.value)}
                      placeholder="Notas adicionales"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finances" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Financiera</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Hipoteca</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mortgage-bank">Banco</Label>
                      <Input
                        id="mortgage-bank"
                        value={property.mortgage?.bank || ''}
                        onChange={(e) => setProperty({
                          ...property,
                          mortgage: { ...property.mortgage || {}, bank: e.target.value }
                        })}
                        placeholder="Nombre del banco"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mortgage-payment">Pago Mensual (€)</Label>
                      <Input
                        id="mortgage-payment"
                        type="number"
                        value={property.mortgage?.monthlyPayment || 0}
                        onChange={(e) => {
                          const monthlyPayment = parseFloat(e.target.value);
                          setProperty({
                            ...property,
                            mortgage: { ...property.mortgage || {}, monthlyPayment }
                          });
                          
                          setTimeout(() => {
                            const expenses = calculateTotalExpenses();
                            const netIncome = property.rent - expenses;
                            setProperty(prev => ({ ...prev, expenses, netIncome }));
                          }, 0);
                        }}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mortgage-end-date">Fecha de Finalización</Label>
                      <Input
                        id="mortgage-end-date"
                        type="date"
                        value={property.mortgage?.endDate || ''}
                        onChange={(e) => setProperty({
                          ...property,
                          mortgage: { ...property.mortgage || {}, endDate: e.target.value }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="community-fee">Gastos de Comunidad Anual (€)</Label>
                      <Input
                        id="community-fee"
                        type="number"
                        value={property.communityFee || 0}
                        onChange={(e) => {
                          const communityFee = parseFloat(e.target.value);
                          setProperty({
                            ...property,
                            communityFee
                          });
                          
                          setTimeout(() => {
                            const expenses = calculateTotalExpenses();
                            const netIncome = property.rent - expenses;
                            setProperty(prev => ({ ...prev, expenses, netIncome }));
                          }, 0);
                        }}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Seguros</h3>
                    
                    <div className="space-y-2">
                      <Label>Seguro del Hogar - Coste Anual (€)</Label>
                      <Input
                        type="number"
                        value={property.homeInsurance?.cost || 0}
                        onChange={(e) => {
                          const cost = parseFloat(e.target.value);
                          setProperty({
                            ...property,
                            homeInsurance: { ...property.homeInsurance || {}, cost }
                          });
                          
                          setTimeout(() => {
                            const expenses = calculateTotalExpenses();
                            const netIncome = property.rent - expenses;
                            setProperty(prev => ({ ...prev, expenses, netIncome }));
                          }, 0);
                        }}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Seguro de Vida - Coste Anual (€)</Label>
                      <Input
                        type="number"
                        value={property.lifeInsurance?.cost || 0}
                        onChange={(e) => {
                          const cost = parseFloat(e.target.value);
                          setProperty({
                            ...property,
                            lifeInsurance: { ...property.lifeInsurance || {}, cost }
                          });
                          
                          setTimeout(() => {
                            const expenses = calculateTotalExpenses();
                            const netIncome = property.rent - expenses;
                            setProperty(prev => ({ ...prev, expenses, netIncome }));
                          }, 0);
                        }}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ibi">IBI Anual (€)</Label>
                      <Input
                        id="ibi"
                        type="number"
                        value={property.ibi || 0}
                        onChange={(e) => {
                          const ibi = parseFloat(e.target.value);
                          setProperty({ ...property, ibi });
                          
                          setTimeout(() => {
                            const expenses = calculateTotalExpenses();
                            const netIncome = property.rent - expenses;
                            setProperty(prev => ({ ...prev, expenses, netIncome }));
                          }, 0);
                        }}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
