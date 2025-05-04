
import { Tenant } from '@/types/property';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Phone, Mail, UserCheck, Home, FileText, Wallet } from 'lucide-react';

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
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {tenant.phone && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Phone className="h-5 w-5 ml-auto text-primary" />
              </div>
              <div className="col-span-3">
                <a href={`tel:${tenant.phone}`} className="text-primary hover:underline">
                  {tenant.phone}
                </a>
              </div>
            </div>
          )}
          
          {tenant.email && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Mail className="h-5 w-5 ml-auto text-primary" />
              </div>
              <a href={`mailto:${tenant.email}`} className="col-span-3 text-primary hover:underline">
                {tenant.email}
              </a>
            </div>
          )}
          
          {tenant.identificationNumber && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <UserCheck className="h-5 w-5 ml-auto text-primary" />
              </div>
              <span className="col-span-3">{tenant.identificationNumber}</span>
            </div>
          )}
          
          {tenant.alternativeAddress && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Home className="h-5 w-5 ml-auto text-primary" />
              </div>
              <span className="col-span-3">{tenant.alternativeAddress}</span>
            </div>
          )}
          
          {tenant.references && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <FileText className="h-5 w-5 ml-auto text-primary" />
              </div>
              <span className="col-span-3">{tenant.references}</span>
            </div>
          )}
          
          {tenant.economicSolvency && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Wallet className="h-5 w-5 ml-auto text-primary" />
              </div>
              <span className="col-span-3">{tenant.economicSolvency}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantDialog;
