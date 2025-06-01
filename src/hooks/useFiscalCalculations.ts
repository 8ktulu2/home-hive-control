
import { useEffect, useState } from 'react';
import { Property } from '@/types/property';
import { useHistoricalStorage, HistoricalRecord } from '@/hooks/useHistoricalStorage';

export interface PropertyFiscalDetail {
  id: string;
  name: string;
  address?: string;
  grossIncome: number;
  expenses: number;
  netProfit: number;
  reductionPercentage: number;
  reducedProfit: number;
  occupancyMonths: number;
}

export interface FiscalData {
  grossIncome: number;
  deductibleExpenses: number;
  netProfit: number;
  reductionPercentage: number;
  taxableBase: number;
  irpfQuota: number;
  propertyDetails: PropertyFiscalDetail[];
  filteredRecords: HistoricalRecord[];
}

export const useFiscalCalculations = (properties: Property[], selectedYear: number, selectedPropertyId: string = 'all') => {
  const [fiscalData, setFiscalData] = useState<FiscalData>({
    grossIncome: 0,
    deductibleExpenses: 0,
    netProfit: 0,
    reductionPercentage: 0,
    taxableBase: 0,
    irpfQuota: 0,
    propertyDetails: [],
    filteredRecords: []
  });

  // Conectamos con el almacenamiento histórico
  const { records, getRecordsByPropertyYear } = useHistoricalStorage();

  useEffect(() => {
    // Calculamos todos los datos fiscales basados en los registros históricos
    calculateFiscalData();
  }, [properties, selectedYear, selectedPropertyId, records]);

  const calculateFiscalData = () => {
    // Filtramos las propiedades si se ha seleccionado una específica
    const filteredProperties = selectedPropertyId === 'all' 
      ? properties 
      : properties.filter(p => p.id === selectedPropertyId);
    
    // Inicializamos variables para totales
    let totalGrossIncome = 0;
    let totalExpenses = 0;
    let totalNetProfit = 0;
    let totalTaxableBase = 0;
    const propertyDetails: PropertyFiscalDetail[] = [];
    let allRecords: HistoricalRecord[] = [];

    // Procesamos cada propiedad
    filteredProperties.forEach(property => {
      // Obtenemos los registros históricos para esta propiedad y año
      const propertyRecords = getRecordsByPropertyYear(property.id, selectedYear);
      allRecords = [...allRecords, ...propertyRecords];
      
      // Calculamos los totales para esta propiedad
      const propertyGrossIncome = propertyRecords.reduce((sum, record) => sum + record.ingresos, 0);
      const propertyExpenses = propertyRecords.reduce((sum, record) => sum + record.gastos, 0);
      const propertyNetProfit = propertyGrossIncome - propertyExpenses;
      
      // Determinamos el porcentaje de reducción basado en reglas fiscales
      // (En España, puede ser 60% para alquiler residencial habitual, 40% para otros)
      const occupiedMonths = propertyRecords.filter(record => record.ingresos > 0).length;
      let reductionPercentage = 0;
      
      if (occupiedMonths >= 1) {
        reductionPercentage = (property.taxInfo?.isPrimaryResidence || 
          property.taxInfo?.isTensionedArea) ? 60 : 40;
      }
      
      // Si hay alguna condición especial, aumentamos la reducción
      if (property.taxInfo?.hasYoungTenant || property.taxInfo?.rentReduction) {
        reductionPercentage = Math.min(70, reductionPercentage + 10);
      }
      
      // Calculamos el beneficio neto reducido
      const reducedProfit = propertyNetProfit * (reductionPercentage / 100);
      
      // Actualizamos los totales generales
      totalGrossIncome += propertyGrossIncome;
      totalExpenses += propertyExpenses;
      totalNetProfit += propertyNetProfit;
      totalTaxableBase += propertyNetProfit - reducedProfit;
      
      // Añadimos los detalles de esta propiedad
      propertyDetails.push({
        id: property.id,
        name: property.name,
        address: property.address,
        grossIncome: propertyGrossIncome,
        expenses: propertyExpenses,
        netProfit: propertyNetProfit,
        reductionPercentage,
        reducedProfit,
        occupancyMonths: occupiedMonths
      });
    });
    
    // Calculamos el tipo medio aproximado de IRPF (esto es simplificado)
    const irpfRate = calculateEstimatedIRPFRate(totalTaxableBase);
    const irpfQuota = totalTaxableBase * (irpfRate / 100);
    
    // Calculamos el porcentaje de reducción promedio ponderado
    const weightedReductionPercentage = totalNetProfit > 0 
      ? ((totalNetProfit - totalTaxableBase) / totalNetProfit) * 100 
      : 0;
    
    // Actualizamos el estado con todos los datos calculados
    setFiscalData({
      grossIncome: totalGrossIncome,
      deductibleExpenses: totalExpenses,
      netProfit: totalNetProfit,
      reductionPercentage: Math.round(weightedReductionPercentage),
      taxableBase: totalTaxableBase,
      irpfQuota,
      propertyDetails,
      filteredRecords: allRecords
    });
  };
  
  // Función simplificada para estimar el tipo de IRPF basado en la base imponible
  const calculateEstimatedIRPFRate = (taxableBase: number): number => {
    if (taxableBase <= 12450) return 19;
    if (taxableBase <= 20200) return 24;
    if (taxableBase <= 35200) return 30;
    if (taxableBase <= 60000) return 37;
    if (taxableBase <= 300000) return 45;
    return 47;
  };

  return fiscalData;
};
