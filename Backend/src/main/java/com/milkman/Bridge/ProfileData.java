package com.milkman.Bridge;

import java.util.*;

public class ProfileData {
    private final Map<String,Object> fields;

    public ProfileData(Map<String,Object> fields) {
        this.fields = fields;
    }
    public Object get(String key)        { return fields.get(key); }
    public Map<String,Object> getAll()   { return fields; }
}
