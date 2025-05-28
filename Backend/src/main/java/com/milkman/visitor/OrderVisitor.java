package com.milkman.visitor;

import com.milkman.model.MilkOrder;

public interface OrderVisitor {
    void visit(MilkOrder order);
}
