import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { QueueEntry, QueueStatus } from '../models/queue.model';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  constructor(private apiService: ApiService) {}

  getCurrentQueue(doctorId?: string): Observable<QueueEntry[]> {
    let url = 'queue';
    if (doctorId) {
      url += `?doctorId=${doctorId}`;
    }
    return this.apiService.get<QueueEntry[]>(url);
  }

  getMyQueueStatus(): Observable<QueueEntry> {
    return this.apiService.get<QueueEntry>('queue/my-status');
  }

  joinQueue(doctorId: string, appointmentId?: string): Observable<QueueEntry> {
    return this.apiService.post<QueueEntry>('queue/join', { doctorId, appointmentId });
  }

  leaveQueue(): Observable<any> {
    return this.apiService.post('queue/leave', {});
  }

  // Receptionist endpoints
  callNextPatient(doctorId: string): Observable<QueueEntry> {
    return this.apiService.post<QueueEntry>(`queue/next`, { doctorId });
  }

  updateQueueStatus(queueEntryId: string, status: QueueStatus): Observable<any> {
    return this.apiService.patch(`queue/${queueEntryId}/status`, { status });
  }

  removeFromQueue(queueEntryId: string, reason?: string): Observable<any> {
    return this.apiService.post(`queue/${queueEntryId}/remove`, { reason });
  }
}