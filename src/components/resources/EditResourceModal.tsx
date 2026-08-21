import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resourceFormSchema, type ResourceFormValues } from '../../schemas/resourceSchema';
import type { Resource } from '../../types';
import { useResourceService } from '../../hooks/useResourceService';
import { X, Loader2 } from 'lucide-react';

interface EditResourceModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditResourceModal: React.FC<EditResourceModalProps> = ({ resource, isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { updateResource } = useResourceService();

  const methods = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema) as unknown as import('react-hook-form').Resolver<ResourceFormValues>,
    mode: 'onTouched'
  });

  const { register, handleSubmit, reset, formState: { errors }, watch } = methods;
  const category = watch('category');

  useEffect(() => {
    if (resource && isOpen) {
      reset(resource as unknown as ResourceFormValues);
    }
  }, [resource, isOpen, reset]);

  if (!isOpen || !resource) return null;

  const onSubmit = async (data: ResourceFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await updateResource(resource.id, data);
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update resource.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Resource</h2>
            <p className="text-sm text-gray-500 mt-1">Update the resource details below.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-2 hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded text-sm font-medium border border-red-200">
              {errorMsg}
            </div>
          )}

          <form id="edit-resource-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name *</label>
                <input {...register('name')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select {...register('category')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50 pointer-events-none">
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Service">Service</option>
                  <option value="Other">Other</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Category cannot be changed after creation.</p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select {...register('department')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
                {errors.department && <p className="text-red-600 text-xs mt-1">{errors.department.message}</p>}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner *</label>
                <input {...register('owner')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                {errors.owner && <p className="text-red-600 text-xs mt-1">{errors.owner.message}</p>}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value ($) *</label>
                <input type="number" {...register('value')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                {errors.value && <p className="text-red-600 text-xs mt-1">{errors.value.message}</p>}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Details</h3>
              <div className="grid grid-cols-2 gap-6">
                
                {category === 'Hardware' && (
                  <>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                      <select {...register('assetType')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="Laptop">Laptop</option>
                        <option value="Desktop">Desktop</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Mobile">Mobile Device</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.assetType && <p className="text-red-600 text-xs mt-1">{errors.assetType.message}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                      <input {...register('serialNumber')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                      {errors.serialNumber && <p className="text-red-600 text-xs mt-1">{errors.serialNumber.message}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Period</label>
                      <select {...register('warrantyPeriod')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="6 months">6 Months</option>
                        <option value="12 months">12 Months</option>
                        <option value="24 months">24 Months</option>
                        <option value="36 months">36 Months</option>
                      </select>
                      {errors.warrantyPeriod && <p className="text-red-600 text-xs mt-1">{errors.warrantyPeriod.message}</p>}
                    </div>
                  </>
                )}

                {category === 'Software' && (
                  <>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
                      <select {...register('licenseType')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="Subscription">Subscription</option>
                        <option value="Perpetual">Perpetual</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                      {errors.licenseType && <p className="text-red-600 text-xs mt-1">{errors.licenseType.message}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Seats</label>
                      <input type="number" {...register('licenseSeats')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                      {errors.licenseSeats && <p className="text-red-600 text-xs mt-1">{errors.licenseSeats.message}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Key</label>
                      <input {...register('licenseKey')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono" />
                      {errors.licenseKey && <p className="text-red-600 text-xs mt-1">{errors.licenseKey.message}</p>}
                    </div>
                  </>
                )}

                {category === 'Service' && (
                  <>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                      <select {...register('serviceType')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="Consulting">Consulting</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Support">Support</option>
                        <option value="Professional Services">Professional Services</option>
                      </select>
                      {errors.serviceType && <p className="text-red-600 text-xs mt-1">{errors.serviceType.message}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contract Duration</label>
                      <select {...register('contractDuration')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="1 month">1 Month</option>
                        <option value="3 months">3 Months</option>
                        <option value="6 months">6 Months</option>
                        <option value="12 months">12 Months</option>
                        <option value="24 months">24 Months</option>
                      </select>
                      {errors.contractDuration && <p className="text-red-600 text-xs mt-1">{errors.contractDuration.message}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                        <input type="checkbox" {...register('renewalRequired')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        Auto-Renewal Required
                      </label>
                    </div>
                  </>
                )}

                {category === 'Other' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea {...register('description')} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"></textarea>
                    {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-100 disabled:opacity-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="edit-resource-form"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm flex items-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
