import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useHistoricalStorage, HistoricalRecord } from '@/hooks/useHistoricalStorage';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';
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

  // Create a historical version of the property
  useEffect(() => {
    const records = getRecordsByPropertyYear(property.id, year);
    
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
      // Keep current structure but with historical context
      rent: records.length > 0 ? records[0].categorias.alquiler : property.rent,
      mortgage: {
        ...property.mortgage,
        monthlyPayment: records.length > 0 ? records[0].categorias.hipoteca : property.mortgage?.monthlyPayment || 0
      }
    };
    
    setHistoricalProperty(histProperty);
  }, [property, year, getRecordsByPropertyYear]);

  const { 
    handleTaskToggle,
    handleTaskAdd,
    handleTaskDelete,
    handleTaskUpdate,
    handleDocumentDelete,
    handleDocumentAdd,
    handleExpenseDelete
  } = usePropertyManagement(historicalProperty);

  const { 
    handlePaymentUpdate, 
    handleRentPaidChange 
  } = usePaymentManagement(historicalProperty, setHistoricalProperty);

  // Override payment update to save to historical storage with complete isolation
  const handleHistoricalPaymentUpdate = (month: number, updateYear: number, isPaid: boolean, notes?: string) => {
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
        {/* Slim historical header */}
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
            handleTaskToggle={handleTaskToggle}
            handleTaskAdd={handleTaskAdd}
            handleTaskDelete={handleTaskDelete}
            handleTaskUpdate={handleTaskUpdate}
            handleDocumentDelete={handleDocumentDelete}
            handleDocumentAdd={handleDocumentAdd}
            handleExpenseDelete={handleExpenseDelete}
            setProperty={setHistoricalProperty}
            historicalYear={year}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoricalPropertyView;
