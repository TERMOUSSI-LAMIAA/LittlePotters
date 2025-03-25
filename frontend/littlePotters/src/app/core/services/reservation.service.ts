import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { ReservationRequest } from '../models/reservation.model';
import { PaginatedResponse } from '../models/PaginatedResponse.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
    
    private apiUrl = 'http://localhost:8081/api/reservations';

    constructor(private http: HttpClient) { }

    createReservation(reservationData: ReservationRequest): Observable<Reservation> {
        return this.http.post<Reservation>(this.apiUrl, reservationData);
    }

    // todo: change it in backend
    updateReservationStatus(id: number, status: string): Observable<Reservation> {
        return this.http.put<Reservation>(`${this.apiUrl}/${id}/status`, { status });
    }

    updatePlacesBooked(id: number, placesBooked: number): Observable<Reservation> {
        return this.http.put<Reservation>(
            `${this.apiUrl}/${id}/places`,
            { placesBooked } 
        );
    }
 
    getAllReservations(): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(this.apiUrl);
    }

    getReservationById(id: number): Observable<Reservation> {
        return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
    }

    deleteReservation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getCustomerReservations(page: number, size: number, workshopId?: number): Observable<PaginatedResponse<Reservation>> {
        const params: any = {
            page: page.toString(),
            size: size.toString(),
        };

        if (workshopId) {
            params.workshopId = workshopId.toString();
        }

        return this.http.get<PaginatedResponse<Reservation>>(`${this.apiUrl}/customer/workshops`, { params });
    }

    getInstructorReservations(page: number, size: number, workshopId?: number): Observable<PaginatedResponse<Reservation>> {
        const params: any = {
            page: page.toString(),
            size: size.toString(),
        };

        if (workshopId) {
            params.workshopId = workshopId.toString(); 
        }
        return this.http.get<PaginatedResponse<Reservation>>(`${this.apiUrl}/instructor/workshops`, { params });
    }
}
