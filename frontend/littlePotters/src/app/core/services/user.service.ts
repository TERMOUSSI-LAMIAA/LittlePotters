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

  // createUser(user: UserRequest): Observable<User> {
  //   return this.http.post<User>(`${this.apiUrl}/register`, user);
  // }
  createUser(user: UserRequest): Observable<User> {
    const formData = new FormData()

    formData.append("email", user.email)
    if (user.password) {
      formData.append("password", user.password)
    }
    formData.append("fullname", user.fullname)
    formData.append("phone", user.phone || "")
    formData.append("active", user.active.toString())
    if (user.roles && user.roles.length > 0) {
      user.roles.forEach((role) => {
        formData.append("roles", role)
      })
    }

    if (user.image) {
      formData.append("image", user.image)
    }

    return this.http.post<User>(`${this.apiUrl}/register`, formData)
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
