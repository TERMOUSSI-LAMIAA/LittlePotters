import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { Workshop } from '../models/workshop.model';
import { WorkshopRequest } from '../models/workshop.model';
import { PaginatedResponse } from '../models/PaginatedResponse.model';

@Injectable({ providedIn: 'root' })
export class WorkshopService {
    private apiUrl = 'http://localhost:8081/api/instructor/workshops';
    private workshopChangedSubject = new Subject<void>();
    workshopChanged$ = this.workshopChangedSubject.asObservable();

 
    constructor(private http: HttpClient) { }
    notifyWorkshopChanged() {
        this.workshopChangedSubject.next();
    }
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
        return this.http.post<Workshop>(this.apiUrl, formData).pipe(
            tap(() => this.notifyWorkshopChanged()),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 400) {
                    console.error('Validation error:', error.error);
                    return throwError(error.error);
                } else {
                    console.error('Error creating workshop:', error);
                    return throwError(error);
                }
            })
        );
    }

    // Update workshop
    updateWorkshop(id: number, workshopData: WorkshopRequest): Observable<Workshop> {
        const formData = new FormData();
        Object.entries(workshopData).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value);
        });
        return this.http.put<Workshop>(`${this.apiUrl}/${id}`, formData).pipe(
            tap(() => this.notifyWorkshopChanged())
        );
    }

    // Delete workshop
    deleteWorkshop(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.notifyWorkshopChanged())
        );
    }

    // Get single workshop
    getWorkshopById(id: number): Observable<Workshop> {
        return this.http.get<Workshop>(`${this.apiUrl}/${id}`);
    }

    loadWorkshopImage(url: string): Observable<Blob> {
        const cleanUrl = url.startsWith(this.apiUrl)
            ? url.slice(this.apiUrl.length)
            : url

        return this.http.get(`${this.apiUrl}${cleanUrl}`, {
            responseType: 'blob'
        })
    }

    getWorkshopsByInstructor(instructorId: number, page: number = 0, size: number = 6): Observable<PaginatedResponse<Workshop>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PaginatedResponse<Workshop>>(`${this.apiUrl}/instructor/${instructorId}`, { params });
    }
}
