import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNavigate, Link } from 'react-router-dom';
import { useRBAC } from '../hooks/useRBAC';
import { useResourceService } from '../hooks/useResourceService';
import { useTenantStore } from '../store/tenantStore';
import { ArrowLeft, Check, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

import { resourceFormSchema, type ResourceFormValues } from '../schemas/resourceSchema';

// --- STEP COMPONENTS ---

const ErrorMsg = ({ name }: { name: string }) => {
  const { formState: { errors } } = useFormContext();
  const err = errors[name as keyof typeof errors];
  if (!err) return null;
  return <p className="text-xs text-red-600 mt-1">{err.message as string}</p>;
};

const Step1BasicInfo = () => {
  const { register } = useFormContext<ResourceFormValues>();
  
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Basic Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name *</label>
          <input 
            type="text" 
            {...register('name')} 
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            placeholder="e.g. MacBook Pro 14"
          />
          <ErrorMsg name="name" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select 
            {...register('category')} 
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Service">Service</option>
            <option value="Other">Other</option>
          </select>
          <ErrorMsg name="category" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
          <select 
            {...register('department')} 
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
          <ErrorMsg name="department" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Owner *</label>
          <input 
            type="text" 
            {...register('owner')} 
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            placeholder="e.g. Rahul Sharma"
          />
          <ErrorMsg name="owner" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value (₹)</label>
          <input 
            type="number" 
            min="0"
            {...register('value')} 
            className="w-full max-w-sm border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            placeholder="0"
          />
          <ErrorMsg name="value" />
        </div>
      </div>
    </div>
  );
};

const Step2Configuration = () => {
  const { register, watch } = useFormContext<ResourceFormValues>();
  const category = watch('category');

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        {category} Configuration
      </h2>

      {category === 'Hardware' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type *</label>
            <select {...register('assetType')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
              <option value="">Select Type</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Monitor">Monitor</option>
              <option value="Mobile">Mobile</option>
              <option value="Other">Other</option>
            </select>
            <ErrorMsg name="assetType" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number *</label>
            <input type="text" {...register('serialNumber')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            <ErrorMsg name="serialNumber" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Period *</label>
            <select {...register('warrantyPeriod')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
              <option value="">Select Warranty</option>
              <option value="6 months">6 months</option>
              <option value="12 months">12 months</option>
              <option value="24 months">24 months</option>
              <option value="36 months">36 months</option>
            </select>
            <ErrorMsg name="warrantyPeriod" />
          </div>
        </div>
      )}

      {category === 'Software' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">License Type *</label>
            <select {...register('licenseType')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
              <option value="">Select License</option>
              <option value="Subscription">Subscription</option>
              <option value="Perpetual">Perpetual</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            <ErrorMsg name="licenseType" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">License Seats *</label>
            <input type="number" min="1" {...register('licenseSeats')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            <ErrorMsg name="licenseSeats" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">License Key *</label>
            <input type="text" {...register('licenseKey')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            <ErrorMsg name="licenseKey" />
          </div>
        </div>
      )}

      {category === 'Service' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
            <select {...register('serviceType')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
              <option value="">Select Service</option>
              <option value="Consulting">Consulting</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Support">Support</option>
              <option value="Professional Services">Professional Services</option>
            </select>
            <ErrorMsg name="serviceType" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contract Duration *</label>
            <select {...register('contractDuration')} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
              <option value="">Select Duration</option>
              <option value="1 month">1 month</option>
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="12 months">12 months</option>
              <option value="24 months">24 months</option>
            </select>
            <ErrorMsg name="contractDuration" />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('renewalRequired')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
              <span className="text-sm font-medium text-gray-700">Renewal Required</span>
            </label>
          </div>
        </div>
      )}

      {category === 'Other' && (
        <div className="grid grid-cols-1 gap-5">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea {...register('description')} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            <ErrorMsg name="description" />
          </div>
        </div>
      )}
    </div>
  );
};

const Step3Review = () => {
  const { getValues } = useFormContext<ResourceFormValues>();
  const data = getValues();

  const renderField = (label: string, value: string | number | boolean | undefined) => {
    if (value === undefined || value === '') return null;
    return (
      <div className="mb-3">
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">{label}</span>
        <span className="text-sm text-gray-900 font-medium">
          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">Review & Create</h2>
        <div className="bg-gray-50 p-5 rounded border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Basic Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {renderField('Resource Name', data.name)}
            {renderField('Category', data.category)}
            {renderField('Department', data.department)}
            {renderField('Owner', data.owner)}
            {renderField('Estimated Value', `₹${data.value?.toLocaleString()}`)}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-5 rounded border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.category === 'Hardware' && (
            <>
              {renderField('Asset Type', data.assetType)}
              {renderField('Serial Number', data.serialNumber)}
              {renderField('Warranty', data.warrantyPeriod)}
            </>
          )}
          {data.category === 'Software' && (
            <>
              {renderField('License Type', data.licenseType)}
              {renderField('License Seats', data.licenseSeats)}
              {renderField('License Key', data.licenseKey)}
            </>
          )}
          {data.category === 'Service' && (
            <>
              {renderField('Service Type', data.serviceType)}
              {renderField('Contract Duration', data.contractDuration)}
              {renderField('Renewal Required', data.renewalRequired)}
            </>
          )}
          {data.category === 'Other' && (
            <div className="col-span-2 md:col-span-3">
              {renderField('Description', data.description)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// --- MAIN WIZARD COMPONENT ---

export const ResourceCreate: React.FC = () => {
  const { hasPermission } = useRBAC();
  const { createResource } = useResourceService();
  const { activeTenantId } = useTenantStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const methods = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema) as unknown as import('react-hook-form').Resolver<ResourceFormValues>,
    defaultValues: {
      category: 'Hardware',
      value: 0
    },
    mode: 'onTouched'
  });

  // Guard: Unauthorized
  if (!hasPermission('resource.create')) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white border border-red-200 rounded shadow-sm text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-gray-600 mb-6">You do not have permission to create resources in this workspace.</p>
        <Link to="/resources" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
          <ArrowLeft size={16} className="mr-2" /> Back to Resources
        </Link>
      </div>
    );
  }

  const handleNext = async () => {
    let valid = false;
    if (step === 1) {
      valid = await methods.trigger(['name', 'category', 'department', 'owner', 'value']);
    } else if (step === 2) {
      const cat = methods.getValues('category');
      const fieldsToValidate: (keyof ResourceFormValues)[] = 
        cat === 'Hardware' ? ['assetType', 'serialNumber', 'warrantyPeriod'] :
        cat === 'Software' ? ['licenseType', 'licenseSeats', 'licenseKey'] :
        cat === 'Service' ? ['serviceType', 'contractDuration', 'renewalRequired'] :
        ['description'];
      valid = await methods.trigger(fieldsToValidate);
    }
    
    if (valid) {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const onSubmit = async (data: ResourceFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      if (!activeTenantId) throw new Error('No active workspace selected.');
      
      // The payload is strictly parsed and filtered by Zod via hookform/resolvers based on the discriminated union!
      await createResource({
        ...data,
        tenantId: activeTenantId,
        status: 'PENDING'
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/resources');
      }, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create resource.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 relative">
      
      {success && (
        <div className="absolute top-0 left-0 right-0 z-50 animate-in slide-in-from-top-2 flex justify-center">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded shadow-sm flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <span className="font-medium text-sm">Resource created successfully. Redirecting...</span>
          </div>
        </div>
      )}

      <div>
        <Link to="/resources" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Resources
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Provision New Resource</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: 'Basic Information' },
          { num: 2, label: 'Configuration' },
          { num: 3, label: 'Review & Create' }
        ].map((s, i) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300
                ${step > s.num ? 'bg-blue-600 border-blue-600 text-white' : 
                  step === s.num ? 'border-blue-600 text-blue-600 bg-blue-50' : 
                  'border-gray-200 text-gray-400'}`}
              >
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main Form */}
      <div className="bg-white p-6 md:p-8 border border-gray-200 rounded shadow-sm">
        
        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{errorMsg}</div>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            
            <div className="min-h-[280px]">
              {step === 1 && <Step1BasicInfo />}
              {step === 2 && <Step2Configuration />}
              {step === 3 && <Step3Review />}
            </div>

            {/* Footer Navigation */}
            <div className="mt-8 pt-5 border-t border-gray-200 flex items-center justify-between">
              {step === 1 ? (
                <Link 
                  to="/resources"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 outline-none"
                >
                  Cancel
                </Link>
              ) : (
                <button 
                  type="button" 
                  onClick={handleBack}
                  disabled={isSubmitting || success}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 outline-none disabled:opacity-50"
                >
                  Back
                </button>
              )}

              {step < 3 ? (
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  Continue
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting || success}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 outline-none flex items-center gap-2 disabled:opacity-70 transition-all"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? 'Creating...' : success ? 'Created!' : 'Create Resource'}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
