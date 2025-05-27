
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface OccupancyFieldsProps {
  isOccupied: boolean;
  tenantName: string;
  onOccupiedChange: (occupied: boolean) => void;
  onTenantNameChange: (name: string) => void;
}

const OccupancyFields: React.FC<OccupancyFieldsProps> = ({
  isOccupied,
  tenantName,
  onOccupiedChange,
  onTenantNameChange
}) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch checked={isOccupied} onCheckedChange={onOccupiedChange} />
        <Label>¿Estaba ocupada la propiedad?</Label>
      </div>

      {isOccupied && (
        <div className="space-y-2">
          <Label htmlFor="tenantName">Nombre del inquilino</Label>
          <Input
            value={tenantName}
            onChange={(e) => onTenantNameChange(e.target.value)}
            placeholder="Nombre del inquilino"
          />
        </div>
      )}
    </>
  );
};

export default OccupancyFields;
