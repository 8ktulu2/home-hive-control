
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';

const PropertyDetailLoader = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Skeleton className="w-20 h-20 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-10 w-[100px]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetailLoader;
