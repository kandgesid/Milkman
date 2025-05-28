package com.milkman.state.complaint;

import com.milkman.model.Complaint;

public class ComplaintContext {
    private Complaint complaint;
    private ComplaintState currentState;

    public ComplaintContext(Complaint complaint) {
        this.complaint = complaint;
        this.currentState = getStateFromStatus(this.complaint.getStatus());
    }

    public Complaint getComplaint() {
        return complaint;
    }

    public ComplaintState getCurrentState() {
        return currentState;
    }

    public void handle() {
        currentState.handle(this);
    }


    public void transitionTo(ComplaintState newState) {
        this.currentState = newState;
        this.complaint.setStatus(newState.getStatus());
    }
    public ComplaintState getStateFromStatus(String status) {
        return switch (status.trim().toUpperCase()) {
            case "NEW" -> new NewComplaintState();
            case "IN_PROGRESS" -> new InProgressState();
            case "RESOLVED" -> new ResolveState();
            case "REJECTED" -> new RejectState();
            default -> throw new IllegalStateException("Unknown status: " + status);
        };
    }
}
