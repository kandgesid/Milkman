# MilkMan Application

A full-stack application with Spring Boot backend and React Native frontend.

## Prerequisites

- Java 17 or later
- Node.js and npm
- PostgreSQL
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for development)

## Backend Setup

1. Create a PostgreSQL database named `milkman_db`
2. Update the database credentials in `src/main/resources/application.properties` if needed
3. Navigate to the project root directory
4. Run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```

The backend will be available at `http://localhost:8080`

## API Endpoints

- GET /api/users - Get all users
- GET /api/users/{id} - Get user by ID
- POST /api/users - Create new user
- PUT /api/users/{id} - Update user
- DELETE /api/users/{id} - Delete user
