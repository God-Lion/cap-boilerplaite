// modules/application/types/schema.ts

import { z } from 'zod';

export const digitalIdApplicationSchema = z.object({
  citizenId: z.string().min(1, 'Citizen ID is required'),
  birthCertificateId: z.string().min(1, 'Birth Certificate ID is required'),
  personalInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    placeOfBirth: z.string().min(1, 'Place of birth is required'),
    sex: z.enum(['MALE', 'FEMALE', 'OTHER']),
    nationality: z.string().min(1, 'Nationality is required'),
    address: z.object({
      street: z.string().min(1, 'Street is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      postalCode: z.string().min(1, 'Postal code is required'),
      country: z.string().min(1, 'Country is required'),
    }),
    phoneNumber: z.string().optional(),
    email: z.string().email('Invalid email').optional(),
  }),
  supportingDocuments: z.array(z.object({
    type: z.string(),
    file: z.any().optional(), // In a real app, this would be a File or URL
  })).optional(),
});

export type DigitalIdApplicationForm = z.infer<typeof digitalIdApplicationSchema>;
