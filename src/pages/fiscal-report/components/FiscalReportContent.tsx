
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { mockProperties } from '@/data/mockData';
import FiscalInfoModal from '@/components/finances/historical/fiscal/components/FiscalInfoModal';
import SelectionSection from './SelectionSection';
import SummarySection from './SummarySection';

const FiscalReportContent = () => {
  // Estado para propiedades simuladas
  const [properties, setProperties] = useState(mockProperties);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado para gestionar años disponibles
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({length: 5}, (_, i) => currentYear - i);
  
  // Estados para selecciones
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([currentYear - 1]);
  const [showFiscalInfoModal, setShowFiscalInfoModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Cargar propiedades desde localStorage si están disponibles
  useEffect(() => {
    const loadProperties = () => {
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        try {
          const parsedProperties = JSON.parse(savedProperties);
          setProperties(parsedProperties);
        } catch (error) {
          console.error("Error loading properties from localStorage:", error);
        }
      }
    };
    
    loadProperties();
  }, []);

  // Filter properties based on search query
  const filteredProperties = searchQuery.trim() 
    ? properties.filter(property => 
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        property.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : properties;

  // Manejar selección de propiedades
  const handlePropertyToggle = (propertyId: string) => {
    setSelectedPropertyIds(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  // Manejar selección de años
  const handleYearToggle = (year: number) => {
    setSelectedYears(prev => {
      if (prev.includes(year)) {
        return prev.filter(y => y !== year);
      } else {
        return [...prev, year];
      }
    });
  };

  // Manejar búsqueda
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Seleccionar todas las propiedades
  const handleSelectAllProperties = () => {
    if (selectedPropertyIds.length === filteredProperties.length) {
      setSelectedPropertyIds([]);
    } else {
      setSelectedPropertyIds(filteredProperties.map(p => p.id));
    }
  };

  // Seleccionar todos los años
  const handleSelectAllYears = () => {
    if (selectedYears.length === availableYears.length) {
      setSelectedYears([]);
    } else {
      setSelectedYears([...availableYears]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Informes Fiscales</h1>
        <div className="flex flex-wrap gap-2 ml-auto">
          <Button 
            variant="outline"
            onClick={() => setShowFiscalInfoModal(true)}
            className="flex items-center gap-2 border-blue-600 text-blue-700"
            title="Ver información detallada sobre datos fiscales"
          >
            <HelpCircle className="h-4 w-4" /> Guía Fiscal
          </Button>
        </div>
      </div>

      <SelectionSection 
        properties={filteredProperties}
        selectedPropertyIds={selectedPropertyIds}
        availableYears={availableYears}
        selectedYears={selectedYears}
        onPropertyToggle={handlePropertyToggle}
        onYearToggle={handleYearToggle}
        onSelectAllProperties={handleSelectAllProperties}
        onSelectAllYears={handleSelectAllYears}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <SummarySection 
        properties={properties}
        selectedPropertyIds={selectedPropertyIds}
        selectedYears={selectedYears}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
      />
      
      <FiscalInfoModal 
        open={showFiscalInfoModal} 
        onOpenChange={setShowFiscalInfoModal} 
      />
    </div>
  );
};

export default FiscalReportContent;
