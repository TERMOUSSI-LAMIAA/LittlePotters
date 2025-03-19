import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workshop } from '../models/workshop.model';
import { WorkshopRequest } from '../models/workshop.model';
import { PaginatedResponse } from '../models/PaginatedResponse.model';

@Injectable({ providedIn: 'root' })
export class WorkshopService {
    private apiUrl = 'http://localhost:8081/api/instructor/workshops';

    constructor(private http: HttpClient) { }

    // Get paginated workshops
    getWorkshops(page: number = 0, size: number = 6): Observable<PaginatedResponse<Workshop>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PaginatedResponse<Workshop>>(this.apiUrl, { params });
    }

    // Create new workshop
    createWorkshop(workshopData: WorkshopRequest): Observable<Workshop> {
        const formData = new FormData();
        Object.entries(workshopData).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value);
        });
        return this.http.post<Workshop>(this.apiUrl, formData);
    }

    // Update workshop
    updateWorkshop(id: number, workshopData: WorkshopRequest): Observable<Workshop> {
        const formData = new FormData();
        Object.entries(workshopData).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value);
        });
        return this.http.put<Workshop>(`${this.apiUrl}/${id}`, formData);
    }

    // Delete workshop
    deleteWorkshop(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Get single workshop
    getWorkshopById(id: number): Observable<Workshop> {
        return this.http.get<Workshop>(`${this.apiUrl}/${id}`);
    }

    // Load workshop image
    loadWorkshopImage(fileName: string): Observable<Blob> {
        return this.http.get(`http://localhost:8081/api/instructor/workshops/images/${fileName}`, { responseType: 'blob' });
    }

    getWorkshopsByInstructor(instructorId: number, page: number = 0, size: number = 6): Observable<PaginatedResponse<Workshop>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PaginatedResponse<Workshop>>(`${this.apiUrl}/instructor/${instructorId}`, { params });
    }
}
