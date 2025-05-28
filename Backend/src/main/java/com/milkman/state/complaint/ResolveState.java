package com.milkman.state.complaint;

public class ResolveState implements ComplaintState{
    @Override
    public void handle(ComplaintContext context) {
        // Do nothing : this is terminal state
    }

    @Override
    public String getStatus() {
        return "RESOLVED";
    }
}
