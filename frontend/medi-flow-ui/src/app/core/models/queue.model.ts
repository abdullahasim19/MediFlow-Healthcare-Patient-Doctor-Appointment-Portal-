export interface QueueEntry {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  queueNumber: number;
  status: QueueStatus;
  position: number;
  estimatedWaitTime: number;
  joinedAt: Date;
  calledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export enum QueueStatus {
  Waiting = 1,
  Called = 2,
  InConsultation = 3,
  Completed = 4,
  Cancelled = 5,
  NoShow = 6
}

export interface QueueStatusUpdate {
  queueEntryId: string;
  status: QueueStatus;
  patientName: string;
  queueNumber: number;
}