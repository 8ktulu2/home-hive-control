
import { ContactDetails } from '@/types/property';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Phone } from 'lucide-react';

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
              <div className="col-span-3 flex items-center gap-2">
                <a href={`tel:${details.phone}`} className="text-primary hover:underline">
                  {details.phone}
                </a>
                <Phone className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          )}
          
          {details?.email && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Email:</span>
              <a 
                href={`mailto:${details.email}`} 
                className="col-span-3 text-primary hover:underline"
              >
                {details.email}
              </a>
            </div>
          )}
          
          {details?.website && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Sitio web:</span>
              <a 
                href={details.website.startsWith('http') ? details.website : `https://${details.website}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="col-span-3 text-primary hover:underline"
              >
                {details.website}
              </a>
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
