package com.milkman.state.complaint;

import com.milkman.exception.DetailedExceptionBuilder;
import com.milkman.handlers.complaint.ComplaintActionHandler;
import com.milkman.handlers.complaint.RejectComplaintHandler;
import com.milkman.handlers.complaint.ResolveComplaintHandler;
import com.milkman.types.ErrorType;
import org.springframework.http.HttpStatus;

public class InProgressState implements ComplaintState{
    @Override
    public void handle(ComplaintContext context) {
        ComplaintActionHandler chain = new ResolveComplaintHandler();
        chain.setNextHandler(new RejectComplaintHandler());

        if(!chain.handle(context)){
            throw new DetailedExceptionBuilder()
                    .withStatusCode(HttpStatus.BAD_REQUEST)
                    .withErrorCode("COMPLAINT-ACTION-INVALID")
                    .withType(ErrorType.BUSINESS)
                    .withDetails("Received unsupported action: " + context.getComplaint().getAction())
                    .build();
        }
        if(context.getComplaint().getAction().equalsIgnoreCase("RESOLVE")){
            context.transitionTo(new ResolveState());
        }else if(context.getComplaint().getAction().equalsIgnoreCase("REJECT")){
            context.transitionTo(new RejectState());
        }
    }

    @Override
    public String getStatus() {
        return "IN_PROGRESS";
    }
}
