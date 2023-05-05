import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User, LoginRequest, LoginResponse, RegisterPatientRequest } from '../models/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private sessionTimer: any;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loadStoredUser();
    this.setupActivityMonitoring();
  }

  private loadStoredUser(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
      this.startSessionTimer();
    }
  }

  private setupActivityMonitoring(): void {
    ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      window.addEventListener(event, () => this.resetSessionTimer());
    });
  }

  private startSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    
    this.sessionTimer = setTimeout(() => {
      this.logout();
      this.toastr.warning('Session expired due to inactivity', 'Session Timeout');
    }, this.SESSION_TIMEOUT);
  }

  private resetSessionTimer(): void {
    if (this.currentUserSubject.value) {
      this.startSessionTimer();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('auth/login', credentials).pipe(
      map(response => {
        if (!response.requiresTwoFactor && response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          if (response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
          this.startSessionTimer();
        }
        return response;
      })
    });
  }

  register(registrationData: RegisterPatientRequest): Observable<any> {
    return this.apiService.post('auth/register', registrationData);
  }

  verifyTwoFactor(code: string): Observable<LoginResponse> {
    return this.apiService.post('auth/verify-2fa', { code }).pipe(
      map(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
        this.startSessionTimer();
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    
    this.router.navigate(['/login']);
    this.toastr.info('You have been logged out', 'Goodbye');
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.apiService.post<{ accessToken: string }>('auth/refresh', { refreshToken }).pipe(
      map(response => {
        localStorage.setItem('accessToken', response.accessToken);
        return response.accessToken;
      })
    );
  }

  enableTwoFactor(): Observable<{ secret: string; qrCode: string }> {
    return this.apiService.post('auth/enable-2fa', {});
  }

  disableTwoFactor(code: string): Observable<any> {
    return this.apiService.post('auth/disable-2fa', { code });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.apiService.post('auth/change-password', { oldPassword, newPassword });
  }

  forgotPassword(email: string): Observable<any> {
    return this.apiService.post('auth/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.apiService.post('auth/reset-password', { token, newPassword });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return roles.some(role => user?.roles?.includes(role));
  }
}