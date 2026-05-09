# Security Spec: NEET Cracker AI

## Data Invariants
1. A user can only view and edit their own profile (`/users/{userId}`).
2. Questions are read-only for students, writeable only by admins.
3. Mock test configurations are read-only for students.
4. Test results must belong to the user who took them.
5. AI doubt queries/responses are private to the user.
6. Leaderboards are publicly readable but only system-writeable.

## The Dirty Dozen Payloads (Rejection Criteria)
1. Attempting to update `xp` or `level` directly in `User` profile without taking a test.
2. Attempting to delete a `Question` from the global bank.
3. Attempting to read another user's `Doubt` history.
4. Attempting to overwrite `score` in a `TestResult` after submission.
5. Attempting to set `correctIndex` in a `Question` via client.
6. Attempting to inject a large string (>1MB) into the `query` field of `Doubt`.
7. Attempting to read `/users` collection without a specific `uid`.
8. Attempting to create a `TestResult` with a fake `score` total (>720).
9. Attempting to change the `testId` of an existing `TestResult`.
10. Attempting to bypass `email_verified` check if required (mandating it for security).
11. Attempting to create a document with a non-alphanumeric ID.
12. Attempting to spoof `createdAt` using a client-side timestamp.

## Test Runner (Logic verification)
Tests will be implemented in `firestore.rules.test.ts`.
