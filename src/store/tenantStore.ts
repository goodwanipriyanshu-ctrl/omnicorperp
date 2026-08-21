import { create } from 'zustand';

interface TenantState {
  activeTenantId: string | null;
  setActiveTenantId: (id: string) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  activeTenantId: null,
  setActiveTenantId: (id) => set({ activeTenantId: id }),
}));
