# AgroSmart 360 — Backend REST API Specification

Base URL: `/api/v1`
Authorization: All endpoints (except `/health`) require `Authorization: Bearer <FIREBASE_ID_TOKEN>`.

---

## 1. System Health
### `GET /api/v1/health`
- **Access:** Public
- **Response:**
```json
{
  "success": true,
  "message": "System Operational",
  "data": {
    "status": "UP",
    "service": "AgroSmart 360 Backend",
    "javaVersion": "1.8.0_xxx",
    "stage": "STAGE_1_FOUNDATION"
  }
}
```

---

## 2. User & Authentication
### `GET /api/v1/auth/profile`
- **Access:** Authenticated
- **Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "uid": "user_12345",
    "email": "farmer@example.com",
    "fullName": "Rajesh Patel",
    "phoneNumber": "+91 98765 43210",
    "role": "FARMER",
    "termsAccepted": true
  }
}
```

### `POST /api/v1/auth/sync-profile`
- **Access:** Authenticated
- **Payload:**
```json
{
  "fullName": "Rajesh Patel",
  "phoneNumber": "+91 98765 43210",
  "termsAccepted": true
}
```

---

## 3. Farm Plots Management
### `GET /api/v1/farms`
- **Access:** Authenticated
- **Description:** Returns all farms owned by the requesting farmer.

### `GET /api/v1/farms/{id}`
- **Access:** Authenticated (Owner only)

### `POST /api/v1/farms`
- **Access:** Authenticated
- **Payload:**
```json
{
  "name": "Green Valley Organic Estate",
  "location": "District Nashik, Maharashtra",
  "totalAreaAcres": 14.5,
  "soilType": "LOAMY",
  "irrigationSource": "DRIP",
  "primaryCropType": "Pomegranate & Grapes",
  "notes": "Gentle eastern slope with automated micro-drip network."
}
```

### `PUT /api/v1/farms/{id}`
- **Access:** Authenticated (Owner only)

### `DELETE /api/v1/farms/{id}`
- **Access:** Authenticated (Owner only)

---

## 4. Soil Health Testing
### `GET /api/v1/soil-tests?farmId={farmId}`
- **Access:** Authenticated
- **Description:** Returns soil assays, optionally filtered by parcel ID.

### `POST /api/v1/soil-tests`
- **Access:** Authenticated
- **Payload:**
```json
{
  "farmId": "farm-001",
  "testDate": "2026-10-10",
  "phLevel": 6.8,
  "nitrogenLevel": 320,
  "phosphorusLevel": 24,
  "potassiumLevel": 210,
  "organicMatter": 2.4,
  "moistureContent": 22,
  "electricalConductivity": 0.45
}
```

---

## 5. Dashboard Summary
### `GET /api/v1/dashboard/summary`
- **Access:** Authenticated
- **Description:** Returns real-time computed statistics: total farms, total acreage, average soil pH, optimal fertility ratio, deficient plots, and recent records.
