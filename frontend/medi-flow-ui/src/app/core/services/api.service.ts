import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private defaultTimeout = 30000;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Session expired. Please login again.';
      // Redirect to login
      window.location.href = '/login';
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found';
    } else if (error.status === 409) {
      errorMessage = error.error.message || 'Conflict occurred';
    }
    
    this.toastr.error(errorMessage, 'Error');
    return throwError(() => new Error(errorMessage));
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  upload<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }
    
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).pipe(
      timeout(60000), // Longer timeout for file upload
      catchError(this.handleError.bind(this))
    );
  }
}