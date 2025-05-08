
import { Property } from '@/types/property';
import MonthlyPaymentStatus from '@/components/properties/MonthlyPaymentStatus';
import MainContent from './MainContent';
import SecondaryContent from './SecondaryContent';

interface PropertyDetailContentProps {
  property: Property;
  onRentPaidChange: (paid: boolean) => void;
  onPaymentUpdate: (month: number, year: number, isPaid: boolean, notes?: string) => void;
  handleTaskToggle: (taskId: string, completed: boolean) => void;
  handleTaskAdd: (task: { title: string; description?: string }) => void;
  handleTaskDelete: (taskId: string) => void;
  handleTaskUpdate: (taskId: string, updates: any) => void;
  handleDocumentDelete: (documentId: string) => void;
  handleDocumentAdd: (document: any) => void;
  setProperty: (property: Property | null) => void;
}

const PropertyDetailContent = ({
  property,
  onRentPaidChange,
  onPaymentUpdate,
  handleTaskToggle,
  handleTaskAdd,
  handleTaskDelete,
  handleTaskUpdate,
  handleDocumentDelete,
  handleDocumentAdd,
  setProperty
}: PropertyDetailContentProps) => {
  return (
    <div className="space-y-2">
      <div className="pb-1">
        <MonthlyPaymentStatus 
          property={property}
          onPaymentUpdate={onPaymentUpdate}
          compact={true}
        />
      </div>

      <MainContent property={property} setProperty={setProperty} />

      <SecondaryContent
        property={property}
        onTaskToggle={handleTaskToggle}
        onTaskAdd={handleTaskAdd}
        onTaskDelete={handleTaskDelete}
        onTaskUpdate={handleTaskUpdate}
        onDocumentDelete={handleDocumentDelete}
        onDocumentAdd={handleDocumentAdd}
      />
    </div>
  );
};

export default PropertyDetailContent;
