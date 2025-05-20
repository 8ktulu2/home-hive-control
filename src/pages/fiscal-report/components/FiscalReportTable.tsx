
import React from 'react';
import { 
  Table, 
  TableBody,
  TableCell,
  TableRow
} from '@/components/ui/table';
import { Property } from '@/types/property';
import EmptyTableState from './table/EmptyTableState';
import TableSkeleton from './table/TableSkeleton';
import FiscalReportTableHeader from './table/FiscalReportTableHeader';
import FiscalReportTableRow from './table/FiscalReportTableRow';
import { useFiscalTableData } from '../hooks/useFiscalTableData';

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
  const { fiscalReportData, hasSelection } = useFiscalTableData(
    properties,
    selectedPropertyIds,
    selectedYears
  );

  if (!hasSelection) {
    return <EmptyTableState />;
  }

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <FiscalReportTableHeader />
        <TableBody>
          {fiscalReportData.length > 0 ? (
            fiscalReportData.map((item, index) => (
              <FiscalReportTableRow key={index} item={item} index={index} />
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
