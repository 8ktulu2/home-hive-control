
import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Property } from '@/types/property';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/property/${property.id}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={property.image}
            alt={property.name}
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-lg font-semibold truncate">{property.name}</h3>
            {property.rentPaid ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate mb-2">{property.address}</p>
          <div className="text-sm flex justify-between">
            <span className="font-medium">Alquiler:</span>
            <span className="font-bold">{property.rent}€/mes</span>
          </div>
          <div className="text-sm flex justify-between">
            <span className="font-medium">Gastos:</span>
            <span className="font-medium text-destructive">-{property.expenses}€/mes</span>
          </div>
        </CardContent>
        <CardFooter className={cn(
          "p-4 border-t flex justify-between items-center text-sm font-semibold",
          property.netIncome > 0 ? "text-success" : "text-destructive"
        )}>
          <span>Neto:</span>
          <span>{property.netIncome}€/mes</span>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PropertyCard;
