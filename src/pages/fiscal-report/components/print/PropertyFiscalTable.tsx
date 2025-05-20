
import React from 'react';
import { Property } from '@/types/property';
import { FiscalData } from '@/components/finances/historical/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PropertyFiscalTableProps {
  property: Property;
  selectedYears: number[];
  fiscalData: Record<string, FiscalData>;
}

const PropertyFiscalTable: React.FC<PropertyFiscalTableProps> = ({
  property,
  selectedYears,
  fiscalData
}) => {
  const propertyData = fiscalData[property.id];
  
  if (!propertyData) {
    return (
      <div className="p-4 border rounded text-center text-gray-500">
        No hay datos fiscales disponibles para esta propiedad
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="p-2 border">Año</TableHead>
            <TableHead className="p-2 border text-right">Ingresos</TableHead>
            <TableHead className="p-2 border text-right">Gastos</TableHead>
            <TableHead className="p-2 border text-right">Rendimiento</TableHead>
            <TableHead className="p-2 border text-right">Reducción</TableHead>
            <TableHead className="p-2 border text-right">A declarar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedYears.map(year => {
            const yearData = propertyData; // In a real app, you would filter by year
            
            if (!yearData) return null;
            
            const netIncome = yearData.netIncome || 0;
            const reduction = yearData.reducedNetProfit || 0;
            const taxableAmount = netIncome - reduction;
            
            return (
              <TableRow key={year} className="border-b">
                <TableCell className="p-2 border">{year}</TableCell>
                <TableCell className="p-2 border text-right">
                  {(yearData.totalIncome || 0).toFixed(2)}€
                </TableCell>
                <TableCell className="p-2 border text-right">
                  {(yearData.totalExpenses || 0).toFixed(2)}€
                </TableCell>
                <TableCell className="p-2 border text-right font-medium">
                  {netIncome.toFixed(2)}€
                </TableCell>
                <TableCell className="p-2 border text-right">
                  {reduction.toFixed(2)}€ ({yearData.applicableReduction || 0}%)
                </TableCell>
                <TableCell className="p-2 border text-right font-bold">
                  {taxableAmount.toFixed(2)}€
                </TableCell>
              </TableRow>
            );
          })}
          
          {/* Summary row */}
          <TableRow className="bg-gray-50 font-bold">
            <TableCell className="p-2 border">TOTAL</TableCell>
            <TableCell className="p-2 border text-right">
              {(propertyData.totalIncome || 0).toFixed(2)}€
            </TableCell>
            <TableCell className="p-2 border text-right">
              {(propertyData.totalExpenses || 0).toFixed(2)}€
            </TableCell>
            <TableCell className="p-2 border text-right">
              {(propertyData.netIncome || 0).toFixed(2)}€
            </TableCell>
            <TableCell className="p-2 border text-right">
              {(propertyData.reducedNetProfit || 0).toFixed(2)}€
            </TableCell>
            <TableCell className="p-2 border text-right">
              {((propertyData.netIncome || 0) - (propertyData.reducedNetProfit || 0)).toFixed(2)}€
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PropertyFiscalTable;
