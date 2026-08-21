import { mockResources, mockUsers, mockTenants, mockCredentials } from '../data/mockData';
import type { User, Resource, FetchResourcesParams, PaginatedResult } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApi {
  private resources = [...mockResources];

  async login(email: string, password?: string): Promise<User> {
    await delay(500);
    const validPassword = mockCredentials[email];
    if (!validPassword || validPassword !== password) {
      throw new Error('Invalid email or password.');
    }
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('Invalid email or password.');
    return user;
  }

  async getTenants() {
    await delay(300);
    return mockTenants;
  }

  async fetchResources(params: FetchResourcesParams): Promise<PaginatedResult<Resource>> {
    await delay(600); // Simulate network latency

    let filtered = [...this.resources];

    // 1. Filter by tenant
    if (params.tenantId) {
      filtered = filtered.filter(r => r.tenantId === params.tenantId);
    }

    // 2. Apply search
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.category.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q)
      );
    }

    // 3. Apply multi-column sorting
    if (params.sortRules && params.sortRules.length > 0) {
      filtered.sort((a, b) => {
        for (const rule of params.sortRules!) {
          const field = rule.field;
          const dir = rule.direction === 'desc' ? -1 : 1;
          
          if (a[field] < b[field]) return -1 * dir;
          if (a[field] > b[field]) return 1 * dir;
        }
        return 0; // all fields equal
      });
    }

    // 4. Calculate pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    
    // 5. Slice page
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    // 6. Return payload
    return {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  async createResource(resource: Omit<Resource, 'id' | 'createdAt'>): Promise<Resource> {
    await delay(600);
    const newResource: Resource = {
      ...resource,
      id: `r-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.resources.push(newResource);
    return newResource;
  }

  async updateResource(id: string, updates: Partial<Resource>): Promise<Resource> {
    await delay(500);
    const idx = this.resources.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Not found');
    
    this.resources[idx] = { ...this.resources[idx], ...updates };
    return this.resources[idx];
  }

  async deleteResource(id: string): Promise<void> {
    await delay(500);
    this.resources = this.resources.filter(r => r.id !== id);
  }
}

export const api = new MockApi();
