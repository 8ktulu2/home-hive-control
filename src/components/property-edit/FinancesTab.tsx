
import { Property } from '@/types/property';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MortgageInfo from './finances/MortgageInfo';
import InsuranceInfo from './finances/InsuranceInfo';

interface FinancesTabProps {
  property: Property;
  setProperty: React.Dispatch<React.SetStateAction<Property | null>>;
  calculateTotalExpenses: () => number;
  updateInsuranceCompany: (value: string) => void;
}

const FinancesTab = ({ 
  property, 
  setProperty, 
  calculateTotalExpenses,
  updateInsuranceCompany 
}: FinancesTabProps) => {
  const updateNumericValue = (field: string, subField: string | null, value: number) => {
    if (!property) return;
    
    if (subField) {
      setProperty({
        ...property,
        [field]: {
          ...property[field as keyof Property],
          [subField]: value
        }
      });
    } else {
      setProperty({
        ...property,
        [field]: value
      });
    }
  };
  
  const handleRentChange = (value: string) => {
    const rent = parseFloat(value);
    setProperty({
      ...property,
      rent: isNaN(rent) ? 0 : rent,
      expenses: calculateTotalExpenses(),
      netIncome: isNaN(rent) ? -calculateTotalExpenses() : rent - calculateTotalExpenses(),
    });
  };
  
  const handleRentPaidChange = (checked: boolean) => {
    setProperty({
      ...property,
      rentPaid: checked,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Financiera</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Renta Mensual (€)</Label>
                <Input
                  type="number"
                  value={property.rent || 0}
                  onChange={(e) => handleRentChange(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="rent-paid"
                  checked={property.rentPaid}
                  onCheckedChange={handleRentPaidChange}
                />
                <Label htmlFor="rent-paid">
                  Renta Pagada
                </Label>
              </div>
            </div>

            <MortgageInfo
              property={property}
              updateNumericValue={updateNumericValue}
            />
          </div>

          <InsuranceInfo
            property={property}
            updateNumericValue={updateNumericValue}
            updateInsuranceCompany={updateInsuranceCompany}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancesTab;
