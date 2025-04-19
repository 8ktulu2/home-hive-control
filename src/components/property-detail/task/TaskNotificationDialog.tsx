
import { TaskNotification } from '@/types/property';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TaskNotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notification: TaskNotification) => void;
  currentNotification?: TaskNotification;
}

export const TaskNotificationDialog = ({
  isOpen,
  onClose,
  onSave,
  currentNotification
}: TaskNotificationDialogProps) => {
  const [enabled, setEnabled] = useState(false);
  const [date, setDate] = useState('');

  useEffect(() => {
    if (currentNotification) {
      setEnabled(currentNotification.enabled);
      setDate(currentNotification.date);
    } else {
      setEnabled(false);
      setDate('');
    }
  }, [currentNotification]);

  const handleSave = () => {
    onSave({
      enabled,
      date,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Notificación</DialogTitle>
          <DialogDescription>
            Establece un recordatorio para esta tarea
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              id="notification-switch"
            />
            <Label htmlFor="notification-switch">
              {enabled ? 'Notificación activada' : 'Notificación desactivada'}
            </Label>
          </div>
          
          {enabled && (
            <div className="grid gap-2">
              <Label htmlFor="notification-date">Fecha de recordatorio</Label>
              <Input
                id="notification-date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>Recibirás una notificación en la fecha indicada</span>
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
