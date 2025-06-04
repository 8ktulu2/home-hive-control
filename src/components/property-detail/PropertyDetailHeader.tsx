
import { Property } from '@/types/property';
import PropertyActions from './header/PropertyActions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface PropertyDetailHeaderProps {
  property: Property;
  onRentPaidChange: (paid: boolean) => void;
  historicalYear?: number;
}

const PropertyDetailHeader = ({ property, historicalYear }: PropertyDetailHeaderProps) => {
  return (
    <div className="space-y-2">
      {/* Historical mode warning - ALWAYS visible in historical mode */}
      {historicalYear && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Histórico {historicalYear}</strong> - Datos aislados del año actual
          </AlertDescription>
        </Alert>
      )}
      
      <div className={`flex justify-between items-start space-y-0 pb-2 ${
        historicalYear ? 'bg-yellow-100 border-2 border-yellow-300 rounded-lg p-3' : ''
      }`}>
        <div className="flex flex-row gap-4 items-center">
          <div className="relative w-20 h-20 overflow-hidden rounded-lg shrink-0">
            <img 
              src={property.image || '/placeholder.svg'} 
              alt={property.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1">
            <h1 className={`text-2xl font-bold ${historicalYear ? 'text-yellow-900' : ''}`}>
              {property.name} {historicalYear && <span className="text-sm font-normal text-yellow-700">(Histórico {historicalYear})</span>}
            </h1>
            <p className={`text-muted-foreground ${historicalYear ? 'text-yellow-700' : ''}`}>
              {property.address}
            </p>
          </div>
          
          {/* CRITICAL: COMPLETELY DISABLE edit access from historical mode */}
          {!historicalYear && (
            <PropertyActions propertyId={property.id} />
          )}
          
          {historicalYear && (
            <div className="text-xs text-yellow-700 bg-yellow-200 px-2 py-1 rounded">
              Solo vista - No editable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailHeader;
