export interface MedicalFile {
  id: string;
  patientId: string;
  doctorId?: string;
  appointmentId?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  fileType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ConsultationNote {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  notes: string;
  diagnosis?: string;
  recommendations?: string;
  followUpDate?: Date;
  isConfidential: boolean;
  createdAt: Date;
}