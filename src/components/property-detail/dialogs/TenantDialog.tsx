
import { Tenant } from '@/types/property';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';

interface TenantDialogProps {
  tenant: Tenant | null;
  onClose: () => void;
}

const TenantDialog = ({ tenant, onClose }: TenantDialogProps) => {
  if (!tenant) return null;

  return (
    <Dialog open={!!tenant} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tenant.name}</DialogTitle>
          <DialogDescription>
            Información de contacto del inquilino
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {tenant.phone && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Teléfono:</Label>
              <div className="col-span-3 flex items-center gap-2">
                <a href={`tel:${tenant.phone}`} className="text-primary hover:underline flex items-center gap-2">
                  {tenant.phone}
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
          
          {tenant.email && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email:</Label>
              <a href={`mailto:${tenant.email}`} className="col-span-3 text-primary hover:underline">
                {tenant.email}
              </a>
            </div>
          )}
          
          {tenant.identificationNumber && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">DNI/NIE:</Label>
              <span className="col-span-3">{tenant.identificationNumber}</span>
            </div>
          )}
          
          {tenant.alternativeAddress && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Dirección Alternativa:</Label>
              <span className="col-span-3">{tenant.alternativeAddress}</span>
            </div>
          )}
          
          {tenant.references && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Referencias:</Label>
              <span className="col-span-3">{tenant.references}</span>
            </div>
          )}
          
          {tenant.economicSolvency && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Solvencia Económica:</Label>
              <span className="col-span-3">{tenant.economicSolvency}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantDialog;
