
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useHistoricalStorage, HistoricalRecord } from '@/hooks/useHistoricalStorage';
import { useHistoricalDataIsolation } from '@/hooks/useHistoricalDataIsolation';
import PropertyDetailContent from '../PropertyDetailContent';

interface HistoricalPropertyViewProps {
  property: Property;
  year: number;
  onBack: () => void;
}

const HistoricalPropertyView: React.FC<HistoricalPropertyViewProps> = ({ 
  property, 
  year, 
  onBack 
}) => {
  const [historicalProperty, setHistoricalProperty] = useState<Property | null>(null);
  const { getRecordsByPropertyYear, saveRecord } = useHistoricalStorage();
  const { 
    getHistoricalInventory, 
    addHistoricalInventoryItem, 
    updateHistoricalInventoryItem, 
    deleteHistoricalInventoryItem,
    getHistoricalTasks,
    saveHistoricalTasks
  } = useHistoricalDataIsolation();

  // Create a COMPLETELY ISOLATED historical version of the property
  useEffect(() => {
    const records = getRecordsByPropertyYear(property.id, year);
    const historicalInventory = getHistoricalInventory(property.id, year);
    const historicalTasks = getHistoricalTasks(property.id, year);
    
    // Create COMPLETELY ISOLATED copy for historical year
    const histProperty: Property = {
      // Base property data (immutable reference data)
      id: property.id,
      name: property.name,
      address: property.address,
      image: property.image,
      
      // Historical financial data - COMPLETELY ISOLATED
      rent: records.length > 0 ? records[0].categorias.alquiler : property.rent,
      rentPaid: false, // Historical rent paid status is separate
      
      // Historical mortgage data - ISOLATED
      mortgage: records.length > 0 && records[0].categorias.hipoteca > 0 ? {
        ...property.mortgage,
        monthlyPayment: records[0].categorias.hipoteca
      } : property.mortgage,
      
      // Historical utility costs - ISOLATED  
      communityFee: records.length > 0 ? records[0].categorias.comunidad : property.communityFee,
      ibi: records.length > 0 ? records[0].categorias.ibi * 12 : property.ibi,
      
      // Historical insurance - ISOLATED
      lifeInsurance: records.length > 0 ? {
        ...property.lifeInsurance,
        cost: records[0].categorias.seguroVida * 12
      } : property.lifeInsurance,
      homeInsurance: records.length > 0 ? {
        ...property.homeInsurance,
        cost: records[0].categorias.seguroHogar * 12
      } : property.homeInsurance,
      
      // Historical payment history - ISOLATED
      paymentHistory: records.map(record => ({
        id: record.id,
        date: new Date(year, record.mes, 1).toISOString(),
        amount: record.ingresos,
        type: 'rent' as const,
        isPaid: record.ingresos > 0,
        month: record.mes,
        year: record.año,
        description: 'Alquiler'
      })),
      
      // Historical inventory - COMPLETELY ISOLATED
      inventory: historicalInventory.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        condition: item.condition,
        notes: item.notes,
        acquisitionDate: item.acquisitionDate,
        price: item.price
      })),
      
      // Historical tasks - COMPLETELY ISOLATED
      tasks: historicalTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        dueDate: task.dueDate,
        createdDate: task.createdDate,
        completedDate: task.completedDate,
        notification: task.notification
      })),
      
      // Reference data (not year-specific)
      tenants: property.tenants,
      documents: property.documents,
      expenses: 0,
      netIncome: 0,
      monthlyExpenses: [],
      
      // Contact and utility data (reference only)
      communityManager: property.communityManager,
      waterProvider: property.waterProvider,
      electricityProvider: property.electricityProvider,
      gasProvider: property.gasProvider,
      internetProvider: property.internetProvider,
      insuranceCompany: property.insuranceCompany,
      
      // Contact details (reference only)
      communityManagerDetails: property.communityManagerDetails,
      waterProviderDetails: property.waterProviderDetails,
      electricityProviderDetails: property.electricityProviderDetails,
      gasProviderDetails: property.gasProviderDetails,
      internetProviderDetails: property.internetProviderDetails,
      insuranceDetails: property.insuranceDetails,
      
      // Other utilities (reference only)
      otherUtilities: property.otherUtilities
    };
    
    setHistoricalProperty(histProperty);
  }, [property, year, getRecordsByPropertyYear, getHistoricalInventory, getHistoricalTasks]);

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

  if (!historicalProperty) {
    return <div>Cargando datos históricos...</div>;
  }

  return (
    <div 
      className="min-h-screen font-serif" 
      style={{ 
        background: 'linear-gradient(to bottom, #fefce8, #fef3c7)',
      }}
    >
      <div className="max-w-7xl mx-auto p-4">
        {/* SHORTER and more concise historical header */}
        <div className="flex items-center gap-3 mb-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg p-2 shadow-md">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-yellow-400 text-yellow-800 hover:bg-yellow-200 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Actual
          </Button>
          <div className="flex items-center gap-2 text-sm overflow-hidden">
            <span className="font-bold text-yellow-900 bg-yellow-200 px-2 py-1 rounded whitespace-nowrap">
              {year}
            </span>
            <span className="text-yellow-700">|</span>
            <span className="font-medium text-yellow-800 truncate">{property.name}</span>
          </div>
        </div>

        <div className="space-y-2">
          <PropertyDetailContent
            property={historicalProperty}
            onRentPaidChange={handleRentPaidChange}
            onPaymentUpdate={handleHistoricalPaymentUpdate}
            handleTaskToggle={handleHistoricalTaskToggle}
            handleTaskAdd={handleHistoricalTaskAdd}
            handleTaskDelete={handleHistoricalTaskDelete}
            handleTaskUpdate={handleHistoricalTaskUpdate}
            handleDocumentDelete={handleHistoricalDocumentDelete}
            handleDocumentAdd={handleHistoricalDocumentAdd}
            handleExpenseDelete={handleHistoricalExpenseDelete}
            setProperty={setHistoricalProperty}
            historicalYear={year}
            onInventoryAdd={handleHistoricalInventoryAdd}
            onInventoryEdit={handleHistoricalInventoryEdit}
            onInventoryDelete={handleHistoricalInventoryDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoricalPropertyView;
