
import React from 'react';
import { Property } from '@/types/property';
import PropertyInfo from './PropertyInfo';

interface MainContentProps {
  property: Property;
  setProperty: (property: Property) => void;
}

const MainContent = ({ property, setProperty }: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PropertyInfo property={property} />
    </div>
  );
};

export default MainContent;
