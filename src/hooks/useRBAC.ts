import { useAuthStore } from '../store/authStore';
import { useTenantStore } from '../store/tenantStore';
import { ROLE_PERMISSIONS } from '../config/permissions';
import type { Permission, Role } from '../types';
import { useCallback, useMemo } from 'react';

export const useRBAC = () => {
  const { user } = useAuthStore();
  const { activeTenantId } = useTenantStore();

  const currentRoles = useMemo(() => {
    if (!user || !activeTenantId) return [];
    const membership = user.memberships.find(m => m.tenantId === activeTenantId);
    return membership ? membership.roles : [];
  }, [user, activeTenantId]);

  const hasPermission = useCallback((permission: Permission): boolean => {
    // Combine all permissions from all roles the user has in this tenant
    const allPermissions = new Set<Permission>();
    
    currentRoles.forEach((role: Role) => {
      const perms = ROLE_PERMISSIONS[role] || [];
      perms.forEach(p => allPermissions.add(p));
    });

    return allPermissions.has(permission);
  }, [currentRoles]);

  return { hasPermission, currentRoles };
};
