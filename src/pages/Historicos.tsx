
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronRight, History, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useHistoricalMigration } from '@/hooks/useHistoricalMigration';

interface HistoricalPropertyData {
  propertyId: string;
  propertyName: string;
  years: number[];
}

const Historicos = () => {
  const [expandedProperties, setExpandedProperties] = useState<string[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalPropertyData[]>([]);
  const navigate = useNavigate();
  const { checkAndMigrateData, getHistoricalData } = useHistoricalMigration();

  useEffect(() => {
    // Verificar si es necesaria la migración automática
    checkAndMigrateData();
    
    // Cargar datos históricos
    loadHistoricalData();
  }, []);

  const loadHistoricalData = () => {
    const data = getHistoricalData();
    setHistoricalData(data);
  };

  const toggleProperty = (propertyId: string) => {
    setExpandedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleYearClick = (propertyId: string, year: number) => {
    // Navegar a la vista histórica específica de la propiedad para ese año
    navigate(`/historicos/property/${propertyId}/${year}`);
  };

  if (historicalData.length === 0) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <History className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Históricos</h1>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay datos históricos disponibles</h3>
              <p className="text-muted-foreground">
                Los datos históricos se crearán automáticamente al inicio de cada nuevo año.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <History className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Históricos</h1>
          <Badge variant="secondary" className="ml-2">
            {historicalData.length} {historicalData.length === 1 ? 'Propiedad' : 'Propiedades'}
          </Badge>
        </div>

        <div className="space-y-4">
          {historicalData.map((property) => (
            <Card key={property.propertyId} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleProperty(property.propertyId)}
                >
                  <CardTitle className="flex items-center gap-2">
                    {expandedProperties.includes(property.propertyId) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {property.propertyName}
                  </CardTitle>
                  <Badge variant="outline">
                    {property.years.length} {property.years.length === 1 ? 'año' : 'años'}
                  </Badge>
                </div>
              </CardHeader>
              
              {expandedProperties.includes(property.propertyId) && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {property.years.sort((a, b) => b - a).map((year) => (
                      <Button
                        key={year}
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        onClick={() => handleYearClick(property.propertyId, year)}
                      >
                        <Calendar className="h-4 w-4" />
                        {year}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Historicos;
