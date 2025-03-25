import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as ReservationActions from './reservation.actions';
import { ReservationService } from '../../core/services/reservation.service';

@Injectable()
export class ReservationEffects {

    loadReservations$ = createEffect(() => this.actions$.pipe(
        ofType(ReservationActions.loadReservations),
        mergeMap(({ filter }) =>
            this.reservationService.getInstructorReservations(filter.page, filter.size, filter.workshopId ?? undefined).pipe(
                map(response => ReservationActions.loadReservationsSuccess({
                    reservations: response.content,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages
                })),
                catchError(error => of(ReservationActions.loadReservationsFailure({ error })))
            )
        )
    ));

    loadCustomerReservations$ = createEffect(() => this.actions$.pipe(
        ofType(ReservationActions.loadCustomerReservations),
        mergeMap(({ filter }) =>
            this.reservationService.getCustomerReservations(
                filter.page,
                filter.size,
                filter.workshopId ?? undefined
            ).pipe(
                map(response => ReservationActions.loadCustomerReservationsSuccess({
                    reservations: response.content,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages
                })),
                catchError(error => of(ReservationActions.loadCustomerReservationsFailure({ error })))
            )
        )
    ));

    createReservation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ReservationActions.createReservation),
            mergeMap(({ reservation }) =>
                this.reservationService.createReservation(reservation).pipe(
                    map((createdReservation) => ReservationActions.createReservationSuccess({ reservation: createdReservation })),
                    catchError((error) => of(ReservationActions.createReservationFailure({ error }))),
                ),
            ),
        ),
    )

    updateReservationPlaces$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ReservationActions.updateReservationPlaces),
            mergeMap(({ id, newPlaces }) =>
                this.reservationService.updatePlacesBooked(id, newPlaces).pipe(
                    map(() =>
                        ReservationActions.updateReservationPlacesSuccess({
                            id,
                            updatedPlaces: newPlaces
                        })
                    ),
                    catchError(error =>
                        of(ReservationActions.updateReservationPlacesFailure({
                            id,
                            error: error.message || 'Failed to update places'
                        }))
                    )
                )
            )
        )
    );

    deleteReservation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ReservationActions.deleteReservation),
            mergeMap(({ id }) =>
                this.reservationService.deleteReservation(id).pipe(
                    map(() => ReservationActions.deleteReservationSuccess({ id })),
                    catchError(error => of(ReservationActions.deleteReservationFailure({ error })))
                )
            )
        )
    );
    
    updateReservationStatus$ = createEffect(() => this.actions$.pipe(
        ofType(ReservationActions.updateReservationStatus),
        mergeMap(({ id, status }) =>
            this.reservationService.updateReservationStatus(id, status).pipe(
                map(reservation => ReservationActions.updateReservationStatusSuccess({ reservation })),
                catchError(error => of(ReservationActions.updateReservationStatusFailure({ error })))
            )   
        )
    ));

    constructor(
        private actions$: Actions,
        private reservationService: ReservationService
    ) { }
}