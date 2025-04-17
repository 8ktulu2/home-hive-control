
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PropertyDetailHeader from '@/components/property-detail/PropertyDetailHeader';
import PropertyInfo from '@/components/property-detail/PropertyInfo';
import PropertyTasks from '@/components/property-detail/PropertyTasks';
import PropertyDocuments from '@/components/property-detail/PropertyDocuments';
import PropertyFinances from '@/components/property-detail/PropertyFinances';
import MonthlyPaymentStatus from '@/components/properties/MonthlyPaymentStatus';
import { mockProperties } from '@/data/mockData';
import { Property, Task, PaymentRecord, MonthlyExpense } from '@/types/property';
import { toast } from 'sonner';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    // Simular la obtención de datos del servidor
    const foundProperty = mockProperties.find(p => p.id === id);
    if (foundProperty) {
      setProperty(foundProperty);
    } else {
      toast.error('Propiedad no encontrada');
      navigate('/');
    }
  }, [id, navigate]);

  const handleRentPaidChange = (paid: boolean) => {
    if (property) {
      setProperty({
        ...property,
        rentPaid: paid
      });
    }
  };

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (property && property.tasks) {
      const updatedTasks = property.tasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      );
      setProperty({
        ...property,
        tasks: updatedTasks
      });
    }
  };

  const handleTaskAdd = (newTask: { title: string; description?: string; notification?: { date: string; enabled: boolean } }) => {
    if (property) {
      const task: Task = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        completed: false,
        dueDate: undefined,
        notification: newTask.notification ? {
          enabled: newTask.notification.enabled,
          date: newTask.notification.date,
        } : undefined
      };
      
      setProperty({
        ...property,
        tasks: [...(property.tasks || []), task]
      });
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (property && property.tasks) {
      setProperty({
        ...property,
        tasks: property.tasks.filter(task => task.id !== taskId)
      });
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    if (property && property.tasks) {
      const updatedTasks = property.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      setProperty({
        ...property,
        tasks: updatedTasks
      });
    }
  };

  const handleDocumentDelete = (documentId: string) => {
    if (property && property.documents) {
      setProperty({
        ...property,
        documents: property.documents.filter(doc => doc.id !== documentId)
      });
    }
  };
  
  const handlePaymentUpdate = (month: number, year: number, isPaid: boolean, notes?: string) => {
    if (property) {
      const existingPayments = property.paymentHistory || [];
      const existingPaymentIndex = existingPayments.findIndex(p => p.month === month && p.year === year);
      
      let updatedPayments: PaymentRecord[];
      
      if (existingPaymentIndex >= 0) {
        // Update existing payment record
        updatedPayments = [...existingPayments];
        updatedPayments[existingPaymentIndex] = {
          ...updatedPayments[existingPaymentIndex],
          isPaid,
          date: new Date().toISOString(),
          notes: notes || updatedPayments[existingPaymentIndex].notes
        };
      } else {
        // Create new payment record
        const newPayment: PaymentRecord = {
          id: `payment-${Date.now()}`,
          date: new Date().toISOString(),
          amount: property.rent,
          isPaid,
          month,
          year,
          notes
        };
        updatedPayments = [...existingPayments, newPayment];
      }
      
      // Update current month's payment status in property
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const isCurrentMonth = month === currentMonth && year === currentYear;
      
      setProperty({
        ...property,
        paymentHistory: updatedPayments,
        rentPaid: isCurrentMonth ? isPaid : property.rentPaid
      });
    }
  };

  const handleExpenseAdd = (expense: Partial<MonthlyExpense>) => {
    if (property) {
      const newExpense: MonthlyExpense = {
        id: `expense-${Date.now()}`,
        name: expense.name || '',
        amount: expense.amount || 0,
        isPaid: expense.isPaid || false,
        category: expense.category || 'utilities',
        propertyId: property.id,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        date: new Date().toISOString()
      };
      
      setProperty({
        ...property,
        monthlyExpenses: [...(property.monthlyExpenses || []), newExpense]
      });
    }
  };
  
  const handleExpenseUpdate = (expenseId: string, updates: Partial<MonthlyExpense>) => {
    if (property && property.monthlyExpenses) {
      const updatedExpenses = property.monthlyExpenses.map(expense => 
        expense.id === expenseId ? { ...expense, ...updates } : expense
      );
      
      setProperty({
        ...property,
        monthlyExpenses: updatedExpenses
      });
    }
  };

  if (!property) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <p className="text-xl">Cargando propiedad...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <PropertyDetailHeader 
          property={property}
          onRentPaidChange={handleRentPaidChange}
        />

        <MonthlyPaymentStatus 
          property={property}
          onPaymentUpdate={handlePaymentUpdate}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PropertyInfo property={property} />
          <PropertyFinances 
            property={property} 
            onExpenseAdd={handleExpenseAdd} 
            onExpenseUpdate={handleExpenseUpdate} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PropertyTasks 
            tasks={property.tasks || []}
            onTaskToggle={handleTaskToggle}
            onTaskAdd={handleTaskAdd}
            onTaskDelete={handleTaskDelete}
            onTaskUpdate={handleTaskUpdate}
          />
          <PropertyDocuments 
            documents={property.documents || []}
            onDocumentDelete={handleDocumentDelete}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
