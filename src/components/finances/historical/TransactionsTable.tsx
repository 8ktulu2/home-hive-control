
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/lib/formatters';
import { FileText, Filter, Search } from 'lucide-react';

interface TransactionsTableProps {
  transactions: any[];
  filteredPropertyId?: string;
  onTransactionClick: (transaction: any) => void;
}

const TransactionsTable = ({ 
  transactions, 
  filteredPropertyId, 
  onTransactionClick 
}: TransactionsTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Property filter
    if (filteredPropertyId && transaction.propertyId !== filteredPropertyId) {
      return false;
    }
    
    // Search query
    if (
      searchQuery && 
      !transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !transaction.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Type filter
    if (typeFilter !== 'all' && transaction.type !== typeFilter) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== 'all' && transaction.category !== categoryFilter) {
      return false;
    }
    
    return true;
  });
  
  // Get unique categories for filter
  const categories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <Card className="bg-[#292F3F] border-none">
      <CardHeader>
        <CardTitle className="text-white">Transacciones</CardTitle>
        <CardDescription className="text-[#8E9196]">
          Registro de todos los ingresos y gastos
        </CardDescription>
      </CardHeader>
      
      <div className="px-4 pb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transacciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#1A1F2C] border-[#8E9196]/40"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] bg-[#1A1F2C] border-[#8E9196]/40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Ingresos</SelectItem>
                <SelectItem value="expense">Gastos</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px] bg-[#1A1F2C] border-[#8E9196]/40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'rent' ? 'Alquiler' : 
                      category === 'comunidad' ? 'Comunidad' :
                      category === 'impuestos' ? 'Impuestos' :
                      category === 'seguro' ? 'Seguros' :
                      category === 'suministros' ? 'Suministros' :
                      category === 'reparaciones' ? 'Reparaciones' :
                      category === 'otros' ? 'Otros' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-[#8E9196]/30">
                <TableHead className="text-[#E5DEFF]">Fecha</TableHead>
                <TableHead className="text-[#E5DEFF]">Descripción</TableHead>
                <TableHead className="text-[#E5DEFF]">Propiedad</TableHead>
                <TableHead className="text-[#E5DEFF]">Categoría</TableHead>
                <TableHead className="text-[#E5DEFF] text-right">Importe</TableHead>
                <TableHead className="text-[#E5DEFF] text-right">Documentos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <TableRow 
                    key={transaction.id}
                    className="border-b border-[#8E9196]/10 hover:bg-[#292F3F]/60 cursor-pointer"
                    onClick={() => onTransactionClick(transaction)}
                  >
                    <TableCell className="text-white">
                      {format(new Date(transaction.date), 'dd MMM yyyy', {locale: es})}
                    </TableCell>
                    <TableCell className="text-white">
                      {transaction.description}
                    </TableCell>
                    <TableCell className="text-white">
                      {transaction.propertyName}
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        transaction.type === 'income' 
                          ? "bg-green-500/20 text-green-500 border border-green-500" 
                          : "bg-amber-500/20 text-amber-500 border border-amber-500"
                      }>
                        {transaction.category === 'rent' ? 'Alquiler' : 
                          transaction.category === 'comunidad' ? 'Comunidad' :
                          transaction.category === 'impuestos' ? 'Impuestos' :
                          transaction.category === 'seguro' ? 'Seguros' :
                          transaction.category === 'suministros' ? 'Suministros' :
                          transaction.category === 'reparaciones' ? 'Reparaciones' :
                          transaction.category === 'otros' ? 'Otros' : transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right ${
                      transaction.amount >= 0 ? 'text-green-500' : 'text-amber-500'
                    }`}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.documents && transaction.documents.length > 0 ? (
                        <div className="flex justify-end">
                          <Badge variant="outline" className="border-[#8E9196]/40">
                            <FileText className="h-3 w-3 mr-1" />
                            {transaction.documents.length}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-[#8E9196] text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-[#8E9196] py-8">
                    No se encontraron transacciones que coincidan con los filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
