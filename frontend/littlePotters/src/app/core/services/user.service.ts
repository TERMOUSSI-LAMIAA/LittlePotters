import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRequest, User } from '../models/user.model';
import { PaginatedResponse } from '../models/PaginatedResponse.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8081/api/admin/users'; 
  private apiBaseUrl = 'http://localhost:8081'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  updateUser(id: number, user: UserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }
  updateProfile(id: number, formData: FormData): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, formData);
  }
  createUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, formData);
  }


  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  getCustomers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?role=CUSTOMER`);
  }

  getInstructors(): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(`${this.apiUrl}?role=INSTRUCTOR`);
  }

  getCustomersWithPage(page: number = 0, size: number = 6): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(`${this.apiUrl}?role=CUSTOMER&page=${page}&size=${size}`);
  }


  getInstructorsWithPage(page: number = 0, size: number = 6): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(`${this.apiUrl}?role=INSTRUCTOR&page=${page}&size=${size}`);
  }
  loadImage(url: string): Observable<Blob> {
    const cleanUrl = url.startsWith(this.apiBaseUrl) ? url.slice(this.apiBaseUrl.length) : url;

    return this.http.get(`${this.apiBaseUrl}${cleanUrl}`, { responseType: 'blob' });
  }

}
