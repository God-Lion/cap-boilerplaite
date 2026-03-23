import { z } from 'zod';

export const birthDeclarationSchema = z.object({
  childName: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    suffix: z.string().optional(),
  }),
  birthDetails: z.object({
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    timeOfBirth: z.string().min(1, 'Time of birth is required'),
    sex: z.enum(['MALE', 'FEMALE', 'INTERSEX', 'UNDETERMINED']),
    placeOfBirth: z.object({
      type: z.enum(['HOSPITAL', 'CLINIC', 'HOME', 'OTHER']),
      facilityName: z.string().optional(),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        country: z.string(),
      }),
    }),
  }),
  parents: z.array(z.object({
    role: z.enum(['MOTHER', 'FATHER', 'PARENT_1', 'PARENT_2']),
    fullName: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    dateOfBirth: z.string(),
    nationalId: z.string(),
    nationality: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }),
  })).min(1, 'At least one parent is required'),
});
