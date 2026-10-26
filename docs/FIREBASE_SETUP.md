# AgroSmart 360 — Firebase Configuration Guide

## Overview
AgroSmart 360 utilizes **Firebase Cloud Firestore** for persistent document storage and **Firebase Authentication** for farmer identity management.

## Project Credentials
The application is pre-configured with the provisioned AI Studio project:
- **Project ID:** `original-advantage-wggh3`
- **Firestore Database ID:** `ai-studio-1e66ff82-7eb8-42aa-95f5-b9ad2c132e8d`
- **Config File:** `firebase-applet-config.json`

## Collections Schema
1. `/users/{userId}`: User profiles with attributes `uid`, `email`, `fullName`, `role` (`FARMER`), and timestamps.
2. `/farms/{farmId}`: Registered farm plots with attributes `userId`, `name`, `location`, `totalAreaAcres`, `soilType`, `irrigationSource`.
3. `/soilTests/{testId}`: Laboratory test assays with `farmId`, `userId`, `testDate`, `phLevel`, `nitrogenLevel`, `phosphorusLevel`, `potassiumLevel`, and `fertilityRating`.

## Security Rules Deployment
The `firestore.rules` file enforces:
- Strict owner isolation: `userId == request.auth.uid`
- Default-deny catch-all rule
- Protection against self-assigned `ADMIN` roles
- Validated key checks and bounded field sizes to prevent Denial-of-Wallet attacks
