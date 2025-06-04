
import React from 'react';
import { Property } from '@/types/property';
import PropertyInfo from './PropertyInfo';
import PropertyTasks from './PropertyTasks';

interface SecondaryContentProps {
  property: Property;
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onTaskAdd: (task: { title: string; description?: string }) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: any) => void;
  onDocumentDelete: (documentId: string) => void;
  onDocumentAdd: (document: any) => void;
  onInventoryAdd?: (item: any) => void;
  onInventoryEdit?: (item: any) => void;
  onInventoryDelete?: (itemId: string) => void;
  historicalYear?: number;
}

const SecondaryContent: React.FC<SecondaryContentProps> = ({
  property,
  onTaskToggle,
  onTaskAdd,
  onTaskDelete,
  onTaskUpdate,
  onDocumentDelete,
  onDocumentAdd,
  onInventoryAdd,
  onInventoryEdit,
  onInventoryDelete,
  historicalYear
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PropertyInfo 
        property={property} 
        setProperty={() => {}} // Not used for historical
        onInventoryAdd={onInventoryAdd}
        onInventoryEdit={onInventoryEdit}
        onInventoryDelete={onInventoryDelete}
        historicalYear={historicalYear}
      />
      
      <PropertyTasks
        tasks={property.tasks || []}
        onTaskToggle={onTaskToggle}
        onTaskAdd={onTaskAdd}
        onTaskDelete={onTaskDelete}
        onTaskUpdate={onTaskUpdate}
      />
    </div>
  );
};

export default SecondaryContent;
