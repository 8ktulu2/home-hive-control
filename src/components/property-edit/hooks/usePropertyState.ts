import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import { useHistoricalDataIsolation } from '@/hooks/useHistoricalDataIsolation';

export const usePropertyState = (
  baseProperty: Property | null,
  historicalYear: number | undefined,
  id: string | undefined
) => {
  const [property, setProperty] = useState<Property | null>(null);
  const { getRecordsByPropertyYear } = useHistoricalStorage();
  const { getHistoricalInventory, getHistoricalTasks } = useHistoricalDataIsolation();

  useEffect(() => {
    if (!baseProperty) return;

    if (historicalYear && id !== 'new') {
      // Create historical "ficha completa" - completely independent data for this year
      const records = getRecordsByPropertyYear(baseProperty.id, historicalYear);
      const historicalInventory = getHistoricalInventory(baseProperty.id, historicalYear);
      const historicalTasks = getHistoricalTasks(baseProperty.id, historicalYear);
      
      const historicalProperty: Property = {
        // Base reference data (immutable)
        id: baseProperty.id,
        name: baseProperty.name,
        address: baseProperty.address,
        image: baseProperty.image,
        
        // Historical financial data - ISOLATED FOR THIS YEAR
        rent: records.length > 0 ? records[0].categorias.alquiler : baseProperty.rent,
        rentPaid: false,
        
        // Historical mortgage - ISOLATED
        mortgage: records.length > 0 && records[0].categorias.hipoteca > 0 ? {
          ...baseProperty.mortgage,
          monthlyPayment: records[0].categorias.hipoteca
        } : baseProperty.mortgage,
        
        // Historical costs - ISOLATED
        communityFee: records.length > 0 ? records[0].categorias.comunidad : baseProperty.communityFee,
        ibi: records.length > 0 ? records[0].categorias.ibi * 12 : baseProperty.ibi,
        
        // Historical insurance - ISOLATED
        lifeInsurance: records.length > 0 ? {
          ...baseProperty.lifeInsurance,
          cost: records[0].categorias.seguroVida * 12
        } : baseProperty.lifeInsurance,
        homeInsurance: records.length > 0 ? {
          ...baseProperty.homeInsurance,
          cost: records[0].categorias.seguroHogar * 12
        } : baseProperty.homeInsurance,
        
        // Historical specific data - COMPLETELY ISOLATED
        inventory: historicalInventory.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          condition: item.condition,
          notes: item.notes,
          acquisitionDate: item.acquisitionDate,
          price: item.price
        })),
        
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
        
        // Copy other reference data but these should be editable for historical context
        tenants: baseProperty.tenants || [],
        documents: baseProperty.documents || [],
        expenses: 0,
        netIncome: 0,
        monthlyExpenses: [],
        
        // Contact and utility data (editable for historical context)
        communityManager: baseProperty.communityManager,
        waterProvider: baseProperty.waterProvider,
        electricityProvider: baseProperty.electricityProvider,
        gasProvider: baseProperty.gasProvider,
        internetProvider: baseProperty.internetProvider,
        insuranceCompany: baseProperty.insuranceCompany,
        
        // Contact details (editable for historical context)
        communityManagerDetails: baseProperty.communityManagerDetails,
        waterProviderDetails: baseProperty.waterProviderDetails,
        electricityProviderDetails: baseProperty.electricityProviderDetails,
        gasProviderDetails: baseProperty.gasProviderDetails,
        internetProviderDetails: baseProperty.internetProviderDetails,
        insuranceDetails: baseProperty.insuranceDetails,
        
        // Other utilities (editable for historical context)
        otherUtilities: baseProperty.otherUtilities || []
      };
      
      setProperty(historicalProperty);
    } else {
      // Current year - use base property
      setProperty(baseProperty);
    }
  }, [baseProperty, historicalYear, id, getRecordsByPropertyYear, getHistoricalInventory, getHistoricalTasks]);

  return { property, setProperty };
};
