# Security Specification for Fresh Legacy

## Data Invariants
1. An order must have at least one item.
2. The order total must be the sum of item prices * quantities.
3. Users can only read their own orders unless they are an admin.
4. Orders are immutable once created, except for 'status' updates by admins.
5. Users can only create their own profile.
6. The 'isAdmin' field in user profiles can only be modified by existing admins or through direct DB access (not via client SDK).

## The Dirty Dozen Payloads (Identity & Integrity Attack Surface)

1. **Identity Spoofing**: Attempt to create an order for a different `userId`.
2. **Status Escalation**: User tries to create an order with `status: 'delivered'`.
3. **Price Manipulation**: User tries to create an order with `total: 0` despite items being present.
4. **Admin Privilege Escalation**: User tries to set `isAdmin: true` on their own profile during creation.
5. **Orphaned User**: Attempt to create an order without a corresponding user profile.
6. **Junk ID Poisoning**: Attempt to create a user with a 2KB string as `userId`.
7. **Cross-Tenant Leak**: User A tries to `get` an order belonging to User B.
8. **Shadow Field Injection**: User tries to add `isPaid: true` to an order document.
9. **Terminal State Bypass**: User tries to update an order status from `delivered` back to `pending`.
10. **Resource Exhaustion**: User tries to add 1 million items to a single order array.
11. **PII Blanket Read**: Authenticated user tries to `list` all users to scrape emails.
12. **Self-Promotion**: Non-admin user tries to create an entry in the `admins/` collection.

## Test Runner (firestore.rules.test.ts)
(To be implemented if testing environment is set up, but follows the logic above)
