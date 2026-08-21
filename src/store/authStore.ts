import { create } from 'zustand';
import type { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedId = localStorage.getItem('demo_user_id');
  let initialUser = null;
  if (storedId) {
    const found = mockUsers.find(u => u.id === storedId);
    if (found) initialUser = found;
    else localStorage.removeItem('demo_user_id');
  }

  return {
    user: initialUser,
    isAuthenticated: !!initialUser,
    login: (user) => {
      localStorage.setItem('demo_user_id', user.id);
      set({ user, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('demo_user_id');
      set({ user: null, isAuthenticated: false });
    },
  };
});
