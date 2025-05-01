
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface PropertyAnalysisProps {
  properties: Property[];
  selectedMonth: Date;
}

const PropertyAnalysis = ({ properties, selectedMonth }: PropertyAnalysisProps) => {
  const formattedMonth = format(selectedMonth, 'MMMM yyyy', { locale: es });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Análisis por Propiedad</CardTitle>
        <CardDescription>Visión detallada de cada propiedad para {formattedMonth}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map(property => (
            <Card key={property.id} className="overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{property.name}</h3>
                  <p className="text-xs text-muted-foreground">{property.address}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 bg-muted/20 border-t">
                <div className="p-3 border-r">
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                  <p className="font-medium text-primary">{property.rent}€</p>
                </div>
                <div className="p-3 border-r">
                  <p className="text-xs text-muted-foreground">Gastos</p>
                  <p className="font-medium text-destructive">{property.expenses}€</p>
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground">Neto</p>
                  <p className={`font-medium ${property.netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {property.netIncome}€
                  </p>
                </div>
              </div>
              <div className="p-3 border-t flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center gap-1"
                >
                  <Link to={`/property/${property.id}`}>
                    <span>Ver detalles</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyAnalysis;
