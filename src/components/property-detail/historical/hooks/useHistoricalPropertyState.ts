import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import { useHistoricalDataIsolation } from '@/hooks/useHistoricalDataIsolation';

export const useHistoricalPropertyState = (property: Property, year: number) => {
  const [historicalProperty, setHistoricalProperty] = useState<Property | null>(null);
  const { getRecordsByPropertyYear } = useHistoricalStorage();
  const { 
    getHistoricalInventory, 
    getHistoricalTasks
  } = useHistoricalDataIsolation();

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
      insuranceDetails: property.insuranceDetails,
      
      // Other utilities (reference only)
      otherUtilities: property.otherUtilities
    };
    
    setHistoricalProperty(histProperty);
  }, [property, year, getRecordsByPropertyYear, getHistoricalInventory, getHistoricalTasks]);

  return { historicalProperty, setHistoricalProperty };
};
