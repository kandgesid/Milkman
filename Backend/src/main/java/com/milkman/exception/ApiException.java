package com.milkman.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.milkman.types.ErrorType;
import org.springframework.http.HttpStatus;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiException extends RuntimeException{
    private final String errorCode;
    private final HttpStatus statusCode;
    private final String details;
    private final ErrorType type;

    public ApiException(String message, String errorCode, HttpStatus statusCode, String details, ErrorType type) {
        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.details = details;
        this.type = type;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public HttpStatus getStatusCode() {
        return statusCode;
    }

    public String getDetails() {
        return details;
    }

    public ErrorType getType() {
        return type;
    }
}
