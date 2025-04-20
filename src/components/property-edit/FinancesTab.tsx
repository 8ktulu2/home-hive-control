
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FinancesTabProps {
  property: Property;
  setProperty: (property: Property) => void;
  calculateTotalExpenses: () => number;
}

const FinancesTab = ({ property, setProperty, calculateTotalExpenses }: FinancesTabProps) => {
  return (
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
  );
};

export default FinancesTab;
