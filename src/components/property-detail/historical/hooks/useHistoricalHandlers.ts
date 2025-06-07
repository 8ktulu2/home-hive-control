
import { Property } from '@/types/property';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import { useHistoricalDataIsolation } from '@/hooks/useHistoricalDataIsolation';

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

    saveRecord(property.id, year, month, categorias);
    
    if (historicalProperty) {
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
    }
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
    }
  };

  const handleHistoricalInventoryEdit = (item: any) => {
    updateHistoricalInventoryItem(property.id, year, item.id, item);
    
    if (historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        inventory: historicalProperty.inventory?.map(inv => 
          inv.id === item.id ? item : inv
        ) || []
      });
    }
  };

  const handleHistoricalInventoryDelete = (itemId: string) => {
    deleteHistoricalInventoryItem(property.id, year, itemId);
    
    if (historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        inventory: historicalProperty.inventory?.filter(inv => inv.id !== itemId) || []
      });
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
    saveHistoricalTasks(property.id, year, [...existingTasks, newTask]);
    
    if (historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: [...(historicalProperty.tasks || []), newTask]
      });
    }
  };

  const handleHistoricalTaskToggle = (taskId: string, completed: boolean) => {
    const existingTasks = getHistoricalTasks(property.id, year);
    const updatedTasks = existingTasks.map(task => 
      task.id === taskId ? { ...task, completed, completedDate: completed ? new Date().toISOString() : undefined } : task
    );
    saveHistoricalTasks(property.id, year, updatedTasks);
    
    if (historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: historicalProperty.tasks?.map(task => 
          task.id === taskId ? { ...task, completed, completedDate: completed ? new Date().toISOString() : undefined } : task
        ) || []
      });
    }
  };

  const handleHistoricalTaskDelete = (taskId: string) => {
    const existingTasks = getHistoricalTasks(property.id, year);
    const updatedTasks = existingTasks.filter(task => task.id !== taskId);
    saveHistoricalTasks(property.id, year, updatedTasks);
    
    if (historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: historicalProperty.tasks?.filter(task => task.id !== taskId) || []
      });
    }
  };

  const handleHistoricalTaskUpdate = (taskId: string, updates: any) => {
    const existingTasks = getHistoricalTasks(property.id, year);
    const updatedTasks = existingTasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    saveHistoricalTasks(property.id, year, updatedTasks);
    
    if (historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: historicalProperty.tasks?.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        ) || []
      });
    }
  };

  // Document and expense handlers - should not affect current year
  const handleHistoricalDocumentAdd = (document: any) => {
    console.log('Historical document add (isolated):', document);
  };

  const handleHistoricalDocumentDelete = (documentId: string) => {
    console.log('Historical document delete (isolated):', documentId);
  };

  const handleHistoricalExpenseDelete = (expenseId: string) => {
    console.log('Historical expense delete (isolated):', expenseId);
  };

  const handleRentPaidChange = (paid: boolean) => {
    console.log('Historical rent paid change (no effect on current year):', paid);
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
