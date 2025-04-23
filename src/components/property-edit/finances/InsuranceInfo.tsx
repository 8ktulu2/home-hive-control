
import { Property } from '@/types/property';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InsuranceInfoProps {
  property: Property;
  updateNumericValue: (field: string, subField: string | null, value: number) => void;
  updateInsuranceCompany: (value: string) => void;
}

const InsuranceInfo = ({ property, updateNumericValue, updateInsuranceCompany }: InsuranceInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Seguros</h3>
      
      <div className="space-y-2">
        <Label>Compañía de Seguros</Label>
        <Input
          type="text"
          value={property.insuranceCompany || ''}
          onChange={(e) => {
            updateInsuranceCompany(e.target.value);
          }}
          placeholder="Nombre de la compañía"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Seguro del Hogar - Coste Anual (€)</Label>
        <Input
          type="number"
          value={property.homeInsurance?.cost || 0}
          onChange={(e) => {
            const cost = parseFloat(e.target.value);
            updateNumericValue('homeInsurance', 'cost', cost);
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
            updateNumericValue('lifeInsurance', 'cost', cost);
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
            updateNumericValue('ibi', null, ibi);
          }}
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default InsuranceInfo;
