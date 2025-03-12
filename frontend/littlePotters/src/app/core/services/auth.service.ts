import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { AuthResponse, RegisterRequest } from '../models/auth.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8081/api/auth';
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(
      this.getUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('auth_token');
    }
    return false; 
  }

  private getUserFromStorage(): AuthResponse | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('currentUser');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }
  

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(authResponse => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(authResponse));
            localStorage.setItem('auth_token', authResponse.token);
            localStorage.setItem('roles', JSON.stringify(authResponse.roles));
          }
          this.currentUserSubject.next(authResponse);
        }),
        catchError(this.handleError)
      );
  }


  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log("In register auth service, sending request to:", `${this.apiUrl}/register`);
    console.log("Request payload:", userData);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(authResponse => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(authResponse));
            localStorage.setItem('auth_token', authResponse.token);
          }
          this.currentUserSubject.next(authResponse);
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    let token = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('auth_token');
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers: headers as { Authorization?: string } })
      .pipe(
        tap(() => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('roles'); 
          }
          this.currentUserSubject.next(null);
        }),
        catchError(this.handleError)
      );
  }


  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return !!user && user.roles.includes(role);
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('HTTP Error:', errorMessage, error);
    return throwError(() => error); 
  }



}
