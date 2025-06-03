import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useHistoricalStorage, HistoricalRecord } from '@/hooks/useHistoricalStorage';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';
import PropertyDetailHeader from '../PropertyDetailHeader';
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

  // Override payment update to save to historical storage
  const handleHistoricalPaymentUpdate = (month: number, updateYear: number, isPaid: boolean, notes?: string) => {
    // Get current categories or defaults
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

    // Update alquiler based on payment status
    if (isPaid) {
      categorias.alquiler = property.rent || 0;
    } else {
      categorias.alquiler = 0;
    }

    saveRecord(property.id, year, month, categorias);
    
    // Update local state
    if (historicalProperty) {
      const updatedPaymentHistory = [...(historicalProperty.paymentHistory || [])];
      const existingIndex = updatedPaymentHistory.findIndex(p => p.month === month && p.year === updateYear);
      
      if (existingIndex >= 0) {
        updatedPaymentHistory[existingIndex] = {
          ...updatedPaymentHistory[existingIndex],
          isPaid,
          notes
        };
      } else {
        updatedPaymentHistory.push({
          id: `payment-${Date.now()}`,
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
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(to bottom, #f5f5f0, #ebe8dc)',
    }}>
      <div className="max-w-7xl mx-auto p-4">
        {/* Historical indicator and back button - single banner */}
        <div className="flex items-center gap-3 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-amber-800">Modo Histórico - {year}</h2>
          </div>
        </div>

        {/* Use the exact same components as current year but with historical context */}
        <div className="space-y-2">
          <PropertyDetailHeader 
            property={historicalProperty}
            onRentPaidChange={handleRentPaidChange}
          />
          
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
