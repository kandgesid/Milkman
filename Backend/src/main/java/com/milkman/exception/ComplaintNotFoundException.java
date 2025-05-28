package com.milkman.exception;

import com.milkman.types.ErrorType;
import org.springframework.http.HttpStatus;

import java.util.UUID;

public class ComplaintNotFoundException extends ApiException {
    public ComplaintNotFoundException(UUID complaintId) {
        super("Complaint not found",
                "COMPLAINT-404",
                HttpStatus.NOT_FOUND,
                "Complaint with ID " + complaintId + " not found: ",
                ErrorType.BUSINESS);
    }
}
