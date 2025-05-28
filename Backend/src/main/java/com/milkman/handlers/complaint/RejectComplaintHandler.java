package com.milkman.handlers.complaint;

import com.milkman.state.complaint.ComplaintContext;
import com.milkman.state.complaint.RejectState;

public class RejectComplaintHandler extends ComplaintActionHandler{
    @Override
    public boolean handle(ComplaintContext context) {
        if("REJECT".equalsIgnoreCase(context.getComplaint().getAction())){
            context.transitionTo(new RejectState());
            return true;
        }
        return nextHandler != null && nextHandler.handle(context);
    }
}
