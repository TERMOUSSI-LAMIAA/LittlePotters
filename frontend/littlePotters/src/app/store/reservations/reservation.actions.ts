import { createAction, props } from "@ngrx/store"
import { ReservationsFilter } from "../reservation.state"
import { Reservation } from "../../core/models/reservation.model"


// Load Reservations
export const loadReservations = createAction(
    "[Reservations] Load Reservations",
    props<{ filter: ReservationsFilter }>(),
)

export const loadReservationsSuccess = createAction(
    "[Reservations] Load Reservations Success",
    props<{
        reservations: Reservation[]
        totalElements: number
        totalPages: number
    }>(),
)

export const loadReservationsFailure = createAction("[Reservations] Load Reservations Failure", props<{ error: any }>())



// Update Reservation Status
export const updateReservationStatus = createAction(
    "[Reservations] Update Reservation Status",
    props<{ id: number; status: string }>(),
)

export const updateReservationStatusSuccess = createAction(
    "[Reservations] Update Reservation Status Success",
    props<{ reservation: Reservation }>(),
)

export const updateReservationStatusFailure = createAction(
    "[Reservations] Update Reservation Status Failure",
    props<{ error: any }>(),
)