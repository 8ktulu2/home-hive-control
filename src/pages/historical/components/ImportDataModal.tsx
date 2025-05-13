
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProperties } from '@/data/mockData';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportDataModal = ({ isOpen, onClose }: ImportDataModalProps) => {
  const handleImportData = () => {
    toast.success("Datos importados correctamente");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Datos Históricos</DialogTitle>
          <DialogDescription>
            Añade datos históricos anteriores a la app para un registro completo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="property">Propiedad</Label>
            <Select>
              <SelectTrigger id="property">
                <SelectValue placeholder="Selecciona una propiedad" />
              </SelectTrigger>
              <SelectContent>
                {mockProperties.map(property => (
                  <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mes</Label>
              <Select>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Enero</SelectItem>
                  <SelectItem value="2">Febrero</SelectItem>
                  <SelectItem value="3">Marzo</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Mayo</SelectItem>
                  <SelectItem value="6">Junio</SelectItem>
                  <SelectItem value="7">Julio</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Septiembre</SelectItem>
                  <SelectItem value="10">Octubre</SelectItem>
                  <SelectItem value="11">Noviembre</SelectItem>
                  <SelectItem value="12">Diciembre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Select>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Registro</Label>
            <Select>
              <SelectTrigger id="type">
                <SelectValue placeholder="Tipo de registro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent">Ingreso por Alquiler</SelectItem>
                <SelectItem value="vacancy">Período de Vacancia</SelectItem>
                <SelectItem value="expense">Gasto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Importe</Label>
              <Input id="amount" type="number" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="impuestos">Impuestos</SelectItem>
                  <SelectItem value="comunidad">Comunidad</SelectItem>
                  <SelectItem value="seguro">Seguros</SelectItem>
                  <SelectItem value="reparaciones">Reparaciones</SelectItem>
                  <SelectItem value="suministros">Suministros</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="description">Descripción</Label>
              <span className="text-xs text-muted-foreground">Opcional</span>
            </div>
            <Input id="description" placeholder="Descripción del registro" />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleImportData}>Añadir Registro</Button>
          </div>
          
          <div className="text-center pt-2">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <span>También puedes</span>
              <Button variant="link" className="h-auto p-0">importar desde CSV</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDataModal;
