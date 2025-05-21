package com.milkman.service;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LoggerService {
    private static LoggerService instance;
    private static final String LOG_FILE = "application.log";
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private LoggerService() {
        // private constructor to prevent multiple instantiation
    }

    public static synchronized LoggerService getInstance() {
        if (instance == null) {
            instance = new LoggerService();
        }
        return instance;
    }

    private void writeLog(String level, String message) {
        String timestamp = LocalDateTime.now().format(formatter);
        String logEntry = String.format("[%s] [%s] %s", timestamp, level, message);

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(LOG_FILE, true))) {
            writer.write(logEntry);
            writer.newLine();
        } catch (IOException e) {
            System.err.println("[LOGGER ERROR] Failed to write log: " + e.getMessage());
        }
    }

    public void logInfo(String message) {
        writeLog("INFO", message);
    }

    public void logError(String message) {
        writeLog("ERROR", message);
    }

    public void logDebug(String message) {
        writeLog("DEBUG", message);
    }
}
