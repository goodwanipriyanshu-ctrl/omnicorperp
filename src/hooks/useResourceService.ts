import { useCallback } from 'react';
import { api } from '../lib/api';
import { useRBAC } from './useRBAC';
import type { Resource, FetchResourcesParams } from '../types';
import { useTenantStore } from '../store/tenantStore';

export const useResourceService = () => {
  const { hasPermission } = useRBAC();
  const { activeTenantId } = useTenantStore();

  const fetchResources = useCallback(async (params?: Omit<FetchResourcesParams, 'tenantId'>) => {
    if (!hasPermission('resource.view')) {
      throw new Error('Unauthorized: Missing resource.view permission');
    }
    if (!activeTenantId) throw new Error('No active tenant');
    
    return api.fetchResources({ ...params, tenantId: activeTenantId });
  }, [hasPermission, activeTenantId]);

  const createResource = useCallback(async (data: Omit<Resource, 'id' | 'createdAt'>) => {
    if (!hasPermission('resource.create')) {
      throw new Error('Unauthorized: Missing resource.create permission');
    }
    return api.createResource(data);
  }, [hasPermission]);

  const updateResource = useCallback(async (id: string, updates: Partial<Resource>) => {
    if (!hasPermission('resource.edit')) {
      throw new Error('Unauthorized: Missing resource.edit permission');
    }
    return api.updateResource(id, updates);
  }, [hasPermission]);

  const deleteResource = useCallback(async (id: string) => {
    if (!hasPermission('resource.delete')) {
      throw new Error('Unauthorized: Missing resource.delete permission');
    }
    return api.deleteResource(id);
  }, [hasPermission]);

  return { fetchResources, createResource, updateResource, deleteResource };
};
