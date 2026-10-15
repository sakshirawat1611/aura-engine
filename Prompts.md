# Prompts.md — AI Usage Documentation

As required by the delivery protocol, this documents how I used AI (Claude) while building the Aura Engine backend. I did not copy-paste finished solutions — I used it as a mentor: it explained concepts first, and I wrote every line of code myself.

## 1. Understanding indexing before using it
Before touching the schema, I asked how MongoDB finds a document without an index versus with one. I learned that without an index, MongoDB does a full collection scan (checks every document); an index is a separate sorted structure (B-tree) that lets MongoDB jump straight to a match, which is why `sku`, `category`, and `productName` needed indexes for a 50,000-record collection to stay fast.

## 2. Fixing a MongoDB connection error (SRV DNS issue)
My `mongodb+srv://` connection string failed with `querySrv ECONNREFUSED`. I used AI to diagnose it: `nslookup` with Cloudflare's DNS (1.1.1.1) resolved the SRV record fine, but Node's default DNS (via my ISP/router) could not. The fix was switching to the non-SRV `mongodb://` connection string, which has the three shard hostnames hardcoded and skips the SRV lookup entirely. I understood the DNS-level cause before applying the fix.

## 3. Pagination logic (skip/limit)
I asked how `skip` and `limit` relate to page number before writing `GET /api/inventory`. I worked out the formula myself: `skip = (page - 1) * limit`, then applied it in the controller.

## 4. Building the aggregation pipeline for analytics
For `GET /api/analytics`, I asked why summing 50,000 records in JavaScript (after fetching them all) is worse than letting MongoDB do it. The answer: fetching all records first means pulling the entire dataset over the network before any calculation starts — slow and memory-heavy — whereas an aggregation pipeline computes the sum inside MongoDB and only returns the small final result. I then built the `$group` (sum `price * stockQuantity` per category) and `$project` (reshape output) stages myself, with guidance on syntax only.

## 5. Validation rule design (Zod)
I learned why Mongoose's `min: 0` isn't enough to enforce `price >= cost` — it only checks one field against a fixed number, not two fields against each other. I used Zod's `.refine()` to add that custom cross-field rule, returning a `400` with a specific message before the request ever reaches the database.

## 6. Debugging a crash from an empty route file
When the server crashed with `argument handler must be a function`, I used AI to trace the error back to `server.js` line 12, which pointed to `routes/analyticsRoutes.js` being empty (I had created the file but never pasted the router code into it). This taught me to check that every file both exists and actually exports what's expected.

## Summary
AI was used for: explaining concepts (indexing, aggregation, validation design), debugging runtime errors by reading stack traces, and reviewing code I wrote for correctness. All implementation — schema fields, controller logic, route wiring, validation rules — was written by me.
