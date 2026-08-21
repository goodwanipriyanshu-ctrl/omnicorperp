export type Role = 'ADMIN' | 'MANAGER' | 'FINANCE' | 'VIEWER';

export type Permission = 
  | 'resource.view'
  | 'resource.create'
  | 'resource.edit'
  | 'resource.delete';

export interface TenantMembership {
  tenantId: string;
  roles: Role[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  memberships: TenantMembership[];
}

export interface Tenant {
  id: string;
  name: string;
}

export type ResourceStatus = 'ACTIVE' | 'PENDING' | 'ARCHIVED';

export interface Resource {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  department: string;
  status: ResourceStatus;
  owner: string;
  value: number;
  createdAt: string;
  
  // Configuration fields (category-dependent)
  assetType?: string;
  serialNumber?: string;
  warrantyPeriod?: string;
  
  licenseType?: string;
  licenseSeats?: number;
  licenseKey?: string;
  
  serviceType?: string;
  contractDuration?: string;
  renewalRequired?: boolean;
  
  description?: string;
}

export type ResourceSortField = 'name' | 'category' | 'department' | 'status' | 'owner' | 'value' | 'createdAt';

export interface SortRule {
  field: ResourceSortField;
  direction: 'asc' | 'desc';
}

export interface FetchResourcesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortRules?: SortRule[];
  tenantId?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
