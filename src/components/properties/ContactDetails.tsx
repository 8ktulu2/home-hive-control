
import { Contact, Phone, Mail, Globe, User, FileText } from 'lucide-react';
import { ContactDetails as ContactDetailsType } from '@/types/property';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';

interface ContactDetailsProps {
  label: string;
  value: string;
  details?: ContactDetailsType;
}

const ContactDetails = ({ label, value, details }: ContactDetailsProps) => {
  if (!details) {
    return (
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{value || 'No especificado'}</p>
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary underline hover:text-primary/80 transition-colors">
            {value || 'No especificado'}
          </p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Contact className="h-4 w-4" />
            <span>Información de contacto: {value}</span>
          </h4>
          
          {details.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${details.phone}`} className="text-sm hover:underline">
                {details.phone}
              </a>
            </div>
          )}
          
          {details.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${details.email}`} className="text-sm hover:underline">
                {details.email}
              </a>
            </div>
          )}
          
          {details.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={details.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                {details.website}
              </a>
            </div>
          )}
          
          {details.contactPerson && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{details.contactPerson}</span>
            </div>
          )}
          
          {details.notes && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{details.notes}</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ContactDetails;
