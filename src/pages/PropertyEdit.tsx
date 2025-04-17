
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { mockProperties } from '@/data/mockData';
import { Property } from '@/types/property';

const PropertyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const isNewProperty = id === 'new';

  useEffect(() => {
    if (isNewProperty) {
      // Crear una nueva propiedad con valores predeterminados
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
        documents: []
      });
      setLoading(false);
    } else {
      // Buscar la propiedad existente
      const foundProperty = mockProperties.find(p => p.id === id);
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        toast.error('Propiedad no encontrada');
        navigate('/');
      }
      setLoading(false);
    }
  }, [id, isNewProperty, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isNewProperty ? 'Propiedad creada con éxito' : 'Propiedad actualizada con éxito');
    navigate('/');
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
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rent">Alquiler Mensual (€)</Label>
                <Input
                  id="rent"
                  type="number"
                  value={property.rent}
                  onChange={(e) => {
                    const rent = parseInt(e.target.value);
                    const netIncome = rent - property.expenses;
                    setProperty({ ...property, rent, netIncome });
                  }}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expenses">Gastos Mensuales (€)</Label>
                <Input
                  id="expenses"
                  type="number"
                  value={property.expenses}
                  onChange={(e) => {
                    const expenses = parseInt(e.target.value);
                    const netIncome = property.rent - expenses;
                    setProperty({ ...property, expenses, netIncome });
                  }}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ibi">IBI Anual (€)</Label>
                <Input
                  id="ibi"
                  type="number"
                  value={property.ibi || 0}
                  onChange={(e) => setProperty({ ...property, ibi: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
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
          </CardContent>
        </Card>

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
