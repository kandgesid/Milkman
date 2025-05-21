package com.milkman.exception;

import com.milkman.types.ErrorType;
import org.springframework.http.HttpStatus;

public class CustomerException extends ApiException{
    public CustomerException(String message, HttpStatus statusCode) {
        super(message, null, statusCode, null, ErrorType.BUSINESS);
    }
    public CustomerException(String message, String errorCode, HttpStatus statusCode, String details, ErrorType type) {
        super(message, errorCode, statusCode, details, type);
    }
}
