
import { Property } from '@/types/property';
import PropertyInfo from './PropertyInfo';

interface MainContentProps {
  property: Property;
  setProperty: (property: Property | null) => void;
}

const MainContent = ({ property, setProperty }: MainContentProps) => {
  return (
    <div className="space-y-6 w-full">
      <PropertyInfo property={property} />
    </div>
  );
};

export default MainContent;
