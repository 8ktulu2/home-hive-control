
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MortgageInfoProps {
  property: Property;
  updateNumericValue: (field: string, subField: string | null, value: number) => void;
  setProperty: (property: Property) => void;
}

const MortgageInfo = ({ property, updateNumericValue, setProperty }: MortgageInfoProps) => {
  return (
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
            updateNumericValue('mortgage', 'monthlyPayment', monthlyPayment);
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
            updateNumericValue('communityFee', null, communityFee);
          }}
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default MortgageInfo;
