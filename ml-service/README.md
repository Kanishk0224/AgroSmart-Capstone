# AgroSmart 360 — Machine Learning Microservice (Stage 3)

## Overview
This directory is reserved for **Stage 3** of the AgroSmart 360 development roadmap.
It will house the predictive modeling, crop recommendation inference engine, and agronomic yield estimators.

## Planned Technology Stack
- **Runtime:** Python 3.10+
- **Framework:** FastAPI / Flask REST microservice
- **Core ML Libraries:** Scikit-Learn, XGBoost, Pandas, NumPy
- **Models:**
  - Multi-class Random Forest Classifier for N-P-K and meteorological crop matching
  - Gradient Boosted Regressor for seasonal yield estimation
  - Water requirement regression model for irrigation scheduling

## Integration with Stage 1 & 2
- Consumes soil health records (N, P, K, pH, organic matter) from Cloud Firestore
- Consumes regional weather telemetry and parcel irrigation profiles
- Exposes REST endpoints to the Spring Boot backend (`/api/v1/recommendations`)
