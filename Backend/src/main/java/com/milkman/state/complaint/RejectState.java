package com.milkman.state.complaint;

public class RejectState implements ComplaintState{
    @Override
    public void handle(ComplaintContext context) {
        // Do nothing : its a terminal state.
    }

    @Override
    public String getStatus() {
        return "REJECTED";
    }
}
