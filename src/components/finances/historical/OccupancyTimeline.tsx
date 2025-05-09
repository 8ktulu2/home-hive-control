
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyHistoricalData } from './types';
import { formatCurrency } from '@/lib/formatters';

interface OccupancyTimelineProps {
  data: PropertyHistoricalData[];
  year: number;
}

const OccupancyTimeline = ({ data, year }: OccupancyTimelineProps) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <Card className="bg-[#292F3F] border-none">
      <CardHeader>
        <CardTitle className="text-white">Ocupación {year}</CardTitle>
        <CardDescription className="text-[#8E9196]">
          Vista general de ocupación mensual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map(property => (
            <div key={property.propertyId} className="mb-6">
              <h3 className="text-white font-medium mb-2">{property.propertyName}</h3>
              <div className="grid grid-cols-12 gap-1">
                {months.map((month, index) => {
                  const monthData = property.months.find(m => m.month === month);
                  const isOccupied = monthData?.wasRented;
                  const bgColor = isOccupied 
                    ? "bg-green-500/30 border-green-500" 
                    : "bg-red-500/20 border-red-500";
                  
                  return (
                    <div 
                      key={index} 
                      className={`relative border ${bgColor} rounded-md p-1 h-16 flex flex-col justify-between`}
                      title={`${month}: ${isOccupied ? 'Alquilado' : 'Vacante'}`}
                    >
                      <div className="text-xs text-[#E5DEFF] opacity-60 w-full text-center">{month.substring(0, 3)}</div>
                      
                      {monthData && (
                        <div className="mt-auto">
                          {isOccupied && (
                            <div className="text-white text-xs text-center font-medium">
                              {formatCurrency(monthData.rentAmount)}
                            </div>
                          )}
                          <div className={`text-xs text-center ${isOccupied ? 'text-green-300' : 'text-red-300'}`}>
                            {isOccupied ? 'Alquilado' : 'Vacío'}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="flex justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500 mr-2"></div>
              <span className="text-sm text-[#E5DEFF]">Alquilado</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500 mr-2"></div>
              <span className="text-sm text-[#E5DEFF]">Vacante</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OccupancyTimeline;
