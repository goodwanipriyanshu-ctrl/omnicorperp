import React, { useEffect, useState, useCallback } from 'react';
import { useResourceService } from '../hooks/useResourceService';
import { useTenantStore } from '../store/tenantStore';
import { useDebounce } from '../hooks/useDebounce';
import { Can } from '../components/rbac/Can';
import { ResourceStatusBadge } from '../components/resources/ResourceStatusBadge';
import { ResourcePagination } from '../components/resources/ResourcePagination';
import { DeleteConfirmModal } from '../components/resources/DeleteConfirmModal';
import { EditResourceModal } from '../components/resources/EditResourceModal';
import { Link } from 'react-router-dom';
import { Skeleton } from '../components/ui/Skeleton';
import { Search, X, ChevronUp, ChevronDown, ChevronsUpDown, AlertCircle, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import type { Resource, ResourceSortField, SortRule } from '../types';

// Helper component for sortable headers
const SortHeader = ({
  field,
  label,
  sortRules,
  onSort
}: {
  field: ResourceSortField;
  label: string;
  sortRules: SortRule[];
  onSort: (field: ResourceSortField, shiftKey: boolean) => void;
}) => {
  const ruleIdx = sortRules.findIndex(r => r.field === field);
  const rule = sortRules[ruleIdx];

  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none group"
      onClick={(e) => onSort(field, e.shiftKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        <span className="inline-flex flex-col text-gray-400 group-hover:text-gray-600">
          {!rule ? <ChevronsUpDown size={14} className="opacity-50" /> : 
            rule.direction === 'asc' ? <ChevronUp size={14} className="text-blue-600" /> : 
            <ChevronDown size={14} className="text-blue-600" />
          }
        </span>
        {ruleIdx !== -1 && sortRules.length > 1 && (
          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center">
            {ruleIdx + 1}
          </span>
        )}
      </div>
    </th>
  );
};

export const Resources: React.FC = () => {
  const { activeTenantId } = useTenantStore();
  const { fetchResources, deleteResource } = useResourceService();

  // Query State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const [sortRules, setSortRules] = useState<SortRule[]>([]);

  // Data State
  const [resources, setResources] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [editTarget, setEditTarget] = useState<Resource | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reset pagination when dependencies change (but not on page change itself)
  useEffect(() => {
    setPage(1);
  }, [activeTenantId, debouncedSearch, sortRules, pageSize]);

  // Handle Fetch
  const loadData = useCallback(async () => {
    if (!activeTenantId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchResources({
        page,
        pageSize,
        search: debouncedSearch,
        sortRules
      });
      setResources(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load resources.');
    } finally {
      setLoading(false);
    }
  }, [activeTenantId, page, pageSize, debouncedSearch, sortRules, fetchResources]);

  useEffect(() => {
    let active = true;
    const fetch = async () => {
      if (!activeTenantId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetchResources({ page, pageSize, search: debouncedSearch, sortRules });
        if (active) {
          setResources(res.data);
          setTotal(res.total);
          setTotalPages(res.totalPages);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load resources.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetch();
    return () => { active = false; };
  }, [activeTenantId, page, pageSize, debouncedSearch, sortRules, fetchResources]);

  // Handle Sort
  const handleSort = (field: ResourceSortField, shiftKey: boolean) => {
    setSortRules(prev => {
      const existingIdx = prev.findIndex(r => r.field === field);
      const existing = prev[existingIdx];
      
      let newRule: SortRule | null = null;
      if (!existing) {
        newRule = { field, direction: 'asc' };
      } else if (existing.direction === 'asc') {
        newRule = { field, direction: 'desc' };
      } else {
        newRule = null;
      }

      if (shiftKey) {
        const next = [...prev];
        if (newRule) {
          if (existing) next[existingIdx] = newRule;
          else next.push(newRule);
        } else {
          next.splice(existingIdx, 1);
        }
        return next;
      } else {
        return newRule ? [newRule] : [];
      }
    });
  };

  // Formatters
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  
  const formatDate = (iso: string) => 
    new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));

  // Mutations
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteResource(deleteTarget.id);
      setDeleteTarget(null);
      // Determine if we need to step back a page
      if (resources.length === 1 && page > 1) {
        setPage(p => p - 1);
      } else {
        await loadData(); // refresh data inline
      }
      showToast('Resource deleted successfully.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Resources</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor resources across your organization.</p>
        </div>
        <Can permission="resource.create">
          <Link to="/resources/new" className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={16} className="mr-1.5" />
            Create Resource
          </Link>
        </Can>
      </div>

      {/* Grid Container */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search resources..."
              className="block w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {searchInput && (
              <button 
                onClick={() => setSearchInput('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto relative min-h-[400px]">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white z-0">
              <AlertCircle size={32} className="text-red-500 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">Unable to load resources</h3>
              <p className="text-sm text-gray-500 mb-4">{error}</p>
              <button onClick={loadData} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Retry
              </button>
            </div>
          ) : !loading && resources.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white z-0">
              <div className="bg-gray-50 rounded-full p-3 mb-3">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {debouncedSearch ? 'No matching resources' : 'No resources yet'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {debouncedSearch ? 'Try adjusting your search or filters.' : 'Get started by creating your first resource.'}
              </p>
              {!debouncedSearch && (
                <Can permission="resource.create">
                  <Link to="/resources/new" className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-transparent rounded hover:bg-blue-100">
                    Create Resource
                  </Link>
                </Can>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortHeader field="name" label="Resource" sortRules={sortRules} onSort={handleSort} />
                  <SortHeader field="category" label="Category" sortRules={sortRules} onSort={handleSort} />
                  <SortHeader field="department" label="Department" sortRules={sortRules} onSort={handleSort} />
                  <SortHeader field="status" label="Status" sortRules={sortRules} onSort={handleSort} />
                  <SortHeader field="owner" label="Owner" sortRules={sortRules} onSort={handleSort} />
                  <SortHeader field="value" label="Value" sortRules={sortRules} onSort={handleSort} />
                  <SortHeader field="createdAt" label="Created" sortRules={sortRules} onSort={handleSort} />
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skel-${i}`}>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <Skeleton className="h-4 w-32 mb-1.5" />
                        <Skeleton className="h-3 w-20" />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-3 whitespace-nowrap"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-3 whitespace-nowrap"><Skeleton className="h-5 w-20 rounded-full" /></td>
                      <td className="px-6 py-3 whitespace-nowrap"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-3 whitespace-nowrap"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-6 py-3 whitespace-nowrap"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-6 py-3 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-7 w-7 rounded" />
                          <Skeleton className="h-7 w-7 rounded" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : resources.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.id.toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{r.category}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{r.department}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <ResourceStatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{r.owner}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(r.value)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Can permission="resource.edit">
                          <button 
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            title="Edit"
                            aria-label="Edit resource"
                            onClick={() => setEditTarget(r)}
                          >
                            <Edit2 size={16} />
                          </button>
                        </Can>
                        <Can permission="resource.delete">
                          <button 
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" 
                            title="Delete"
                            aria-label="Delete resource"
                            onClick={() => setDeleteTarget(r)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <ResourcePagination
          currentPage={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <DeleteConfirmModal 
        isOpen={!!deleteTarget}
        resourceName={deleteTarget?.name || ''}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <EditResourceModal
        isOpen={!!editTarget}
        resource={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={() => {
          showToast('Resource updated successfully.');
          loadData();
        }}
      />

      {successMsg && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}
    </div>
  );
};
