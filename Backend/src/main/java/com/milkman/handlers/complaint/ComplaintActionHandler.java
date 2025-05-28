package com.milkman.handlers.complaint;

import com.milkman.state.complaint.ComplaintContext;

public abstract class ComplaintActionHandler {
    ComplaintActionHandler nextHandler;
    public ComplaintActionHandler setNextHandler(ComplaintActionHandler handler){
        this.nextHandler = handler;
        return nextHandler;
    }

    public abstract boolean handle(ComplaintContext context);
}
