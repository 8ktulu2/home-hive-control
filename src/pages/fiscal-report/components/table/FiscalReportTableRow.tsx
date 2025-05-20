
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

interface FiscalReportItem {
  propertyId: string;
  propertyName: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  reducedNetProfit: number;
  applicableReduction: number;
}

interface FiscalReportTableRowProps {
  item: FiscalReportItem;
  index: number;
}

const FiscalReportTableRow: React.FC<FiscalReportTableRowProps> = ({ item, index }) => {
  return (
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
  );
};

export default FiscalReportTableRow;
