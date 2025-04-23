
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MortgageInfo from './finances/MortgageInfo';
import InsuranceInfo from './finances/InsuranceInfo';

interface FinancesTabProps {
  property: Property;
  setProperty: (property: Property) => void;
  calculateTotalExpenses: () => number;
}

const FinancesTab = ({ property, setProperty, calculateTotalExpenses }: FinancesTabProps) => {
  const updateNumericValue = (field: string, subField: string | null, value: number) => {
    if (subField) {
      const updatedProperty = {
        ...property,
        [field]: { 
          ...property[field as keyof Property] as object || {}, 
          [subField]: value 
        }
      };
      
      setProperty(updatedProperty);
      
      setTimeout(() => {
        const expenses = calculateTotalExpenses();
        const netIncome = property.rent - expenses;
        setProperty({
          ...updatedProperty,
          expenses,
          netIncome
        });
      }, 0);
    } else {
      const updatedProperty = {
        ...property,
        [field]: value
      };
      
      setProperty(updatedProperty);
      
      setTimeout(() => {
        const expenses = calculateTotalExpenses();
        const netIncome = property.rent - expenses;
        setProperty({
          ...updatedProperty,
          expenses,
          netIncome
        });
      }, 0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Financiera</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MortgageInfo
            property={property}
            setProperty={setProperty}
            updateNumericValue={updateNumericValue}
          />
          <InsuranceInfo
            property={property}
            updateNumericValue={updateNumericValue}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancesTab;
