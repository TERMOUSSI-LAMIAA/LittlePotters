package com.littlepotters.littlepotters.exceptions;

public class RoleException extends RuntimeException{

    public RoleException(Long id){
        super("Role not found with the id: "+ id);
    }
    public RoleException(String roleName) {
        super("Role not found with the name: " + roleName);
    }
}
