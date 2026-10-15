# Aura Engine — Backend

A Node.js/Express/MongoDB backend built to solve a real performance problem: loading and searching 50,000+ inventory records without freezing the browser or the server. Built as the Track B (Fullstack) deliverable for Sprint 18 — Client Delivery Phase I.

## What's actually inside

**`models/Product.js`**
Mongoose schema for a product — `productName`, `sku` (unique), `category`, `price`, `cost`, `stockQuantity`, `reorderLevel`, `lastUpdated`. Indexes are set on `sku` (via `unique: true`), `category`, and `productName` so lookups and filters on 50,000 documents don't fall back to a full collection scan.

**`seeder.js`**
A standalone script using `@faker-js/faker` to wipe the `products` collection and insert 50,000 realistic fake products in one batch `insertMany()` call, so the API can be tested against real volume instead of a handful of test rows.

**`controllers/inventoryController.js`**
- `getInventory` — handles `GET /api/inventory`. Supports `page`, `limit`, `search` (case-insensitive partial match on `productName`), `category` filter, and `sort` (e.g. `-price` for descending). Returns the page of products plus `totalRecords`, `totalPages`, `currentPage`, `hasNextPage`.
- `createProduct` — handles `POST /api/inventory`.
- `updateProduct` — handles `PUT /api/inventory/:id`.

**`controllers/analyticsController.js`**
- `getAnalytics` — handles `GET /api/analytics`. Uses a MongoDB aggregation pipeline (`$group` + `$project`) to compute, per category, the total valuation (`sum(price * stockQuantity)`) and product count — entirely inside MongoDB, without pulling all 50,000 records into Node.

**`middleware/validateProduct.js`**
Zod schema + `.refine()` enforcing the business rule `price >= cost`, plus `stockQuantity` can't be negative. Runs before `createProduct`/`updateProduct`; rejects bad input with `400` and a specific error message instead of letting it reach the database.

**`routes/inventoryRoutes.js`** and **`routes/analyticsRoutes.js`**
Wire the above controllers (and validation middleware, for POST/PUT) to their Express routes.

**`config/db.js`**
Connects to MongoDB using Mongoose and `MONGO_URI` from `.env`.

**`server.js`**
Entry point — loads `.env`, connects to the DB, mounts `/api/inventory` and `/api/analytics`.

## Tech stack
Node.js, Express, MongoDB, Mongoose, Zod, @faker-js/faker

## Setup

1. Clone the repo
   ```bash
   git clone https://github.com/sakshirawat1611/aura-engine.git
   cd aura-engine
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

4. Seed the database (inserts 50,000 sample products — takes a minute)
   ```bash
   node seeder.js
   ```

5. Run the server
   ```bash
   npm run dev
   ```

## API Reference

### `GET /api/inventory`
Query params: `page`, `limit`, `search`, `category`, `sort` (e.g. `?page=1&limit=50&search=chair&category=Furniture&sort=-price`)

Response:
```json
{
  "totalRecords": 50000,
  "totalPages": 1000,
  "currentPage": 1,
  "hasNextPage": true,
  "products": [ ... ]
}
```

### `GET /api/analytics`
No params. Returns an array of `{ category, totalValuation, totalProducts }`.

### `POST /api/inventory`
Body: `{ productName, sku, category, price, cost, stockQuantity, reorderLevel }`
Returns `201` on success, `400` if `price < cost` or `stockQuantity < 0`.

### `PUT /api/inventory/:id`
Same body shape and validation as POST. Returns `200` on success, `404` if the product doesn't exist.

## Note
Built under NDA for a client project; all public-facing code and documentation use the code name "Aura Engine" only.
