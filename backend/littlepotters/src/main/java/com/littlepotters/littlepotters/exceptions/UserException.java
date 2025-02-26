package com.littlepotters.littlepotters.exceptions;

public class UserException  extends RuntimeException {
    public UserException(Long id){
        super("User not found with the id: "+ id);
    }

}
