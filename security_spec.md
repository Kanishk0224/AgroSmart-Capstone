# AgroSmart 360 Security Specification

## 1. Data Invariants
- Users can only read and manage their own user profiles (`/users/{userId}` where `userId == request.auth.uid`).
- Self-assignment of the `ADMIN` role is strictly forbidden on registration and updates.
- Farms (`/farms/{farmId}`) can only be created by authenticated farmers with `userId == request.auth.uid`.
- Farms can only be read, updated, or deleted by their verified owner (`userId == request.auth.uid`).
- Soil Tests (`/soilTests/{testId}`) must reference a valid `farmId` and must be owned by `userId == request.auth.uid`.
- All text fields are strictly bounded by size limits (`name.size() <= 120`, `location.size() <= 200`, etc.) to prevent Denial of Wallet.
- No blanket reads: `allow list` evaluates `resource.data.userId == request.auth.uid`.

## 2. The Dirty Dozen Payloads (Targeting Rejection)
1. User profile creation with spoofed admin role: `{ "role": "ADMIN" }` -> DENIED.
2. User profile creation with another user's UID: `userId != request.auth.uid` -> DENIED.
3. Farm creation with missing required fields (`name` omitted) -> DENIED.
4. Farm creation with malicious payload size (`name` > 120 chars) -> DENIED.
5. Farm creation with spoofed `userId` -> DENIED.
6. Farm update attempting to modify immutable `userId` -> DENIED.
7. Farm update by an unauthenticated user -> DENIED.
8. Farm deletion by another farmer -> DENIED.
9. Soil test creation without `farmId` -> DENIED.
10. Soil test update with pH outside valid numeric bounds -> DENIED.
11. Querying all farms across all users without ownership filter -> DENIED.
12. Injecting arbitrary ghost fields into farm documents -> DENIED.
