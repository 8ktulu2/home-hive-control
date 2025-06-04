
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

  // Create a historical version of the property
  useEffect(() => {
    const records = getRecordsByPropertyYear(property.id, year);
    const historicalInventory = getHistoricalInventory(property.id, year);
    const historicalTasks = getHistoricalTasks(property.id, year);
    
    // Create a copy of the property with historical data
    const histProperty: Property = {
      ...property,
      // Override with historical data if available
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
      // Use historical inventory instead of current
      inventory: historicalInventory.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        condition: item.condition,
        notes: item.notes,
        acquisitionDate: item.acquisitionDate,
        price: item.price
      })),
      // Use historical tasks instead of current
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
      // Keep current structure but with historical context
      rent: records.length > 0 ? records[0].categorias.alquiler : property.rent,
      mortgage: {
        ...property.mortgage,
        monthlyPayment: records.length > 0 ? records[0].categorias.hipoteca : property.mortgage?.monthlyPayment || 0
      }
    };
    
    setHistoricalProperty(histProperty);
  }, [property, year, getRecordsByPropertyYear, getHistoricalInventory, getHistoricalTasks]);

  // Historical payment update - completely isolated
  const handleHistoricalPaymentUpdate = (month: number, updateYear: number, isPaid: boolean, notes?: string) => {
    // Ensure we're only working with the historical year
    if (updateYear !== year) {
      console.warn(`Payment update attempted for year ${updateYear} but we're in historical year ${year}`);
      return;
    }

    // Get current categories or use current year defaults as reference
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

    // Update alquiler based on payment status (this affects ONLY the historical year)
    if (isPaid) {
      categorias.alquiler = property.rent || 0;
    } else {
      categorias.alquiler = 0;
    }

    // Save to historical storage (completely isolated from current year)
    saveRecord(property.id, year, month, categorias);
    
    // Update local state for this historical view only
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

  // Historical inventory management - completely isolated
  const handleHistoricalInventoryAdd = (item: Omit<any, 'id'>) => {
    const newItem = addHistoricalInventoryItem(property.id, year, item);
    
    // Update local state immediately
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
    
    // Update local state immediately
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
    
    // Update local state immediately
    if (historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        inventory: historicalProperty.inventory?.filter(inv => inv.id !== itemId) || []
      });
    }
  };

  // Historical task management - completely isolated
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
    
    // Update local state immediately
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
    
    // Update local state immediately
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
    
    // Update local state immediately
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
    
    // Update local state immediately
    if (historicalProperty) {
      setHistoricalProperty({
        ...historicalProperty,
        tasks: historicalProperty.tasks?.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        ) || []
      });
    }
  };

  // Dummy handlers for documents and expenses (not affecting current year)
  const handleHistoricalDocumentAdd = (document: any) => {
    console.log('Historical document add:', document);
  };

  const handleHistoricalDocumentDelete = (documentId: string) => {
    console.log('Historical document delete:', documentId);
  };

  const handleHistoricalExpenseDelete = (expenseId: string) => {
    console.log('Historical expense delete:', expenseId);
  };

  const handleRentPaidChange = (paid: boolean) => {
    // This should not affect current year - it's for historical context only
    console.log('Historical rent paid change:', paid);
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
        {/* Slim historical header with proper structure */}
        <div className="flex items-center gap-3 mb-4 bg-yellow-100/50 border border-yellow-200 rounded-lg p-2">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-yellow-800">Histórico: {year}</span>
            <span className="text-yellow-600">|</span>
            <span className="font-medium text-yellow-800">{property.name}</span>
            <span className="text-yellow-600">|</span>
            <span className="text-yellow-700">{property.address}</span>
          </div>
        </div>

        {/* Use the exact same components as current year but with historical context */}
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
