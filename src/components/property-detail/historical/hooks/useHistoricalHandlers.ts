
import { Property } from '@/types/property';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import { useHistoricalDataIsolation } from '@/hooks/useHistoricalDataIsolation';
import { toast } from 'sonner';

export const useHistoricalHandlers = (
  property: Property, 
  year: number,
  historicalProperty: Property | null,
  setHistoricalProperty: (property: Property) => void
) => {
  const { getRecordsByPropertyYear, saveRecord } = useHistoricalStorage();
  const { 
    addHistoricalInventoryItem, 
    updateHistoricalInventoryItem, 
    deleteHistoricalInventoryItem,
    getHistoricalTasks,
    saveHistoricalTasks
  } = useHistoricalDataIsolation();

  // ISOLATED payment update - affects ONLY the historical year
  const handleHistoricalPaymentUpdate = (month: number, updateYear: number, isPaid: boolean, notes?: string) => {
    if (updateYear !== year) {
      console.warn(`Payment update attempted for year ${updateYear} but we're in historical year ${year}`);
      return;
    }

    console.log(`Updating historical payment: ${month}/${updateYear} - isPaid: ${isPaid}`);

    const currentRecord = getRecordsByPropertyYear(property.id, year).find(r => r.mes === month);
    const categorias = currentRecord?.categorias || {
      alquiler: property.rent || 0,
      hipoteca: property.mortgage?.monthlyPayment || 0,
      comunidad: property.communityFee || 0,
      ibi: (property.ibi || 0) / 12,
      seguroVida: (property.lifeInsurance?.cost || 0) / 12,
      seguroHogar: (property.homeInsurance?.cost || 0) / 12,
      compras: 0,
      averias: 0,
      suministros: 0
    };

    if (isPaid) {
      categorias.alquiler = property.rent || 0;
    } else {
      categorias.alquiler = 0;
    }

    const saved = saveRecord(property.id, year, month, categorias);
    
    if (saved && historicalProperty) {
      const updatedPaymentHistory = [...(historicalProperty.paymentHistory || [])];
      const existingIndex = updatedPaymentHistory.findIndex(p => p.month === month && p.year === updateYear);
      
      if (existingIndex >= 0) {
        updatedPaymentHistory[existingIndex] = {
          ...updatedPaymentHistory[existingIndex],
          isPaid,
          notes,
          amount: isPaid ? property.rent || 0 : 0
        };
      } else {
        updatedPaymentHistory.push({
          id: `hist-payment-${Date.now()}`,
          date: new Date(updateYear, month, 1).toISOString(),
          amount: isPaid ? property.rent || 0 : 0,
          type: 'rent',
          isPaid,
          month,
          year: updateYear,
          description: 'Alquiler',
          notes
        });
      }
      
      setHistoricalProperty({
        ...historicalProperty,
        paymentHistory: updatedPaymentHistory
      });

      toast.success(`Pago histórico ${isPaid ? 'confirmado' : 'cancelado'} para ${month + 1}/${updateYear}`);
    } else {
      toast.error('Error al actualizar el pago histórico');
    }
  };

  // Handle rent paid change for historical property
  const handleRentPaidChange = (paid: boolean) => {
    const currentMonth = new Date().getMonth();
    handleHistoricalPaymentUpdate(currentMonth, year, paid);
  };

  // ISOLATED inventory management - affects ONLY the historical year
  const handleHistoricalInventoryAdd = (item: Omit<any, 'id'>) => {
    const newItem = addHistoricalInventoryItem(property.id, year, item);
    
    if (historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        inventory: [...(historicalProperty.inventory || []), {
          id: newItem.id,
          name: newItem.name,
          type: newItem.type,
          condition: newItem.condition,
          notes: newItem.notes,
          acquisitionDate: newItem.acquisitionDate,
          price: newItem.price
        }]
      });
      toast.success('Elemento añadido al inventario histórico');
    }
  };

  const handleHistoricalInventoryEdit = (item: any) => {
    const updated = updateHistoricalInventoryItem(property.id, year, item.id, item);
    
    if (updated && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        inventory: historicalProperty.inventory?.map(inv => 
          inv.id === item.id ? item : inv
        ) || []
      });
      toast.success('Elemento del inventario histórico actualizado');
    }
  };

  const handleHistoricalInventoryDelete = (itemId: string) => {
    const deleted = deleteHistoricalInventoryItem(property.id, year, itemId);
    
    if (deleted && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        inventory: historicalProperty.inventory?.filter(inv => inv.id !== itemId) || []
      });
      toast.success('Elemento eliminado del inventario histórico');
    }
  };

  // ISOLATED task management - affects ONLY the historical year
  const handleHistoricalTaskAdd = (task: { title: string; description?: string }) => {
    const newTask = {
      id: `hist-task-${Date.now()}`,
      title: task.title,
      description: task.description,
      completed: false,
      createdDate: new Date().toISOString(),
      year
    };

    const existingTasks = getHistoricalTasks(property.id, year);
    const saved = saveHistoricalTasks(property.id, year, [...existingTasks, newTask]);
    
    if (saved && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: [...(historicalProperty.tasks || []), newTask]
      });
      toast.success('Tarea añadida al histórico');
    }
  };

  const handleHistoricalTaskToggle = (taskId: string, completed: boolean) => {
    const existingTasks = getHistoricalTasks(property.id, year);
    const updatedTasks = existingTasks.map(task => 
      task.id === taskId ? { ...task, completed, completedDate: completed ? new Date().toISOString() : undefined } : task
    );
    const saved = saveHistoricalTasks(property.id, year, updatedTasks);
    
    if (saved && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: historicalProperty.tasks?.map(task => 
          task.id === taskId ? { ...task, completed, completedDate: completed ? new Date().toISOString() : undefined } : task
        ) || []
      });
      toast.success('Estado de tarea actualizado');
    }
  };

  const handleHistoricalTaskDelete = (taskId: string) => {
    const existingTasks = getHistoricalTasks(property.id, year);
    const updatedTasks = existingTasks.filter(task => task.id !== taskId);
    const saved = saveHistoricalTasks(property.id, year, updatedTasks);
    
    if (saved && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: historicalProperty.tasks?.filter(task => task.id !== taskId) || []
      });
      toast.success('Tarea eliminada del histórico');
    }
  };

  const handleHistoricalTaskUpdate = (taskId: string, updates: any) => {
    const existingTasks = getHistoricalTasks(property.id, year);
    const updatedTasks = existingTasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    const saved = saveHistoricalTasks(property.id, year, updatedTasks);
    
    if (saved && historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: historicalProperty.tasks?.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        ) || []
      });
      toast.success('Tarea actualizada');
    }
  };

  // Document handlers - placeholder for now
  const handleHistoricalDocumentAdd = (document: any) => {
    console.log('Historical document add (not fully implemented):', document);
    toast.info('Funcionalidad de documentos en desarrollo');
  };

  const handleHistoricalDocumentDelete = (documentId: string) => {
    console.log('Historical document delete (not fully implemented):', documentId);
    toast.info('Funcionalidad de documentos en desarrollo');
  };

  const handleHistoricalExpenseDelete = (expenseId: string) => {
    console.log('Historical expense delete (not fully implemented):', expenseId);
    toast.info('Funcionalidad de gastos en desarrollo');
  };

  return {
    handleHistoricalPaymentUpdate,
    handleHistoricalInventoryAdd,
    handleHistoricalInventoryEdit,
    handleHistoricalInventoryDelete,
    handleHistoricalTaskAdd,
    handleHistoricalTaskToggle,
    handleHistoricalTaskDelete,
    handleHistoricalTaskUpdate,
    handleHistoricalDocumentAdd,
    handleHistoricalDocumentDelete,
    handleHistoricalExpenseDelete,
    handleRentPaidChange
  };
};
