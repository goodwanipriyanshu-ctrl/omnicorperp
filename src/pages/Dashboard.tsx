import React, { useEffect, useState } from 'react';
import { useTenantStore } from '../store/tenantStore';
import { mockTenants } from '../data/mockData';
import { useResourceService } from '../hooks/useResourceService';
import { CheckCircle2, Clock, IndianRupee, Database } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Skeleton } from '../components/ui/Skeleton';

export const Dashboard: React.FC = () => {
  const { activeTenantId } = useTenantStore();
  const { fetchResources } = useResourceService();
  
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, value: 0 });
  const [statusData, setStatusData] = useState<{name: string, value: number}[]>([]);
  const [deptData, setDeptData] = useState<{name: string, value: number}[]>([]);
  const [loading, setLoading] = useState(true);

  const tenant = mockTenants.find(t => t.id === activeTenantId);

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      if (!activeTenantId) return;
      setLoading(true);
      try {
        // Fetch all resources for stats by asking for a large page size
        const res = await fetchResources({ page: 1, pageSize: 10000 });
        if (active) {
          const data = res.data;
          const activeCount = data.filter(r => r.status === 'ACTIVE').length;
          const pendingCount = data.filter(r => r.status === 'PENDING').length;
          
          setStats({
            total: data.length,
            active: activeCount,
            pending: pendingCount,
            value: data.reduce((sum, r) => sum + r.value, 0)
          });

          // Status Chart Data
          const statusCounts: Record<string, number> = {};
          data.forEach(r => { statusCounts[r.status] = (statusCounts[r.status] || 0) + 1; });
          setStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

          // Department Chart Data
          const deptCounts: Record<string, number> = {};
          data.forEach(r => { deptCounts[r.department] = (deptCounts[r.department] || 0) + 1; });
          setDeptData(Object.entries(deptCounts).map(([name, value]) => ({ name, value })));
        }
      } catch (err) {
        if (active) setStats({ total: 0, active: 0, pending: 0, value: 0 });
      } finally {
        if (active) setLoading(false);
      }
    };
    loadStats();
    return () => { active = false };
  }, [activeTenantId, fetchResources]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const STATUS_COLORS: Record<string, string> = {
    'ACTIVE': '#10b981',
    'PENDING': '#f59e0b',
    'ARCHIVED': '#6b7280'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of resources for <span className="font-medium text-gray-700">{tenant?.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            {loading ? <Skeleton className="h-4 w-28" /> : <div className="text-sm font-medium text-gray-500">Total Resources</div>}
            {loading ? <Skeleton className="h-9 w-9 rounded-lg" /> : <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors"><Database size={20} /></div>}
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? <Skeleton className="h-8 w-16" /> : stats.total}
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            {loading ? <Skeleton className="h-4 w-28" /> : <div className="text-sm font-medium text-gray-500">Active Resources</div>}
            {loading ? <Skeleton className="h-9 w-9 rounded-lg" /> : <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors"><CheckCircle2 size={20} /></div>}
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? <Skeleton className="h-8 w-16" /> : stats.active}
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            {loading ? <Skeleton className="h-4 w-28" /> : <div className="text-sm font-medium text-gray-500">Pending Actions</div>}
            {loading ? <Skeleton className="h-9 w-9 rounded-lg" /> : <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors"><Clock size={20} /></div>}
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? <Skeleton className="h-8 w-16" /> : stats.pending}
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            {loading ? <Skeleton className="h-4 w-32" /> : <div className="text-sm font-medium text-gray-500">Total Asset Value</div>}
            {loading ? <Skeleton className="h-9 w-9 rounded-lg" /> : <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors"><IndianRupee size={20} /></div>}
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? <Skeleton className="h-8 w-24" /> : `$${stats.value.toLocaleString()}`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Resources by Status</h2>
          <div className="flex-1 h-64 relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Skeleton className="w-[150px] h-[150px] rounded-full border-[20px] border-gray-50 bg-transparent mb-6" />
                <div className="flex gap-4">
                  <Skeleton className="w-16 h-3" />
                  <Skeleton className="w-16 h-3" />
                  <Skeleton className="w-16 h-3" />
                </div>
              </div>
            ) : statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [value, name ? name.charAt(0) + name.slice(1).toLowerCase() : '']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    formatter={(value) => <span className="text-gray-700 font-medium capitalize ml-1">{value.toLowerCase()}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Resources by Department</h2>
          <div className="flex-1 h-64 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-end justify-around pb-6 pt-4 px-2">
                <Skeleton className="w-10 h-full max-h-[80%] rounded-t" />
                <Skeleton className="w-10 h-full max-h-[50%] rounded-t" />
                <Skeleton className="w-10 h-full max-h-[60%] rounded-t" />
                <Skeleton className="w-10 h-full max-h-[90%] rounded-t" />
                <Skeleton className="w-10 h-full max-h-[40%] rounded-t" />
              </div>
            ) : deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
