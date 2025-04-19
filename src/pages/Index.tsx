
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { mockProperties } from '@/data/mockData';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  // Intentar cargar propiedades desde localStorage o usar mockProperties como respaldo
  const [properties, setProperties] = useState<Property[]>(() => {
    const savedProperties = localStorage.getItem('properties');
    return savedProperties ? JSON.parse(savedProperties) : mockProperties;
  });
  
  // Guardar propiedades en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('properties', JSON.stringify(properties));
  }, [properties]);
  
  const handlePropertiesUpdate = (updatedProperties: Property[]) => {
    setProperties(updatedProperties);
  };

  const exportToGoogleSheets = () => {
    try {
      // Preparar los datos para la exportación
      const headers = ["Nombre", "Dirección", "Alquiler", "Gastos", "Beneficio neto", "Estado de pago"];
      
      // Convertir propiedades a formato CSV para Google Sheets
      const propertiesData = properties.map(property => [
        property.name,
        property.address,
        property.rent.toFixed(2) + " €",
        property.expenses.toFixed(2) + " €",
        (property.rent - property.expenses).toFixed(2) + " €",
        property.rentPaid ? "Pagado" : "Pendiente"
      ]);
      
      // Combinar encabezados y datos
      const csvData = [headers, ...propertiesData]
        .map(row => row.join(','))
        .join('\n');
      
      // Crear un blob y un enlace de descarga
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      // Configurar el enlace de descarga
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `propiedades-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      // Añadir al DOM, hacer clic y eliminar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Datos exportados correctamente");
    } catch (error) {
      console.error("Error al exportar datos:", error);
      toast.error("Error al exportar los datos");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Propiedades</h1>
          <p className="text-muted-foreground">Gestiona tus inmuebles en alquiler de forma sencilla</p>
        </div>
        <Button 
          onClick={exportToGoogleSheets}
          className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar a Google Sheets
        </Button>
      </div>
      <PropertyGrid 
        properties={properties} 
        onPropertiesUpdate={handlePropertiesUpdate} 
      />
    </Layout>
  );
};

export default Index;
