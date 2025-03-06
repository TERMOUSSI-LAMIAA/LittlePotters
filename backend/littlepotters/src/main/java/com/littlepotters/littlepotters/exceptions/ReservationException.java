package com.littlepotters.littlepotters.exceptions;

public class ReservationException extends RuntimeException{

    public ReservationException(Long id) {
        super("Reservation not found with the id: " + id);
    }
}
