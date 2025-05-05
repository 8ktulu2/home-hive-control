
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { Property } from '@/types/property';
import { Link } from 'react-router-dom';

interface InsufficientDataMessageProps {
  property: Property;
}

const InsufficientDataMessage: React.FC<InsufficientDataMessageProps> = ({ property }) => {
  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="text-xl">Informe Fiscal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Info className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No hay datos suficientes</h3>
          <p className="text-muted-foreground mt-2">
            Para generar un informe fiscal, necesitas añadir información básica sobre el alquiler, 
            gastos e ingresos en la sección "Finanzas" del inmueble.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            asChild
          >
            <Link to={`/property/${property.id}/edit`}>
              Editar información del inmueble
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsufficientDataMessage;
