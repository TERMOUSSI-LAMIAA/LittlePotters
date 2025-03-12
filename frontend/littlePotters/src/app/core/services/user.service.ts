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

  constructor(private http: HttpClient, private authService: AuthService) { }

  // For updating a user, you should use UserRequest
  updateUser(id: number, user: UserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // For creating a new user, you should use UserRequest
  createUser(user: UserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // For getting user data, you receive a User object
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Delete user by ID
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get only customers
  getCustomers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?role=customer`);
  }

  getInstructors(): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(`${this.apiUrl}?role=INSTRUCTOR`);
  }
  


}
