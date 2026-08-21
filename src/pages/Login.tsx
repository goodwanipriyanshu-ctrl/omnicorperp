import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTenantStore } from '../store/tenantStore';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login, isAuthenticated } = useAuthStore();
  const { setActiveTenantId } = useTenantStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await api.login(email, password);
      login(user);
        if (user.memberships.length > 0) {
          const hasIndia = user.memberships.some(m => m.tenantId === 't-1');
          setActiveTenantId(hasIndia ? 't-1' : user.memberships[0].tenantId);
        }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid email or password.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded shadow-sm mb-6">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm">
            <LogIn size={24} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">OmniCorp ERP</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Enter your credentials to access your workspace.</p>
        
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              placeholder="name@omnicorp.demo"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded pl-3 pr-10 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="••••••••"
                disabled={loading}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading || !email || !password}
            className="w-full bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      <div className="max-w-md w-full">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Demo Accounts</h3>
        <div className="space-y-3">
          
          <div className="bg-white border border-gray-200 rounded p-4 shadow-sm flex items-center justify-between hover:border-blue-300 transition-colors group">
            <div>
              <div className="text-sm font-bold text-gray-900 mb-1">ADMIN</div>
              <div className="text-xs text-gray-500 font-mono mb-2">admin@omnicorp.demo<br/>OmniCorp@2026</div>
              <div className="text-xs font-medium text-gray-700">OmniCorp India <span className="text-gray-400 font-normal">|</span> <span className="text-blue-600">ADMIN + FINANCE</span></div>
            </div>
            <button 
              onClick={() => fillDemo('admin@omnicorp.demo', 'OmniCorp@2026')}
              className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors"
            >
              Use Demo
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded p-4 shadow-sm flex items-center justify-between hover:border-blue-300 transition-colors group">
            <div>
              <div className="text-sm font-bold text-gray-900 mb-1">MANAGER</div>
              <div className="text-xs text-gray-500 font-mono mb-2">manager@omnicorp.demo<br/>Manager@2026</div>
              <div className="text-xs font-medium text-gray-700">OmniCorp Europe <span className="text-gray-400 font-normal">|</span> <span className="text-blue-600">MANAGER</span></div>
            </div>
            <button 
              onClick={() => fillDemo('manager@omnicorp.demo', 'Manager@2026')}
              className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors"
            >
              Use Demo
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded p-4 shadow-sm flex items-center justify-between hover:border-blue-300 transition-colors group">
            <div>
              <div className="text-sm font-bold text-gray-900 mb-1">VIEWER</div>
              <div className="text-xs text-gray-500 font-mono mb-2">viewer@omnicorp.demo<br/>Viewer@2026</div>
              <div className="text-xs font-medium text-gray-700">OmniCorp Labs <span className="text-gray-400 font-normal">|</span> <span className="text-blue-600">VIEWER + FINANCE</span></div>
            </div>
            <button 
              onClick={() => fillDemo('viewer@omnicorp.demo', 'Viewer@2026')}
              className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors"
            >
              Use Demo
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
