
import { Property, Document } from '@/types/property';
import PropertyTasks from './PropertyTasks';
import PropertyDocuments from './PropertyDocuments';

interface SecondaryContentProps {
  property: Property;
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onTaskAdd: (task: { title: string; description?: string }) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: any) => void;
  onDocumentDelete: (documentId: string) => void;
  onDocumentAdd?: (document: Document) => void;
}

const SecondaryContent = ({
  property,
  onTaskToggle,
  onTaskAdd,
  onTaskDelete,
  onTaskUpdate,
  onDocumentDelete,
  onDocumentAdd
}: SecondaryContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PropertyTasks
        tasks={property.tasks || []}
        onTaskToggle={onTaskToggle}
        onTaskAdd={onTaskAdd}
        onTaskDelete={onTaskDelete}
        onTaskUpdate={onTaskUpdate}
      />
      <PropertyDocuments
        documents={property.documents || []}
        onDocumentDelete={onDocumentDelete}
        onDocumentAdd={onDocumentAdd}
      />
    </div>
  );
};

export default SecondaryContent;
