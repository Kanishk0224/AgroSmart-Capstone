# AgroSmart 360 — Local Setup & Deployment Guide

## Prerequisites
- **Frontend:** Node.js 18+ and npm
- **Backend:** Java 8 Development Kit (JDK 1.8) and Apache Maven 3.8+
- **Docker (Optional):** Docker Engine 20.10+

---

## 1. Running the Frontend
From the workspace root:
```bash
# 1. Install dependencies
npm install

# 2. Launch Vite development server (Port 3000)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 2. Running the Java 8 Backend
Navigate to the `backend/` directory:
```bash
cd backend

# Run with Maven (Spring Boot 2.7.x)
mvn clean spring-boot:run
```
The server will start on port `8080`.

Verify health endpoint:
```bash
curl http://localhost:8080/api/v1/health
```

---

## 3. Running via Docker
To containerize and run the Java 8 backend:
```bash
cd backend
docker build -t agrosmart-backend:1.0.0 .
docker run -p 8080:8080 agrosmart-backend:1.0.0
```

---

## 4. Production Build
```bash
# Build React application
npm run build

# Build Java 8 Backend Jar
cd backend && mvn clean package -DskipTests
```
The compiled jar will be created at `backend/target/agrosmart-backend-1.0.0.jar`.
