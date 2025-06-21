# 🥛 MilkMate – Daily Milk Delivery Management App

Milkman is a full-stack mobile-first application built to streamline the operations of daily milk delivery services. It connects milkmen and customers through a seamless interface, allowing order placement, delivery tracking, customer management, and real-time status updates.

---

## 🚀 Tech Stack

### Backend
- **Java 17**
- **Spring Boot**
- **Spring Data JPA**
- **PostgreSQL**

### Frontend
- **React Native (Expo)**
- **react-native-paper**
- **Axios**

---

## ✅ Features

- 📦 Place, confirm, and cancel milk orders
- 🔔 Real-time order notifications
- 🧾 Order history and report generation
- 👤 Role-based user management (Milkman & Customer)
- 💬 Complaint logging and resolution system
- 🛠️ Modular backend using 18 Design Patterns (Factory, Singleton, Observer, etc.)

---

## 🛠️ Local Development Setup

### Prerequisites

Before running the project locally, make sure you have the following installed:

- Java 17+
- Node.js (v18 or above)
- PostgreSQL
- Gradle (comes with the project)
- Expo CLI:
  
  ```bash
  npm install -g expo-cli
  ```

## 📂 Backend Setup (Spring Boot + PostgreSQL)
###	Clone the repository
  ```bash
  git clone https://github.com/vedvkandge2000/Milkman.git
  cd Milkman/Backend
  ```
### Create a PostgreSQL database
Open your PostgreSQL client and create a new database named milkman.

### Update database configuration
Open src/main/resources/application.properties and update your PostgreSQL username and password:
  
```bash
spring.datasource.url=jdbc:postgresql://localhost:5432/milkman
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```
### Run the backend
If using terminal
```bash
./gradlew bootRun
```
You can run it from your java IDE also.

The backend will be available at:
http://localhost:8080

## 📱 Frontend Setup (Expo + React Native)
## Navigate to the frontend folder
```bash
cd ../Frontend
```

### Install dependencies
```bash
npm install
```

### Setup local IP for expo
Run below command in terminal
```bash
ipconfig getifaddr en0;
```
Get the IP and update the API_URL in axiosConfig.js: http://<YOUR_IP>:8080

### Run the frontend
Start the Expo development server:
```bash
npx expo start
```

### View the app
- Scan the QR code using the Expo Go app on your phone or
- Use an emulator to run the app

## 🤝 Contributing
Pull requests are welcome!
For major changes, please open an issue first to discuss what you would like to improve.

Steps to contribute:
- Fork the repository
- Create a new branch (git checkout -b feature/your-feature)
- Commit your changes (git commit -m 'Add some feature')
- Push to the branch (git push origin feature/your-feature)
- Open a pull request

## 📄 License
This project is licensed under the [MIT License](LICENSE).

## 🙋‍♂️ Authors
Vedant Kandge
Master’s in Computer Science – Santa Clara University

Siddhant Kandge
Master’s in Computer Science – Santa Clara University

Sai Deshmukh
Master’s in Computer Science – Santa Clara University

