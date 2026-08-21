import React, { useEffect } from 'react';
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTenantStore } from '../../store/tenantStore';
import { mockTenants } from '../../data/mockData';
import { Building2, LayoutDashboard, Database, LogOut, ChevronDown } from 'lucide-react';
import { useRBAC } from '../../hooks/useRBAC';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { activeTenantId, setActiveTenantId } = useTenantStore();
  const { currentRoles } = useRBAC();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeTenantId && user) {
      const hasIndia = user.memberships.some(m => m.tenantId === 't-1');
      if (hasIndia) {
        setActiveTenantId('t-1');
      } else if (user.memberships.length > 0) {
        setActiveTenantId(user.memberships[0].tenantId);
      }
    }
  }, [activeTenantId, user, setActiveTenantId]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userTenants = mockTenants.filter(t => 
    user.memberships.some(m => m.tenantId === t.id)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 font-bold text-xl tracking-tight text-blue-600">
          OmniCorp <span className="text-gray-900 ml-1">ERP</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavLink 
            to="/dashboard" 
            className={({isActive}) => `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <LayoutDashboard size={18} className="shrink-0" /> Dashboard
          </NavLink>
          <NavLink 
            to="/resources" 
            className={({isActive}) => `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <Database size={18} className="shrink-0" /> Resources
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{user.name}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex w-full items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 bg-gray-100/50 px-1 py-1 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400">
            <div className="pl-2 text-gray-400">
              <Building2 size={18} />
            </div>
            <select 
              value={activeTenantId || ''} 
              onChange={(e) => setActiveTenantId(e.target.value)}
              className="appearance-none bg-transparent border-none text-sm font-semibold text-gray-900 py-1.5 pl-2 pr-8 cursor-pointer outline-none w-48 truncate"
            >
              <option value="" disabled>Select Workspace...</option>
              {userTenants.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute left-[14rem]">
              <ChevronDown size={14} className="text-gray-500" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {currentRoles.map((role, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">
                {role}
              </span>
            ))}
            {currentRoles.length === 0 && (
              <span className="text-xs text-gray-400 italic">No Roles</span>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-gray-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
