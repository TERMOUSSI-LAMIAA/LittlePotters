import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReservationState } from '../reservation.state';

export const selectReservationState = createFeatureSelector<ReservationState>('reservations');

export const selectReservations = createSelector(
    selectReservationState,
    (state) => state.reservations
);

export const selectCurrentPage = createSelector(
    selectReservationState,
    (state) => state.currentPage
);

export const selectPageSize = createSelector(
    selectReservationState,
    (state) => state.pageSize
);

export const selectTotalElements = createSelector(
    selectReservationState,
    (state) => state.totalElements
);

export const selectTotalPages = createSelector(
    selectReservationState,
    (state) => state.totalPages
);

export const selectLoading = createSelector(
    selectReservationState,
    (state) => state.loading
);

export const selectError = createSelector(
    selectReservationState,
    (state) => state.error
);