export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  specialtyId: string;
  specialtyName: string;
  licenseNumber: string;
  qualification: string;
  yearsOfExperience: number;
  consultationFee: number;
  isAvailable: boolean;
  bio?: string;
  profileImageUrl?: string;
  workingHours?: WorkingHours[];
}

export interface WorkingHours {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
}

export interface TimeOffBlock {
  id: string;
  doctorId: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  reason?: string;
}