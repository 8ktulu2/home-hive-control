
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Property } from '@/types/property';
import { useFiscalData } from '@/components/finances/historical/fiscal/hooks/useFiscalData';
import { generateHistoricalData } from './utils/fiscalReportUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface FiscalReportTableProps {
  properties: Property[];
  selectedPropertyIds: string[];
  selectedYears: number[];
  isLoading?: boolean;
}

const FiscalReportTable: React.FC<FiscalReportTableProps> = ({
  properties,
  selectedPropertyIds,
  selectedYears,
  isLoading = false
}) => {
  // Filter properties based on selection
  const selectedProperties = properties.filter(
    property => selectedPropertyIds.includes(property.id)
  );

  // Generate fiscal data for table
  const fiscalReportData = React.useMemo(() => {
    const data: Array<{
      propertyId: string;
      propertyName: string;
      year: number;
      totalIncome: number;
      totalExpenses: number;
      netIncome: number;
      reducedNetProfit: number;
      applicableReduction: number;
    }> = [];

    selectedProperties.forEach(property => {
      selectedYears.forEach(year => {
        // Generate historical data for this property and year
        const historicalData = generateHistoricalData(property.id, property, year);
        
        // Get fiscal data using the existing hook
        const { fiscalData } = useFiscalData([historicalData], year);
        const propertyFiscalData = fiscalData[property.id];
        
        if (propertyFiscalData) {
          data.push({
            propertyId: property.id,
            propertyName: property.name,
            year: year,
            totalIncome: propertyFiscalData.totalIncome || 0,
            totalExpenses: propertyFiscalData.totalExpenses || 0,
            netIncome: propertyFiscalData.netIncome || 0,
            reducedNetProfit: propertyFiscalData.reducedNetProfit || 0,
            applicableReduction: propertyFiscalData.applicableReduction || 0,
          });
        }
      });
    });

    return data;
  }, [selectedProperties, selectedYears]);

  if (selectedPropertyIds.length === 0 || selectedYears.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-muted-foreground border-2 border-dashed rounded-md">
        Selecciona propiedades y años para visualizar el informe
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Propiedad</TableHead>
            <TableHead>Año</TableHead>
            <TableHead className="text-right">Ingresos</TableHead>
            <TableHead className="text-right">Gastos</TableHead>
            <TableHead className="text-right">Resultado</TableHead>
            <TableHead className="text-right">Reducción</TableHead>
            <TableHead className="text-right">A declarar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fiscalReportData.length > 0 ? (
            fiscalReportData.map((item, index) => (
              <TableRow key={`${item.propertyId}-${item.year}-${index}`}>
                <TableCell className="font-medium">{item.propertyName}</TableCell>
                <TableCell>{item.year}</TableCell>
                <TableCell className="text-right">{item.totalIncome.toFixed(2)}€</TableCell>
                <TableCell className="text-right">{item.totalExpenses.toFixed(2)}€</TableCell>
                <TableCell className="text-right font-semibold">
                  {item.netIncome.toFixed(2)}€
                </TableCell>
                <TableCell className="text-right">
                  {item.applicableReduction}%
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {item.reducedNetProfit.toFixed(2)}€
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                No hay datos fiscales disponibles para los criterios seleccionados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FiscalReportTable;
