export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialtyName: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason?: string;
  symptoms?: string;
  notes?: string;
  isWalkIn: boolean;
  checkedInAt?: Date;
  consultationStartedAt?: Date;
  consultationEndedAt?: Date;
  createdAt: Date;
}

export enum AppointmentStatus {
  Scheduled = 1,
  CheckedIn = 2,
  InConsultation = 3,
  Completed = 4,
  Cancelled = 5,
  NoShow = 6,
  Rescheduled = 7
}

export interface BookAppointmentRequest {
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  reason?: string;
  symptoms?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DoctorSchedule {
  doctorId: string;
  doctorName: string;
  date: Date;
  timeSlots: TimeSlot[];
}