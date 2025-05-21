package com.milkman.template;

import com.milkman.exception.ApiException;
import com.milkman.exception.DetailedExceptionBuilder;
import com.milkman.types.ErrorType;
import org.springframework.http.HttpStatus;

import java.util.UUID;

public abstract class AbstractOrderProcessor {
    public final UUID execute() {
        try {
            validate();
            fetchEntities();
            processCoreLogic();       // <-- varies per use case
            UUID id = updateDatabase();
            notifyObservers();
            return id;
        } catch (ApiException ae) {
            throw ae;
        } catch (Exception e) {
            throw new DetailedExceptionBuilder()
                    .withMessage("Order processing failed")
                    .withStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .withErrorCode("ORDER-TEMPLATE-500")
                    .withType(ErrorType.SYSTEM)
                    .withDetails(e.getMessage())
                    .build();
        }
    }

    protected abstract void validate();
    protected abstract void fetchEntities();
    protected abstract void processCoreLogic();
    protected abstract UUID updateDatabase();
    protected abstract void notifyObservers();
}
