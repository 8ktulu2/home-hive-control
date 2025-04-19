
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TaskFormProps {
  onTaskAdd: (task: { title: string; description?: string }) => void;
  onCancel: () => void;
}

export const TaskForm = ({ onTaskAdd, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onTaskAdd({
        title: title.trim(),
        description: description.trim() || undefined
      });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder="Escriba el título de la tarea..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border"
        autoFocus
      />
      <Textarea
        placeholder="Descripción (opcional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border"
        rows={2}
      />
      <div className="flex justify-end gap-2 mt-1">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={!title.trim()}>
          Añadir
        </Button>
      </div>
    </div>
  );
};
