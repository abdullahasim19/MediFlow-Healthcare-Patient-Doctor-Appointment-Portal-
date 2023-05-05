import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private queueUpdateSubject = new BehaviorSubject<any>(null);
  private notificationSubject = new BehaviorSubject<any>(null);
  
  public queueUpdate$ = this.queueUpdateSubject.asObservable();
  public notification$ = this.notificationSubject.asObservable();

  constructor(
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  startConnection(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.signalRUrl}/queueHub`, {
        accessTokenFactory: () => token || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR connection established');
        this.registerEvents();
      })
      .catch(err => {
        console.error('SignalR connection error:', err);
        setTimeout(() => this.startConnection(), 5000);
      });

    this.hubConnection.onreconnecting(error => {
      console.warn('SignalR reconnecting:', error);
      this.toastr.warning('Reconnecting to server...', 'Connection Lost');
    });

    this.hubConnection.onreconnected(connectionId => {
      console.log('SignalR reconnected:', connectionId);
      this.toastr.success('Reconnected to server', 'Connection Restored');
    });
  }

  private registerEvents(): void {
    // Queue updates
    this.hubConnection.on('QueueUpdated', (data: any) => {
      this.queueUpdateSubject.next(data);
      this.playNotificationSound();
    });

    this.hubConnection.on('PositionChanged', (data: { position: number; estimatedWait: number }) => {
      this.queueUpdateSubject.next(data);
      if (data.position === 1) {
        this.toastr.info('You are next in line! Please be ready.', 'Queue Update');
      } else {
        this.toastr.info(`Your position: ${data.position}. Estimated wait: ${data.estimatedWait} minutes`, 'Queue Update');
      }
    });

    this.hubConnection.on('CalledToConsultation', (data: { doctorName: string; roomNumber?: string }) => {
      this.toastr.success(`Dr. ${data.doctorName} is ready to see you. ${data.roomNumber ? `Room: ${data.roomNumber}` : ''}`, 'Your Turn!');
      this.playNotificationSound();
    });

    // Appointment updates
    this.hubConnection.on('AppointmentUpdated', (data: any) => {
      this.toastr.info(`Appointment ${data.status}: ${data.message}`, 'Appointment Update');
    });

    this.hubConnection.on('AppointmentReminder', (data: { message: string; appointmentTime: string }) => {
      this.toastr.info(`Reminder: ${data.message} at ${data.appointmentTime}`, 'Upcoming Appointment');
      this.playNotificationSound();
    });

    // Notifications
    this.hubConnection.on('NewNotification', (notification: any) => {
      this.notificationSubject.next(notification);
      this.showNotification(notification);
    });
  }

  private showNotification(notification: any): void {
    switch (notification.type) {
      case 'appointment':
        this.toastr.info(notification.message, 'Appointment Notification');
        break;
      case 'queue':
        this.toastr.warning(notification.message, 'Queue Update');
        break;
      case 'system':
        this.toastr.info(notification.message, 'System Notification');
        break;
      default:
        this.toastr.info(notification.message, 'New Notification');
    }
    
    this.playNotificationSound();
  }

  private playNotificationSound(): void {
    const audio = new Audio('/assets/sounds/notification.mp3');
    audio.play().catch(err => console.log('Audio play failed:', err));
  }

  // Join specific groups
  joinDoctorQueue(doctorId: string): void {
    this.hubConnection.invoke('JoinDoctorQueue', doctorId)
      .catch(err => console.error('Error joining doctor queue:', err));
  }

  joinPatientQueue(): void {
    this.hubConnection.invoke('JoinPatientQueue')
      .catch(err => console.error('Error joining patient queue:', err));
  }

  // Send events
  notifyQueueUpdate(doctorId: string, message: any): void {
    this.hubConnection.invoke('NotifyQueueUpdate', doctorId, message)
      .catch(err => console.error('Error sending queue update:', err));
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .catch(err => console.error('Error stopping connection:', err));
    }
  }
}