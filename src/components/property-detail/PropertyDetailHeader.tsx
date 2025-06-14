
import React from 'react';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Euro, Calendar, MapPin } from 'lucide-react';
import MonthlyPaymentStatus from '@/components/properties/MonthlyPaymentStatus';

interface PropertyDetailHeaderProps {
  property: Property;
  onRentPaidChange: (paid: boolean) => void;
  historicalYear?: number;
}

const PropertyDetailHeader: React.FC<PropertyDetailHeaderProps> = ({ 
  property, 
  onRentPaidChange,
  historicalYear 
}) => {
  console.log(`PropertyDetailHeader renderizado para año: ${historicalYear || 'actual'}`);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {property.name}
                {historicalYear && (
                  <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                    Histórico {historicalYear}
                  </Badge>
                )}
              </h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.address}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center mb-2">
                <Euro className="h-5 w-5 text-green-600 mr-1" />
                <span className="text-2xl font-bold text-green-600">
                  {property.rent?.toLocaleString('es-ES') || '0'}€
                </span>
                <span className="text-sm text-gray-500 ml-1">/mes</span>
              </div>
              
              {!historicalYear && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="rent-paid"
                    checked={property.rentPaid}
                    onCheckedChange={onRentPaidChange}
                  />
                  <Label htmlFor="rent-paid" className="text-sm">
                    Alquiler pagado
                  </Label>
                </div>
              )}
            </div>
          </div>

          <MonthlyPaymentStatus 
            property={property} 
            compact={true}
            historicalYear={historicalYear}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailHeader;
