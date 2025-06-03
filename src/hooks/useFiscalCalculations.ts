
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
  taxableBase: number;
  occupancyMonths: number;
  reductionReason: string;
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
  yearRange: string;
  consolidatedSummary: {
    totalProperties: number;
    totalMonthsOccupied: number;
    averageOccupancy: number;
    averageRentability: number;
  };
}

export const useFiscalCalculations = (
  properties: Property[], 
  selectedYear: number | number[], 
  selectedPropertyId: string = 'all'
) => {
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
    },
    yearRange: '',
    consolidatedSummary: {
      totalProperties: 0,
      totalMonthsOccupied: 0,
      averageOccupancy: 0,
      averageRentability: 0
    }
  });

  const { getFilteredRecords } = useHistoricalStorage();

  useEffect(() => {
    calculateFiscalData();
  }, [properties, selectedYear, selectedPropertyId]);

  const calculateReductionForProperty = (property: Property, occupiedMonths: number): { percentage: number, reason: string } => {
    if (occupiedMonths < 1) {
      return { percentage: 0, reason: "Sin ocupación durante el año" };
    }

    if (property.taxInfo?.isPrimaryResidence) {
      if (property.taxInfo?.isTensionedArea && property.taxInfo?.rentReduction) {
        return { 
          percentage: 90, 
          reason: "Zona tensionada con reducción del precio de alquiler (≥5%)" 
        };
      }
      
      if (property.taxInfo?.isTensionedArea && property.taxInfo?.hasYoungTenant) {
        return { 
          percentage: 70, 
          reason: "Zona tensionada con inquilino joven (18-35 años)" 
        };
      }
      
      if (property.taxInfo?.recentlyRenovated) {
        return { 
          percentage: 60, 
          reason: "Obras de rehabilitación previas al contrato" 
        };
      }
      
      return { 
        percentage: 50, 
        reason: "Reducción general para arrendamiento de vivienda habitual" 
      };
    }
    
    return { 
      percentage: 0, 
      reason: "No es vivienda habitual - sin reducción aplicable" 
    };
  };

  const getCurrentYearDataFromProperty = (property: Property): HistoricalRecord[] => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    // Generate current year data from property payment history
    const currentYearRecords: HistoricalRecord[] = [];
    
    for (let month = 0; month <= currentMonth; month++) {
      const paymentRecord = property.paymentHistory?.find(p => 
        p.month === month && p.year === currentYear
      );
      
      const monthlyMortgage = property.mortgage?.monthlyPayment || 0;
      const monthlyIBI = (property.ibi || 0) / 12;
      const monthlyCommunity = property.communityFee || 0;
      const monthlyHomeInsurance = (property.homeInsurance?.cost || 0) / 12;
      const monthlyLifeInsurance = (property.lifeInsurance?.cost || 0) / 12;
      
      const totalExpenses = monthlyMortgage + monthlyIBI + monthlyCommunity + 
                           monthlyHomeInsurance + monthlyLifeInsurance;
      
      const record: HistoricalRecord = {
        id: `current-${property.id}-${currentYear}-${month}`,
        propiedadId: property.id,
        año: currentYear,
        mes: month + 1,
        ingresos: paymentRecord?.isPaid ? property.rent : 0,
        gastos: totalExpenses,
        categorias: {
          alquiler: paymentRecord?.isPaid ? property.rent : 0,
          hipoteca: monthlyMortgage,
          comunidad: monthlyCommunity,
          ibi: monthlyIBI,
          seguroVida: monthlyLifeInsurance,
          seguroHogar: monthlyHomeInsurance,
          compras: 0,
          averias: 0,
          suministros: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      currentYearRecords.push(record);
    }
    
    return currentYearRecords;
  };

  const calculateFiscalData = () => {
    const years = Array.isArray(selectedYear) ? selectedYear : [selectedYear];
    const filteredProperties = selectedPropertyId === 'all' 
      ? properties 
      : properties.filter(p => p.id === selectedPropertyId);
    
    let allRecords: HistoricalRecord[] = [];
    const currentYear = new Date().getFullYear();
    
    years.forEach(year => {
      if (year === currentYear) {
        // Use current year data from properties
        filteredProperties.forEach(property => {
          const currentYearData = getCurrentYearDataFromProperty(property);
          allRecords = [...allRecords, ...currentYearData];
        });
      } else {
        // Use historical data
        const yearRecords = getFilteredRecords(year, selectedPropertyId);
        allRecords = [...allRecords, ...yearRecords];
      }
    });
    
    let totalGrossIncome = 0;
    let totalExpenses = 0;
    let totalNetProfit = 0;
    let totalTaxableBase = 0;
    let totalOccupiedMonths = 0;
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
      
      const { percentage: reductionPercentage, reason: reductionReason } = 
        calculateReductionForProperty(property, occupiedMonths);
      
      const reducedProfit = propertyNetProfit * (reductionPercentage / 100);
      const propertyTaxableBase = Math.max(0, propertyNetProfit - reducedProfit);
      
      totalGrossIncome += propertyGrossIncome;
      totalExpenses += propertyExpenses;
      totalNetProfit += propertyNetProfit;
      totalTaxableBase += propertyTaxableBase;
      totalOccupiedMonths += occupiedMonths;
      
      propertyDetails.push({
        id: property.id,
        name: property.name,
        address: property.address,
        grossIncome: propertyGrossIncome,
        expenses: propertyExpenses,
        netProfit: propertyNetProfit,
        reductionPercentage,
        reducedProfit,
        taxableBase: propertyTaxableBase,
        occupancyMonths: occupiedMonths,
        reductionReason,
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

    const yearRange = years.length === 1 
      ? years[0].toString() 
      : `${Math.min(...years)}-${Math.max(...years)}`;

    const totalProperties = filteredProperties.length;
    const maxPossibleMonths = totalProperties * years.length * 12;
    const averageOccupancy = maxPossibleMonths > 0 ? (totalOccupiedMonths / maxPossibleMonths) * 100 : 0;
    const averageRentability = totalGrossIncome > 0 ? (totalNetProfit / totalGrossIncome) * 100 : 0;
    
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
      expenseBreakdown: totalExpenseBreakdown,
      yearRange,
      consolidatedSummary: {
        totalProperties,
        totalMonthsOccupied: totalOccupiedMonths,
        averageOccupancy,
        averageRentability
      }
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
