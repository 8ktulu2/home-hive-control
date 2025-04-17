
import { useState } from 'react';
import { Contact, Phone, Mail, Globe, User, FileText, ExternalLink } from 'lucide-react';
import { ContactDetails as ContactDetailsType } from '@/types/property';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactDetailsProps {
  label: string;
  value: string;
  details?: ContactDetailsType;
}

const ContactDetails = ({ label, value, details }: ContactDetailsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const hasDetails = details && (
    details.phone || 
    details.email || 
    details.website || 
    details.contactPerson || 
    details.notes
  );

  if (!hasDetails) {
    return (
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{value || 'No especificado'}</p>
      </div>
    );
  }
  
  return (
    <>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <button 
          onClick={() => setIsDialogOpen(true)} 
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {value || 'No especificado'}
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Contact className="h-5 w-5" />
              <span>Detalles de contacto: {value}</span>
            </DialogTitle>
            <DialogDescription>
              Información de contacto y detalles adicionales.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {details.phone && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Teléfono</p>
                  <a href={`tel:${details.phone}`} className="text-sm text-primary hover:underline">
                    {details.phone}
                  </a>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                  <a href={`tel:${details.phone}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
            
            {details.email && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <a href={`mailto:${details.email}`} className="text-sm text-primary hover:underline">
                    {details.email}
                  </a>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                  <a href={`mailto:${details.email}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
            
            {details.website && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sitio web</p>
                  <a 
                    href={details.website.startsWith('http') ? details.website : `https://${details.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-primary hover:underline"
                  >
                    {details.website}
                  </a>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                  <a 
                    href={details.website.startsWith('http') ? details.website : `https://${details.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
            
            {details.contactPerson && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Persona de contacto</p>
                  <p className="text-sm">{details.contactPerson}</p>
                </div>
              </div>
            )}
            
            {details.notes && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Notas</p>
                  <p className="text-sm">{details.notes}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactDetails;
