import { createReducer, on } from '@ngrx/store';
import * as ReservationActions from './reservation.actions';
import { initialReservationState } from '../reservation.state';

export const reservationReducer = createReducer(
    initialReservationState,

    // Load Reservations
    on(ReservationActions.loadReservations, (state, { filter }) => ({
        ...state,
        currentPage: filter.page,
        pageSize: filter.size,
        loading: true,
        error: null
    })),

    on(ReservationActions.loadReservationsSuccess, (state, { reservations, totalElements, totalPages }) => ({
        ...state,
        reservations,
        totalElements,
        totalPages,
        loading: false
    })),

    on(ReservationActions.loadReservationsFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),

    // Update Reservation Status
    on(ReservationActions.updateReservationStatus, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(ReservationActions.updateReservationStatusSuccess, (state, { reservation }) => {
        const updatedReservations = state.reservations.map(res =>
            res.id === reservation.id ? { ...res, status: reservation.status } : res
        );

        return {
            ...state,
            reservations: updatedReservations,
            loading: false
        };
    }),

    on(ReservationActions.updateReservationStatusFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    }))
);