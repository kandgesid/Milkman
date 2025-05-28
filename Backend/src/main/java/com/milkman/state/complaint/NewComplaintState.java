package com.milkman.state.complaint;

public class NewComplaintState implements ComplaintState{
    @Override
    public void handle(ComplaintContext context) {
        context.transitionTo(new InProgressState());
    }

    @Override
    public String getStatus() {
        return "NEW";
    }
}
