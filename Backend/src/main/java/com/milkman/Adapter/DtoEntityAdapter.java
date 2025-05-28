package com.milkman.Adapter;

public interface DtoEntityAdapter<D, E> {
    E toEntity(D dto);
    D toDto(E entity);
}