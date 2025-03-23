import { Reservation } from "../core/models/reservation.model";


export interface ReservationsFilter {
    workshopId?: number | null;
    page: number;
    size: number;
}

export interface ReservationState {
    reservations: Reservation[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    loading: boolean;
    error: any;
}

export const initialReservationState: ReservationState = {
    reservations: [],
    currentPage: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    loading: false,
    error: null
};