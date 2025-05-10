package com.milkman.repository;

import com.milkman.DTO.MilkOrderResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class JdbcRepository {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private NamedParameterJdbcTemplate namedJdbc;

    /** Run a query with positional params and map each row. */
    public <T> List<T> query(String sql, Object[] args, RowMapper<T> mapper) {
        return jdbc.query(sql, args, mapper);
    }

    /** Query for exactly one row. */
    public <T> T queryForObject(String sql, Object[] args, RowMapper<T> mapper) {
        return jdbc.queryForObject(sql, args, mapper);
    }

    /** Run a named-parameter query returning raw maps. */
    public List<Map<String, Object>> queryForList(String sql, Map<String, ?> params) {
        return namedJdbc.queryForList(sql, params);
    }

    /** Execute an update (INSERT/UPDATE/DELETE). */
    public int update(String sql, Object... args) {
        return jdbc.update(sql, args);
    }

    /** Execute a named-parameter update. */
    public int update(String sql, Map<String, ?> params) {
        return namedJdbc.update(sql, params);
    }
}
