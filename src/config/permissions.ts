import type { Role, Permission } from '../types';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'resource.view',
    'resource.create',
    'resource.edit',
    'resource.delete',
  ],
  MANAGER: [
    'resource.view',
    'resource.create',
    'resource.edit',
  ],
  FINANCE: [
    'resource.view',
  ],
  VIEWER: [
    'resource.view',
  ],
};
