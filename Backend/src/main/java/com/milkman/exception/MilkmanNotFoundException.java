package com.milkman.exception;

import com.milkman.types.ErrorType;
import org.springframework.http.HttpStatus;

import java.util.UUID;

public class MilkmanNotFoundException extends ApiException{
    public MilkmanNotFoundException(UUID milkmanId) {
        super("Milkman not found",
                "MILKMAN-404",
                HttpStatus.NOT_FOUND,
                "Milkman ID not found: " + milkmanId,
                ErrorType.BUSINESS);
    }
}
