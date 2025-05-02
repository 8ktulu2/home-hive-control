
interface EmptyDocumentStateProps {
  message?: string;
}

export const EmptyDocumentState = ({ message = "No hay documentos disponibles" }: EmptyDocumentStateProps) => {
  return (
    <div className="text-center py-6">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};
