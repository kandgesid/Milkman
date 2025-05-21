package com.milkman.exception;

import com.milkman.types.ErrorType;
import org.springframework.http.HttpStatus;

public class OrderNotFoundException extends ApiException{

    public OrderNotFoundException(String message) {
        super(message, "ORDER-404", HttpStatus.NOT_FOUND, null, ErrorType.BUSINESS);
    }
}
