package com.milkman.exception;

import com.milkman.types.ErrorType;
import org.springframework.http.HttpStatus;

public class DetailedExceptionBuilder {
    private String message;
    private String errorCode;
    private HttpStatus statusCode;
    private String details;
    private ErrorType type;

    public DetailedExceptionBuilder withErrorCode(String errorCode) {
        this.errorCode = errorCode;
        this.message = ErrorMessageFlyweight.get(errorCode);
        return this;
    }

    public DetailedExceptionBuilder withStatusCode(HttpStatus statusCode) {
        this.statusCode = statusCode;
        return this;
    }

    public DetailedExceptionBuilder withDetails(String details) {
        this.details = details;
        return this;
    }

    public DetailedExceptionBuilder withType(ErrorType type) {
        this.type = type;
        return this;
    }

    public ApiException build() {
        return new ApiException(message, errorCode, statusCode, details, type);
    }
}
