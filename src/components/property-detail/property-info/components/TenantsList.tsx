
import { Tenant } from '@/types/property';
import { User, Users } from 'lucide-react';

interface TenantsListProps {
  tenants?: Tenant[];
  onTenantClick?: (tenant: Tenant) => void;
}

const TenantsList = ({ tenants, onTenantClick }: TenantsListProps) => {
  if (!tenants || tenants.length === 0) return null;
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-5 w-5 text-gray-500" />
        <h3 className="font-medium text-lg">Inquilinos</h3>
      </div>
      <div className="space-y-2">
        {tenants.map((tenant) => (
          <div 
            key={tenant.id}
            className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => onTenantClick?.(tenant)}
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{tenant.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TenantsList;
