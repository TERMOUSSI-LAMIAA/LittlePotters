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