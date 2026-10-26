# AgroSmart 360 — Architecture Documentation

## System Architecture

AgroSmart 360 is engineered as a production-minded agricultural management platform designed across three progressive stages:
- **Stage 1 (Current):** Foundation, Authentication, Agricultural Dashboard, Farm Plot CRUD, Laboratory Soil Test Record Management, and Cloud Firestore Integration.
- **Stage 2 (Planned):** Intelligent Crop Recommendations, Smart Water Management, Crop Rotation Planner, and Hyperlocal Weather Advisory.
- **Stage 3 (Planned):** Farm Profitability, ML Microservice, Official Government-Format Soil Health Card Reports.

### Monorepo Layout
```
AgroSmart360/
├── frontend/             # React, TypeScript, Vite, Tailwind CSS, Recharts
│   └── src/
│       ├── components/   # Layout, Dashboard, Farms, Soil, Charts, Forms
│       ├── pages/        # Landing, Login, Register, Dashboard, Farms, Soil, Profile
│       ├── services/     # API Client, Firebase Auth, Farm CRUD, Soil CRUD
│       └── types/        # Strongly-typed data models
├── backend/              # Java 8 Spring Boot 2.7.x REST API
│   ├── src/main/java/com/agrosmart/
│   │   ├── config/       # Firebase, Security, CORS
│   │   ├── controller/   # REST Controllers (stateless, token protected)
│   │   ├── dto/          # Data Transfer Objects with Bean Validation
│   │   ├── exception/    # Controller advice and custom domain exceptions
│   │   ├── model/        # Entities (Java 8 POJOs)
│   │   ├── repository/   # Cloud Firestore repositories with cache fallbacks
│   │   ├── security/     # Firebase Authentication filter & token verifier
│   │   ├── service/      # Business logic & agronomic algorithms
│   │   └── util/         # SoilHealthCalculator, DateUtils
│   └── pom.xml           # Maven Java 8 configuration
├── ml-service/           # Stage 3 Python/FastAPI Machine Learning pipeline
├── docs/                 # Architectural specifications and deployment guides
├── firebase-blueprint.json
├── firestore.rules
└── README.md
```

### Security & Token Flow
1. Farmer signs in via **Firebase Authentication** (Google Popup or Email/Password).
2. The client acquires a cryptographic **Firebase ID Token**.
3. All requests to protected endpoints (`/api/v1/*`) attach the token in the `Authorization: Bearer <TOKEN>` header.
4. The Spring Boot backend's `FirebaseAuthenticationFilter` intercepts requests and validates the token using `FirebaseAuth.verifyIdToken()`.
5. Authenticated context establishes principal identity `SecurityUser` and enforces `ROLE_FARMER` authorization.
6. Cloud Firestore security rules strictly prevent privilege escalation, cross-tenant data leakage, and unauthenticated reads.
