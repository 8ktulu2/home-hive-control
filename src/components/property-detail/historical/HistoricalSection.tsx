
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useHistoricalStorage } from '@/hooks/useHistoricalStorage';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface HistoricalSectionProps {
  property: Property;
  onYearSelect: (year: number) => void;
}

const HistoricalSection: React.FC<HistoricalSectionProps> = ({ property, onYearSelect }) => {
  const { getAvailableYears, saveRecord } = useHistoricalStorage();
  const [isAddYearDialogOpen, setIsAddYearDialogOpen] = useState(false);
  const [newYear, setNewYear] = useState('');
  
  const currentYear = new Date().getFullYear();
  const availableYears = getAvailableYears().filter(year => year < currentYear);
  
  // Generate years from 2020 to previous year, mark which ones have data
  const historicalYears = Array.from(
    { length: currentYear - 2020 }, 
    (_, i) => currentYear - 1 - i
  );

  const handleAddCustomYear = () => {
    const yearNumber = parseInt(newYear);
    
    if (isNaN(yearNumber)) {
      toast.error('Por favor, introduce un año válido');
      return;
    }
    
    if (yearNumber >= currentYear) {
      toast.error('Solo se pueden añadir años anteriores al actual');
      return;
    }
    
    if (yearNumber < 2000) {
      toast.error('Por favor, introduce un año más reciente');
      return;
    }
    
    console.log(`Adding historical year ${yearNumber} for property ${property.id}`);
    
    // Create initial records for all 12 months to make the year available
    const defaultCategories = {
      alquiler: property.rent || 0,
      hipoteca: property.mortgage?.monthlyPayment || 0,
      comunidad: property.communityFee || 0,
      ibi: (property.ibi || 0) / 12,
      seguroVida: (property.lifeInsurance?.cost || 0) / 12,
      seguroHogar: (property.homeInsurance?.cost || 0) / 12,
      compras: 0,
      averias: 0,
      suministros: 0
    };
    
    // Save records for all 12 months to initialize the year properly
    let allSuccess = true;
    for (let month = 0; month < 12; month++) {
      const success = saveRecord(property.id, yearNumber, month, defaultCategories);
      if (!success) {
        allSuccess = false;
        break;
      }
    }
    
    if (allSuccess) {
      setIsAddYearDialogOpen(false);
      setNewYear('');
      toast.success(`Año ${yearNumber} añadido al histórico con datos iniciales`);
      // Navigate to the new year immediately
      onYearSelect(yearNumber);
    } else {
      toast.error('Error al añadir el año histórico');
    }
  };

  const handleYearClick = (year: number) => {
    console.log(`Selecting historical year: ${year}`);
    onYearSelect(year);
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg mb-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Histórico:</span>
        <div className="flex items-center gap-2">
          {historicalYears.map((year) => {
            const hasData = availableYears.includes(year);
            return (
              <Button
                key={year}
                onClick={() => handleYearClick(year)}
                variant="ghost"
                size="sm"
                className={`h-8 px-3 text-xs ${
                  hasData 
                    ? 'text-blue-700 hover:bg-blue-100 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {year}
                {hasData && <span className="ml-1 text-xs">●</span>}
              </Button>
            );
          })}
        </div>
      </div>
      
      <Dialog open={isAddYearDialogOpen} onOpenChange={setIsAddYearDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            size="sm" 
            className="flex items-center gap-1 h-8 px-3 text-xs"
          >
            <Plus className="h-3 w-3" />
            Agregar Año
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Año Histórico</DialogTitle>
            <DialogDescription>
              Introduce el año que deseas añadir al histórico de la propiedad. Se crearán datos iniciales para todos los meses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Año
              </Label>
              <Input
                id="year"
                type="number"
                placeholder="ej. 2020"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="col-span-3"
                min="2000"
                max={currentYear - 1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddYearDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCustomYear}>
              Agregar Año
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoricalSection;
