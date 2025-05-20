
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FiscalReportTableHeader: React.FC = () => {
  return (
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
  );
};

export default FiscalReportTableHeader;
