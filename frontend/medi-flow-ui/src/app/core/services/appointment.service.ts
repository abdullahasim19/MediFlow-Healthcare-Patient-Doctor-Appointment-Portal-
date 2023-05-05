import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Appointment, BookAppointmentRequest, DoctorSchedule, TimeSlot } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private apiService: ApiService) {}

  getMyAppointments(status?: string): Observable<Appointment[]> {
    let url = 'appointments/my';
    if (status) {
      url += `?status=${status}`;
    }
    return this.apiService.get<Appointment[]>(url);
  }

  getUpcomingAppointments(): Observable<Appointment[]> {
    return this.apiService.get<Appointment[]>('appointments/upcoming');
  }

  getPastAppointments(): Observable<Appointment[]> {
    return this.apiService.get<Appointment[]>('appointments/past');
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.apiService.get<Appointment>(`appointments/${id}`);
  }

  bookAppointment(request: BookAppointmentRequest): Observable<{ id: string }> {
    return this.apiService.post<{ id: string }>('appointments', request);
  }

  cancelAppointment(id: string, reason?: string): Observable<any> {
    return this.apiService.post(`appointments/${id}/cancel`, { reason });
  }

  rescheduleAppointment(id: string, newDate: string, newTime: string): Observable<any> {
    return this.apiService.post(`appointments/${id}/reschedule`, { newDate, newTime });
  }

  getDoctorSchedule(doctorId: string, date: string): Observable<DoctorSchedule> {
    return this.apiService.get<DoctorSchedule>(`appointments/doctors/${doctorId}/schedule`, { date });
  }

  getAvailableTimeSlots(doctorId: string, date: string): Observable<TimeSlot[]> {
    return this.apiService.get<TimeSlot[]>(`appointments/doctors/${doctorId}/slots`, { date });
  }

  // Receptionist/Doctor endpoints
  getTodayAppointments(doctorId?: string): Observable<Appointment[]> {
    let url = 'appointments/today';
    if (doctorId) {
      url += `?doctorId=${doctorId}`;
    }
    return this.apiService.get<Appointment[]>(url);
  }

  checkInPatient(appointmentId: string): Observable<any> {
    return this.apiService.post(`appointments/${appointmentId}/checkin`, {});
  }

  startConsultation(appointmentId: string): Observable<any> {
    return this.apiService.post(`appointments/${appointmentId}/start`, {});
  }

  completeAppointment(appointmentId: string, notes?: string): Observable<any> {
    return this.apiService.post(`appointments/${appointmentId}/complete`, { notes });
  }

  markNoShow(appointmentId: string): Observable<any> {
    return this.apiService.post(`appointments/${appointmentId}/no-show`, {});
  }
}