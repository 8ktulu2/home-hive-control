
import { Property } from '@/types/property';
import PropertyInfo from './PropertyInfo';
import FinancialSection from './finances/FinancialSection';

interface MainContentProps {
  property: Property;
  setProperty: (property: Property) => void;
}

const MainContent = ({ property, setProperty }: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PropertyInfo property={property} />
      <FinancialSection property={property} setProperty={setProperty} />
    </div>
  );
};

export default MainContent;
