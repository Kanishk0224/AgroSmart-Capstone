# AgroSmart 360: An Intelligent Crop Recommendation and Sustainable Agriculture Management System

> **Tagline:** *"Grow Smarter. Save Water. Sustain the Future."*

---

## Stage 2 — Crop Intelligence, Sustainability and Farm Planning

**AgroSmart 360** is a full-stack precision agriculture and decision-support web application. 
- **Stage 1:** Delivered foundation, farmer authentication, farm plot CRUD, laboratory soil test assays, and Firebase integration.
- **Stage 2:** Implements the agricultural intelligence layer:
  1. Multi-factor crop recommendation engine (Soil 35%, Water 25%, Season 20%, Climate 10%, Rotation 10%)
  2. Multi-crop side-by-side comparison matrix
  3. Hydrologic water budgeting using USDA-SCS effective rainfall runoff deduction
  4. Crop rotation succession planner with botanical family disease breaking & legume biological N-credit
  5. Itemized cultivation economics, APMC price modeling, break-even prices, and ROI %
  6. Historical recommendation snapshots & seasonal farming plan manager
  7. Data confidence & uncertainty disclosure for missing lab assays
  8. Verified ICAR/FAO agronomic crop catalog encyclopedia

---

## 🌾 Primary Features Implemented in Stage 2

1. **Intelligent Crop Recommendation Engine (`/recommendations`):**
   - Synthesizes chemical soil parameters (N-P-K, pH), irrigation conveyance, target season, climate temperature, and preceding crop.
   - Transparent scoring breakdown with positive agronomic reasoning badges and critical constraint warnings.
   - Dynamic weight re-normalization when weather or lab readings are incomplete.

2. **Multi-Crop Option Comparison Matrix:**
   - Select up to 3 prospective cultivars to evaluate side-by-side on suitability scores, water requirements, vegetative duration, soil compatibility, and sustainability metrics.

3. **Hydrologic Water Management & Budgeting (`/water-budget`):**
   - Calculates net and gross irrigation requirements based on conveyance efficiencies (Drip 90%, Sprinkler 75%, Canal 55%, Rain-fed 100%).
   - USDA-SCS effective precipitation subtraction model ($P_{eff} = \max(0, P \times 0.75 - 10)$).
   - Volumetric demand in cubic meters ($m^3$) and millimeters depth.
   - Water balance status gauge (`SURPLUS`, `SUFFICIENT`, `MODERATE_DEFICIT`, `SEVERE_DEFICIT`).
   - Seasonal water conservation guidance (mulching, tensiometers, sub-surface drip, night irrigation).

4. **Crop Rotation & Pest Cycle Mitigator (`/crop-rotation`):**
   - Evaluates botanical families to break fungal wilt (*Fusarium*/*Verticillium*) and Root-Knot Nematode cycles.
   - Cereal monoculture depletion warnings vs legume biological nitrogen alternation credits.
   - Farm parcel crop history timeline logging previous sowing, harvest, and realized yields.

5. **Cultivation Economics & ROI Comparator (`/profitability`):**
   - Itemized expenditures for seeds, fertilizers, labour, irrigation power, equipment machinery, and harvest.
   - Projected gross revenue, total operational costs, net profit per acre, break-even price per quintal, and ROI %.
   - Financial sensitivity and APMC market volatility risk disclosures.

6. **Verified Agricultural Crop Catalog (`/crops`):**
   - Encyclopedia of verified major crops with ICAR & FAO agronomic citations.
   - Filter by crop category (`CEREAL`, `PULSE`, `OILSEED`, `FIBRE`, `CASH_CROP`, `HORTICULTURE`), suitable soil textures, and sowing seasons.
   - Physiological comfort thresholds, N-P-K nutrient uptake bands, and botanical metadata.

7. **Seasonal Farming Blueprints (`/farming-plans`):**
   - Save and revisit actionable seasonal farming plans.
   - Track progress from `PLANNED` to `IN_PROGRESS` and `HARVESTED`.
   - Linked to target acreages, hydrological water budgets, and expected net earnings.

---

## 🛠 Technology Stack

### Frontend
- **Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Data Visualizations:** Recharts
- **Database Client:** Firebase JS SDK v12+ (Cloud Firestore & Firebase Auth)

### Backend (Java 8 Compatible)
- **Runtime:** Java 8 (OpenJDK 1.8)
- **Framework:** Spring Boot 2.7.18
- **Build System:** Maven 3.8+
- **Security:** Spring Security with Stateless Firebase Bearer Token Filter
- **SDK:** Firebase Admin SDK (compatible with Java 8)
- **Testing:** JUnit 5, Mockito

---

## 📡 Backend REST API Endpoints (Java 8 Spring Boot)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/health` | Health & system status | No |
| `GET` | `/api/v1/crops` | List verified crop catalog with filters | No |
| `GET` | `/api/v1/crops/{id}` | Get single crop agronomic details | No |
| `POST` | `/api/v1/recommendations/generate` | Multi-factor crop suitability scoring | Yes (Bearer Token) |
| `GET` | `/api/v1/recommendations/history` | Get user's past recommendation runs | Yes |
| `GET` | `/api/v1/recommendations/{id}` | Get specific recommendation run | Yes |
| `POST` | `/api/v1/water-budget/calculate` | Hydrologic water budget calculation | Yes |
| `GET` | `/api/v1/water-budget/farm/{farmId}` | Get saved water budgets for farm | Yes |
| `POST` | `/api/v1/crop-rotation/evaluate` | Evaluate candidate crop rotation synergy | Yes |
| `GET` | `/api/v1/crop-rotation/history/{farmId}` | Get crop planting history for farm | Yes |
| `POST` | `/api/v1/crop-rotation/history/{farmId}` | Log planted crop history record | Yes |
| `POST` | `/api/v1/profitability/estimate` | Estimate cultivation costs & ROI % | Yes |
| `GET` | `/api/v1/profitability/history` | Get saved economic estimates | Yes |
| `GET` | `/api/v1/farms` | List farmer's agricultural parcels | Yes |
| `POST` | `/api/v1/farms` | Register new farm parcel | Yes |
| `GET` | `/api/v1/soil-tests` | List farmer's soil laboratory assays | Yes |
| `POST` | `/api/v1/soil-tests` | Log new soil test record | Yes |
- **Visualizations:** Recharts
- **Forms & Validation:** React Hook Form, Zod
- **Icons:** Lucide React
- **Cloud SDK:** Firebase Web SDK v11

### Backend
- **Runtime:** Java 8 (OpenJDK 1.8)
- **Framework:** Spring Boot 2.7.18
- **Build Tool:** Apache Maven
- **Security:** Spring Security + Firebase Admin SDK 8.2.0
- **Validation:** Hibernate Validator / Bean Validation (JSR 380)
- **Testing:** JUnit 5, Spring Boot Test

### Database & Cloud
- **Database:** Google Cloud Firestore (Enterprise Mode)
- **Authentication:** Firebase Authentication

---

## 📂 Monorepo Architecture

```
AgroSmart360/
├── frontend/             # Frontend source code and assets
├── backend/              # Java 8 Spring Boot 2.7.x backend
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/agrosmart/
├── ml-service/           # Reserved for Stage 3 Machine Learning models
├── docs/                 # Architectural specs and API documentation
│   ├── ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── FIREBASE_SETUP.md
│   └── DEPLOYMENT_GUIDE.md
├── firebase-blueprint.json
├── firestore.rules
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Launching the Web Dashboard
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Launching the Java 8 Backend
```bash
cd backend
mvn clean spring-boot:run
```
Backend health endpoint is accessible at `http://localhost:8080/api/v1/health`.
