package com.milkman.handlers.complaint;

import com.milkman.state.complaint.ComplaintContext;
import com.milkman.state.complaint.ResolveState;

public class ResolveComplaintHandler extends ComplaintActionHandler{
    @Override
    public boolean handle(ComplaintContext context) {
        if("RESOLVE".equalsIgnoreCase(context.getComplaint().getAction())){
            context.transitionTo(new ResolveState());
            return true;
        }
        return nextHandler != null && nextHandler.handle(context);
    }
}
