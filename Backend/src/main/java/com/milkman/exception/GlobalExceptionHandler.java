package com.milkman.exception;

import com.milkman.service.LoggerService;
import com.milkman.types.ErrorType;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private final LoggerService logger;

    public GlobalExceptionHandler() {
        this.logger = LoggerService.getInstance(); // Singleton logger
    }
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<?> handleApiException(ApiException ex, WebRequest request) {
        logger.logError("APIException: " + ex.getMessage() + " | Details: " + ex.getDetails());
        return ResponseEntity
                .status(ex.getStatusCode())
                .body(ex);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> handleDatabaseException(DataAccessException ex, WebRequest request) {
        logger.logError("Database Error: " + ex.getMessage());
        return ResponseEntity
                .status(500)
                .body(new DetailedExceptionBuilder()
                        .withMessage("Database operation failed")
                        .withStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                        .withErrorCode("DB-500")
                        .withType(ErrorType.DATABASE)
                        .withDetails(ex.toString())
                        .build()
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception ex, WebRequest request) {
        logger.logError("Unhandled Exception: " + ex.getMessage());
        return ResponseEntity
                .status(500)
                .body(new DetailedExceptionBuilder()
                        .withMessage("Unexpected error")
                        .withStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                        .withErrorCode("GEN-500")
                        .withType(ErrorType.SYSTEM)
                        .withDetails(ex.toString())
                        .build()
                );
    }
}
