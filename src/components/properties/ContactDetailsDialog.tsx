
import { ContactDetails } from '@/types/property';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ContactDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: ContactDetails | undefined;
}

const ContactDetailsDialog = ({ isOpen, onClose, title, details }: ContactDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Información de contacto
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {details?.phone && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Teléfono:</span>
              <span className="col-span-3">{details.phone}</span>
            </div>
          )}
          
          {details?.email && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Email:</span>
              <span className="col-span-3">{details.email}</span>
            </div>
          )}
          
          {details?.website && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Sitio web:</span>
              <span className="col-span-3">{details.website}</span>
            </div>
          )}
          
          {details?.contactPerson && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Persona de contacto:</span>
              <span className="col-span-3">{details.contactPerson}</span>
            </div>
          )}
          
          {details?.notes && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Notas:</span>
              <span className="col-span-3">{details.notes}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailsDialog;
