
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TableSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
};

export default TableSkeleton;
