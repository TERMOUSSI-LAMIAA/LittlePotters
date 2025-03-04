package com.littlepotters.littlepotters.exceptions;

public class WorkshopException extends RuntimeException{
    public WorkshopException(Long id){
        super("Workshop not found with the id: "+ id);
    }
}
