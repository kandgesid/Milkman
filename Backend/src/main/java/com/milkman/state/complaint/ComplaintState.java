package com.milkman.state.complaint;

public interface ComplaintState {
    void handle(ComplaintContext context);
    String getStatus();
}
