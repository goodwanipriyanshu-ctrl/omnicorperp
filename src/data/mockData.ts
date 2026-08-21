import type { User, Tenant, Resource } from '../types';

export const mockTenants: Tenant[] = [
  { id: 't-1', name: 'OmniCorp India' },
  { id: 't-2', name: 'OmniCorp Europe' },
  { id: 't-3', name: 'OmniCorp Labs' },
];

export const mockUsers: User[] = [
  {
    id: 'u-1',
    name: 'Alex Morgan',
    email: 'admin@omnicorp.demo',
    memberships: [
      { tenantId: 't-1', roles: ['ADMIN', 'FINANCE'] },
      { tenantId: 't-2', roles: ['MANAGER'] },
      { tenantId: 't-3', roles: ['VIEWER', 'FINANCE'] },
    ],
  },
  {
    id: 'u-2',
    name: 'Jordan Lee',
    email: 'manager@omnicorp.demo',
    memberships: [
      { tenantId: 't-2', roles: ['MANAGER'] },
    ],
  },
  {
    id: 'u-3',
    name: 'Taylor Smith',
    email: 'viewer@omnicorp.demo',
    memberships: [
      { tenantId: 't-3', roles: ['VIEWER', 'FINANCE'] },
    ],
  }
];

export const mockCredentials: Record<string, string> = {
  'admin@omnicorp.demo': 'OmniCorp@2026',
  'manager@omnicorp.demo': 'Manager@2026',
  'viewer@omnicorp.demo': 'Viewer@2026',
};

// Helper to generate resources
const generateResources = (tenantId: string, count: number, startId: number): Resource[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `r-${startId + i}`,
    tenantId,
    name: `Resource ${tenantId.toUpperCase()}-${i + 1}`,
    category: ['Hardware', 'Software', 'Services'][i % 3],
    department: ['IT', 'Finance', 'HR', 'Marketing', 'Operations'][i % 5],
    status: ['ACTIVE', 'PENDING', 'ARCHIVED'][i % 3] as 'ACTIVE' | 'PENDING' | 'ARCHIVED',
    owner: `User ${i + 1}`,
    value: (i + 1) * 1000,
    createdAt: new Date(Date.now() - i * 100000000).toISOString()
  }));
};

export const mockResources: Resource[] = [
  ...generateResources('t-1', 10, 100),
  ...generateResources('t-2', 8, 200),
  ...generateResources('t-3', 6, 300),
];
