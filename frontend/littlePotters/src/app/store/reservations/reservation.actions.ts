import { createAction, props } from "@ngrx/store"
import { ReservationsFilter } from "../reservation.state"
import { Reservation, ReservationStatus } from "../../core/models/reservation.model"


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

export const loadCustomerReservations = createAction(
    "[Reservations] Load Customer Reservations",
    props<{ filter: ReservationsFilter }>()
);

export const loadCustomerReservationsSuccess = createAction(
    "[Reservations] Load Customer Reservations Success",
    props<{ reservations: Reservation[]; totalElements: number; totalPages: number }>()
);

export const loadCustomerReservationsFailure = createAction(
    "[Reservations] Load Customer Reservations Failure",
    props<{ error: any }>()
);
// Create Reservation
export const createReservation = createAction(
    "[Reservations] Create Reservation",
    props<{ reservation: { workshopId: number; placesBooked: number; status?: ReservationStatus } }>(),
)

export const createReservationSuccess = createAction(
    "[Reservations] Create Reservation Success",
    props<{ reservation: Reservation }>(),
)

export const createReservationFailure = createAction(
    "[Reservations] Create Reservation Failure",
    props<{ error: any }>(),
)


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
// Update Reservation places booked
export const updateReservationPlaces = createAction(
    "[Reservations] Update Reservation Places",
    props < { id: number; newPlaces: number, workshopPrice: number }>()
);

export const updateReservationPlacesSuccess = createAction(
    "[Reservations] Update Reservation Places Success",
    props<{ id: number; updatedPlaces: number, workshopPrice: number }>()
);

export const updateReservationPlacesFailure = createAction(
    "[Reservations] Update Reservation Places Failure",
    props<{ id: number; error: any }>()
);

export const deleteReservation = createAction(
    '[Reservations] Delete Reservation',
    props<{ id: number }>()
);

export const deleteReservationSuccess = createAction(
    '[Reservations] Delete Reservation Success',
    props<{ id: number }>()
);

export const deleteReservationFailure = createAction(
    '[Reservations] Delete Reservation Failure',
    props<{ error: any }>()
);