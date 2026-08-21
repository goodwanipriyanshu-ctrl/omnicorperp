import React from 'react';
import { useRBAC } from '../../hooks/useRBAC';
import type { Permission } from '../../types';

interface CanProps {
  permission: Permission;
  children: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ permission, children }) => {
  const { hasPermission } = useRBAC();
  
  if (!hasPermission(permission)) {
    return null;
  }
  
  return <>{children}</>;
};
