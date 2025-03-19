import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { ReservationRequest } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
    
    private apiUrl = 'http://localhost:8081/api/reservations';

    constructor(private http: HttpClient) { }

    // Create new reservation
    createReservation(reservationData: ReservationRequest): Observable<Reservation> {
        return this.http.post<Reservation>(this.apiUrl, reservationData);
    }

    // Update reservation status
    updateReservationStatus(id: number, reservationData: ReservationRequest): Observable<Reservation> {
        return this.http.put<Reservation>(`${this.apiUrl}/${id}/status`, reservationData);
    }

    // Update places booked
    updatePlacesBooked(id: number, reservationData: ReservationRequest): Observable<Reservation> {
        return this.http.put<Reservation>(`${this.apiUrl}/${id}/places`, reservationData);
    }

    getAllReservations(): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(this.apiUrl);
    }

    getReservationById(id: number): Observable<Reservation> {
        return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
    }

    // Delete reservation
    deleteReservation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Get reservations for customer
    getCustomerReservations(): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(`${this.apiUrl}/customer`);
    }

    // Get reservations for instructor
    getInstructorReservations(): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(`${this.apiUrl}/instructor`);
    }
}
