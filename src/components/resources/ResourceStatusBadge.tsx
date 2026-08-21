import React from 'react';
import type { ResourceStatus } from '../../types';

interface BadgeProps {
  status: ResourceStatus;
}

export const ResourceStatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const colors = {
    ACTIVE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    ARCHIVED: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded border ${colors[status]}`}>
      {status}
    </span>
  );
};
