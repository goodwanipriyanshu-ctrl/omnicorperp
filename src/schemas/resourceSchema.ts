import { z } from 'zod';

export const baseSchema = z.object({
  name: z.string().min(2, "Resource name must contain at least 2 characters.").max(100).trim(),
  department: z.enum(['IT', 'Finance', 'HR', 'Marketing', 'Operations'] as const),
  owner: z.string().min(2, "Owner is required.").max(80),
  value: z.coerce.number().min(0, "Value cannot be negative.").default(0),
});

export const hardwareSchema = z.object({
  category: z.literal('Hardware'),
  assetType: z.enum(['Laptop', 'Desktop', 'Monitor', 'Mobile', 'Other'] as const),
  serialNumber: z.string().min(3, "Serial number must be at least 3 characters.").max(50),
  warrantyPeriod: z.enum(['6 months', '12 months', '24 months', '36 months'] as const)
});

export const softwareSchema = z.object({
  category: z.literal('Software'),
  licenseType: z.enum(['Subscription', 'Perpetual', 'Enterprise'] as const),
  licenseSeats: z.coerce.number().min(1, 'Minimum 1 seat required').max(10000, 'Maximum 10000 seats.'),
  licenseKey: z.string().min(3, 'License key must be at least 3 characters.').max(100)
});

export const serviceSchema = z.object({
  category: z.literal('Service'),
  serviceType: z.enum(['Consulting', 'Maintenance', 'Support', 'Professional Services'] as const),
  contractDuration: z.enum(['1 month', '3 months', '6 months', '12 months', '24 months'] as const),
  renewalRequired: z.boolean().default(false)
});

export const otherSchema = z.object({
  category: z.literal('Other'),
  description: z.string().min(10, 'Description must be at least 10 characters.').max(500)
});

export const resourceFormSchema = z.discriminatedUnion('category', [
  baseSchema.merge(hardwareSchema),
  baseSchema.merge(softwareSchema),
  baseSchema.merge(serviceSchema),
  baseSchema.merge(otherSchema)
]);

export type ResourceFormValues = {
  name: string;
  department: 'IT' | 'Finance' | 'HR' | 'Marketing' | 'Operations';
  owner: string;
  value: number;
  category: 'Hardware' | 'Software' | 'Service' | 'Other';
  
  assetType?: 'Laptop' | 'Desktop' | 'Monitor' | 'Mobile' | 'Other';
  serialNumber?: string;
  warrantyPeriod?: '6 months' | '12 months' | '24 months' | '36 months';
  
  licenseType?: 'Subscription' | 'Perpetual' | 'Enterprise';
  licenseSeats?: number;
  licenseKey?: string;
  
  serviceType?: 'Consulting' | 'Maintenance' | 'Support' | 'Professional Services';
  contractDuration?: '1 month' | '3 months' | '6 months' | '12 months' | '24 months';
  renewalRequired?: boolean;
  
  description?: string;
};
