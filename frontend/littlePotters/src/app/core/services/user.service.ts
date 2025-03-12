import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8081/api/admin/users'; 

  constructor(private http: HttpClient) { }

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

  // Get only instructors
  getInstructors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?role=instructor`);
  }
}
