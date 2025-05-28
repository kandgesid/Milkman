package com.milkman.visitor;

public interface OrderVisitable {
    void accept(OrderVisitor visitor);
}
