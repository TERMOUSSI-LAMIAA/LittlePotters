export enum ReservationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELED = 'CANCELLED'
}

export interface Reservation {
    id: number;
    reservationDate: string; 
    status: ReservationStatus;
    placesBooked: number;
    totalPrice: number;
    customerId: number; 
    workshopId: number; 
}

export interface ReservationRequest {
    workshopId: number;
    placesBooked: number;
    status?: ReservationStatus; 
}