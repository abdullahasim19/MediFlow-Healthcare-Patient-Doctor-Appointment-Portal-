export interface Patient {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalRecordNumber: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  allergies?: string;
  chronicConditions?: string;
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  diagnosis: string;
  treatment: string;
  date: Date;
  doctorName: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  appointmentId?: string;
  patientId: string;
  doctorName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  refills: number;
  isActive: boolean;
  prescribedAt: Date;
  expiresAt?: Date;
}