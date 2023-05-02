import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Doctor, WorkingHours, TimeOffBlock } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor(private apiService: ApiService) {}

  getAllDoctors(specialtyId?: string): Observable<Doctor[]> {
    let url = 'doctors';
    if (specialtyId) {
      url += `?specialtyId=${specialtyId}`;
    }
    return this.apiService.get<Doctor[]>(url);
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.apiService.get<Doctor>(`doctors/${id}`);
  }

  getDoctorWorkingHours(doctorId: string): Observable<WorkingHours[]> {
    return this.apiService.get<WorkingHours[]>(`doctors/${doctorId}/working-hours`);
  }

  updateWorkingHours(doctorId: string, workingHours: WorkingHours[]): Observable<any> {
    return this.apiService.put(`doctors/${doctorId}/working-hours`, workingHours);
  }

  addTimeOff(doctorId: string, timeOff: TimeOffBlock): Observable<any> {
    return this.apiService.post(`doctors/${doctorId}/time-off`, timeOff);
  }

  getTimeOff(doctorId: string, startDate: string, endDate: string): Observable<TimeOffBlock[]> {
    return this.apiService.get<TimeOffBlock[]>(`doctors/${doctorId}/time-off`, { startDate, endDate });
  }

  // Admin endpoints
  createDoctor(doctorData: any): Observable<Doctor> {
    return this.apiService.post<Doctor>('doctors', doctorData);
  }

  updateDoctor(id: string, doctorData: any): Observable<Doctor> {
    return this.apiService.put<Doctor>(`doctors/${id}`, doctorData);
  }

  deleteDoctor(id: string): Observable<any> {
    return this.apiService.delete(`doctors/${id}`);
  }
}