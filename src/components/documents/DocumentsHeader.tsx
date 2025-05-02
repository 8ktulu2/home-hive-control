
import React from 'react';

interface DocumentsHeaderProps {
  title: string;
  subtitle: string;
}

export const DocumentsHeader = ({ title, subtitle }: DocumentsHeaderProps) => {
  return (
    <div className="mb-4 max-w-full">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground text-sm">
        {subtitle}
      </p>
    </div>
  );
};
