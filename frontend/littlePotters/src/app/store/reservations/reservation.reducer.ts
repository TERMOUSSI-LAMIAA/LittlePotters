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

    on(ReservationActions.loadCustomerReservations, (state, { filter }) => ({
        ...state,
        currentPage: filter.page,
        pageSize: filter.size,
        loading: true,
        error: null
    })),

    on(ReservationActions.loadCustomerReservationsSuccess, (state, { reservations, totalElements, totalPages }) => ({
        ...state,
        reservations,         
        totalElements,
        totalPages,
        loading: false,
        error: null
    })),
    
   
    
    on(ReservationActions.createReservation, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(ReservationActions.createReservationSuccess, (state, { reservation }) => ({
        ...state,
        loading: false,
    })),

    on(ReservationActions.createReservationFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false,
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
    })),

    // Update Reservation places booked 
    on(ReservationActions.updateReservationPlaces, (state, { id }) => ({
        ...state,
        loading: true,
        error: null,
        updatingReservationId: id
    })),

    on(ReservationActions.updateReservationPlacesSuccess, (state, { id, updatedPlaces, workshopPrice }) => {
        const updatedReservations = state.reservations.map(res =>
            res.id === id
                ? { ...res, placesBooked: updatedPlaces, totalPrice: workshopPrice * updatedPlaces }
                : res
        );

        return {
            ...state,
            reservations: updatedReservations,
            loading: false,
            updatingReservationId: null
        };
    }),

    on(ReservationActions.updateReservationPlacesFailure, (state, { id, error }) => ({
        ...state,
        error: {
            ...error,
            reservationId: id 
        },
        loading: false,
        updatingReservationId: null
    })),

    on(ReservationActions.deleteReservation, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ReservationActions.deleteReservationSuccess, (state, { id }) => ({
        ...state,
        loading: false,
        reservations: state.reservations.filter(res => res.id !== id)
    })),
    on(ReservationActions.deleteReservationFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);