package com.milkman.exception;

import com.milkman.types.ErrorType;
import org.springframework.http.HttpStatus;

import java.util.UUID;

public class CustomerNotFoundException extends ApiException {
    public CustomerNotFoundException(UUID customerId) {
        super("Customer not found",
                "CUST-404",
                HttpStatus.NOT_FOUND,
                "Customer ID not found: " + customerId,
                ErrorType.BUSINESS);
    }
}
