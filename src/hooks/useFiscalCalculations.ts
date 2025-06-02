
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
  expenseBreakdown: {
    alquiler: number;
    hipoteca: number;
    comunidad: number;
    ibi: number;
    seguroVida: number;
    seguroHogar: number;
    compras: number;
    averias: number;
    suministros: number;
  };
}

export interface FiscalData {
  grossIncome: number;
  deductibleExpenses: number;
  netProfit: number;
  reductionPercentage: number;
  taxableBase: number;
  irpfQuota: number;
  retentions: number;
  finalLiquidity: number;
  propertyDetails: PropertyFiscalDetail[];
  filteredRecords: HistoricalRecord[];
  expenseBreakdown: {
    alquiler: number;
    hipoteca: number;
    comunidad: number;
    ibi: number;
    seguroVida: number;
    seguroHogar: number;
    compras: number;
    averias: number;
    suministros: number;
  };
}

export const useFiscalCalculations = (properties: Property[], selectedYear: number, selectedPropertyId: string = 'all') => {
  const [fiscalData, setFiscalData] = useState<FiscalData>({
    grossIncome: 0,
    deductibleExpenses: 0,
    netProfit: 0,
    reductionPercentage: 0,
    taxableBase: 0,
    irpfQuota: 0,
    retentions: 0,
    finalLiquidity: 0,
    propertyDetails: [],
    filteredRecords: [],
    expenseBreakdown: {
      alquiler: 0,
      hipoteca: 0,
      comunidad: 0,
      ibi: 0,
      seguroVida: 0,
      seguroHogar: 0,
      compras: 0,
      averias: 0,
      suministros: 0
    }
  });

  const { getFilteredRecords } = useHistoricalStorage();

  useEffect(() => {
    calculateFiscalData();
  }, [properties, selectedYear, selectedPropertyId]);

  const calculateFiscalData = () => {
    const filteredProperties = selectedPropertyId === 'all' 
      ? properties 
      : properties.filter(p => p.id === selectedPropertyId);
    
    const allRecords = getFilteredRecords(selectedYear, selectedPropertyId);
    
    let totalGrossIncome = 0;
    let totalExpenses = 0;
    let totalNetProfit = 0;
    let totalTaxableBase = 0;
    const propertyDetails: PropertyFiscalDetail[] = [];
    
    const totalExpenseBreakdown = {
      alquiler: 0,
      hipoteca: 0,
      comunidad: 0,
      ibi: 0,
      seguroVida: 0,
      seguroHogar: 0,
      compras: 0,
      averias: 0,
      suministros: 0
    };

    filteredProperties.forEach(property => {
      const propertyRecords = allRecords.filter(record => record.propiedadId === property.id);
      
      let propertyGrossIncome = 0;
      let propertyExpenses = 0;
      const propertyExpenseBreakdown = {
        alquiler: 0,
        hipoteca: 0,
        comunidad: 0,
        ibi: 0,
        seguroVida: 0,
        seguroHogar: 0,
        compras: 0,
        averias: 0,
        suministros: 0
      };
      
      propertyRecords.forEach(record => {
        propertyGrossIncome += record.ingresos;
        propertyExpenses += record.gastos;
        
        Object.keys(propertyExpenseBreakdown).forEach(key => {
          const categoryKey = key as keyof typeof propertyExpenseBreakdown;
          propertyExpenseBreakdown[categoryKey] += record.categorias[categoryKey] || 0;
          totalExpenseBreakdown[categoryKey] += record.categorias[categoryKey] || 0;
        });
      });
      
      const propertyNetProfit = propertyGrossIncome - propertyExpenses;
      
      const occupiedMonths = propertyRecords.filter(record => record.ingresos > 0).length;
      let reductionPercentage = 0;
      
      if (occupiedMonths >= 1) {
        reductionPercentage = (property.taxInfo?.isPrimaryResidence || 
          property.taxInfo?.isTensionedArea) ? 60 : 40;
      }
      
      if (property.taxInfo?.hasYoungTenant || property.taxInfo?.rentReduction) {
        reductionPercentage = Math.min(70, reductionPercentage + 10);
      }
      
      const reducedProfit = propertyNetProfit * (reductionPercentage / 100);
      
      totalGrossIncome += propertyGrossIncome;
      totalExpenses += propertyExpenses;
      totalNetProfit += propertyNetProfit;
      totalTaxableBase += propertyNetProfit - reducedProfit;
      
      propertyDetails.push({
        id: property.id,
        name: property.name,
        address: property.address,
        grossIncome: propertyGrossIncome,
        expenses: propertyExpenses,
        netProfit: propertyNetProfit,
        reductionPercentage,
        reducedProfit,
        occupancyMonths: occupiedMonths,
        expenseBreakdown: propertyExpenseBreakdown
      });
    });
    
    const irpfRate = calculateEstimatedIRPFRate(totalTaxableBase);
    const irpfQuota = totalTaxableBase * (irpfRate / 100);
    const retentions = totalGrossIncome * 0.19;
    const finalLiquidity = totalNetProfit - irpfQuota + retentions;
    
    const weightedReductionPercentage = totalNetProfit > 0 
      ? ((totalNetProfit - totalTaxableBase) / totalNetProfit) * 100 
      : 0;
    
    setFiscalData({
      grossIncome: totalGrossIncome,
      deductibleExpenses: totalExpenses,
      netProfit: totalNetProfit,
      reductionPercentage: Math.round(weightedReductionPercentage),
      taxableBase: totalTaxableBase,
      irpfQuota,
      retentions,
      finalLiquidity,
      propertyDetails,
      filteredRecords: allRecords,
      expenseBreakdown: totalExpenseBreakdown
    });
    
    console.log('Datos fiscales calculados:', {
      totalGrossIncome,
      totalExpenses,
      totalNetProfit,
      totalTaxableBase,
      propertyCount: propertyDetails.length,
      recordCount: allRecords.length,
      expenseBreakdown: totalExpenseBreakdown
    });
  };
  
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
