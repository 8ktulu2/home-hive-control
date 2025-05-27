
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { HistoricalEntry, HistoricalFilters } from '@/types/historical';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Euro, Calendar, FileText, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface HistoricalEntriesListProps {
  entries: HistoricalEntry[];
  properties: Property[];
  onEdit: (entry: HistoricalEntry) => void;
  onDelete: (id: string) => void;
}

const HistoricalEntriesList: React.FC<HistoricalEntriesListProps> = ({
  entries,
  properties,
  onEdit,
  onDelete
}) => {
  const [filters, setFilters] = useState<HistoricalFilters>({});

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Filtrar entradas
  const filteredEntries = entries.filter(entry => {
    if (filters.propertyId && entry.propertyId !== filters.propertyId) return false;
    if (filters.year && entry.year !== filters.year) return false;
    if (filters.type && entry.type !== filters.type) return false;
    if (filters.category && entry.category !== filters.category) return false;
    return true;
  });

  // Ordenar por fecha más reciente
  const sortedEntries = filteredEntries.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  // Obtener años únicos y filtrar valores válidos
  const availableYears = [...new Set(entries.map(e => e.year))]
    .filter(year => year && !isNaN(year))
    .sort((a, b) => b - a);

  // Filtrar propiedades válidas
  const validProperties = properties.filter(property => 
    property.id && 
    property.id.trim() !== '' && 
    property.name && 
    property.name.trim() !== ''
  );

  const getTypeIcon = (type: HistoricalEntry['type']) => {
    switch (type) {
      case 'income':
        return <Euro className="h-4 w-4 text-green-600" />;
      case 'expense':
        return <Euro className="h-4 w-4 text-red-600" />;
      case 'occupancy':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'incident':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: HistoricalEntry['type']) => {
    switch (type) {
      case 'income': return 'Ingreso';
      case 'expense': return 'Gasto';
      case 'occupancy': return 'Ocupación';
      case 'incident': return 'Incidencia';
      default: return type;
    }
  };

  const getCategoryLabel = (category?: string) => {
    const categories: Record<string, string> = {
      rent: 'Alquiler',
      deposit: 'Fianza',
      ibi: 'IBI',
      community: 'Comunidad',
      insurance: 'Seguros',
      maintenance: 'Mantenimiento',
      repairs: 'Reparaciones',
      utilities: 'Suministros',
      legal: 'Gastos Legales',
      other: 'Otros'
    };
    return categories[category || ''] || category;
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Propiedad</label>
              <Select value={filters.propertyId || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyId: value === 'all' ? undefined : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las propiedades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las propiedades</SelectItem>
                  {validProperties.length > 0 ? (
                    validProperties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-properties" disabled>
                      No hay propiedades disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Año</label>
              <Select value={filters.year?.toString() || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, year: value === 'all' ? undefined : parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los años" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los años</SelectItem>
                  {availableYears.length > 0 ? (
                    availableYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-years" disabled>
                      No hay años disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tipo</label>
              <Select value={filters.type || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value === 'all' ? undefined : value as HistoricalEntry['type'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="income">Ingresos</SelectItem>
                  <SelectItem value="expense">Gastos</SelectItem>
                  <SelectItem value="occupancy">Ocupación</SelectItem>
                  <SelectItem value="incident">Incidencias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFilters({})}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de registros */}
      <div className="space-y-3">
        {sortedEntries.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600">No hay registros históricos</p>
                <p className="text-sm text-gray-500">Los registros que añadas aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedEntries.map(entry => (
            <Card key={entry.id} className="border-l-4 border-l-blue-500 bg-blue-50/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(entry.type)}
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        🔙 Histórico
                      </Badge>
                      <Badge variant="outline">
                        {getTypeLabel(entry.type)}
                      </Badge>
                      {entry.category && (
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(entry.category)}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Propiedad</p>
                        <p className="font-semibold">{entry.propertyName}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600">Fecha</p>
                        <p className="font-semibold">{months[entry.month]} {entry.year}</p>
                      </div>

                      {entry.amount !== undefined && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Importe</p>
                          <p className={`font-semibold text-lg ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {entry.type === 'expense' && '-'}{formatCurrency(entry.amount)}
                          </p>
                        </div>
                      )}

                      {entry.type === 'occupancy' && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Estado</p>
                          <div className="flex items-center gap-2">
                            <Badge variant={entry.isOccupied ? 'default' : 'secondary'}>
                              {entry.isOccupied ? 'Ocupada' : 'Vacía'}
                            </Badge>
                            {entry.tenantName && (
                              <span className="text-sm text-gray-600">({entry.tenantName})</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-600">Descripción</p>
                      <p className="text-gray-800">{entry.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(entry)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(entry.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Resumen */}
      {sortedEntries.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registros</p>
                <p className="text-2xl font-bold text-blue-600">{sortedEntries.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(sortedEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + (e.amount || 0), 0))}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Gastos</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(sortedEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + (e.amount || 0), 0))}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Balance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    sortedEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + (e.amount || 0), 0) -
                    sortedEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + (e.amount || 0), 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HistoricalEntriesList;
