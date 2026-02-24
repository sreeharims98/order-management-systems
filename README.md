# 🎯 Starter Backend Project: Order Management System

A perfect introduction to relational database modeling — a simplified Amazon backend.

- **No frontend required**
- **Pure API + PostgreSQL**
- Built with Node.js, Express, and SQL

## 📦 Project Overview: Order Management API

### Core Entities

- Users
- Products
- Orders
- Order Items
- Payments

This forces you to model 1–N and N–N relationships properly.

---

## 🗄️ Database Design

### 1️⃣ Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2️⃣ Products Table

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3️⃣ Orders Table

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4️⃣ Order Items Table (Join Table)

```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);
```

### Key Concepts

- Foreign keys
- Join tables
- Data integrity

---

## 🎯 What You Will Learn

### 1️⃣ Relationships

- One user → many orders
- One order → many order items
- One product → many order items

### 2️⃣ Joins

Practice joining multiple tables:

```sql
SELECT o.id, u.name, o.total_amount
FROM orders o
JOIN users u ON o.user_id = u.id;
```

### 3️⃣ Aggregations

Group and aggregate data:

```sql
SELECT user_id, SUM(total_amount)
FROM orders
GROUP BY user_id;
```

### 4️⃣ Transactions (Very Important)

When creating an order, use transactions to ensure data consistency:

**Flow:**

1. Create order
2. Insert order_items
3. Reduce product stock
4. Commit

If stock update fails → rollback everything.

```sql
BEGIN;
  -- insert order
  -- insert order items
  -- update product stock
COMMIT;
```

This is real backend engineering.

### 5️⃣ Indexing

Optimize query performance with indexes:

```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_products_name ON products(name);
```

Then analyze the execution plan:

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 1;
```

Now you learn performance tuning.

---

## 🚀 API Endpoints To Implement

Using **Express + pg library**:

### Users

- `POST /users` — Create a new user
- `GET /users/:id` — Get user details

### Products

- `POST /products` — Create a new product
- `GET /products` — List all products
- `PATCH /products/:id` — Update product

### Orders

- `POST /orders` — Create a new order _(use transaction)_
- `GET /orders/:id` — Get order details
- `GET /users/:id/orders` — Get all orders for a user

**⚠️ Important:** Inside `POST /orders`, use a transaction to ensure consistency.

---

## 📚 What To Focus On While Studying

> Do NOT rush API building.

Spend time understanding SQL fundamentals:

- **Data Types:** SERIAL vs UUID, Numeric vs float
- **Constraints:** NOT NULL, UNIQUE, ON DELETE CASCADE
- **Transactions:** Isolation levels, ACID properties
- **Performance:** Index types (B-tree), Query optimization

---

## 🧠 Advanced Features (After Basic Version)

Once you've completed the basic version, add:

- Pagination
- Filtering
- Search by product name
- Order status transitions
- Payment simulation table
- Refund logic with transaction rollback

---

## 🛠️ Tech Stack

Since you know JavaScript:

- **Runtime:** Node.js
- **Framework:** Express or Fastify
- **Database Client:** pg (not ORM initially)
- **Database:** Docker Postgres container

### Important: Avoid ORMs Initially

You must learn SQL directly. After this project, you'll understand PostgreSQL far better than most frontend developers who only use ORMs.

---

## 🏆 Why This Is the Right Starter Project

✅ **Realistic** — Models real-world e-commerce systems  
✅ **Forces relational modeling** — Learn 1:N and N:N relationships  
✅ **Teaches transactions** — Understand ACID properties  
✅ **Teaches joins** — Practice multi-table queries  
✅ **Teaches constraints** — Data integrity fundamentals  
✅ **Teaches performance basics** — Indexing and query optimization  
✅ **Builds backend thinking** — Think like a database engineer

---

**After finishing this project, you'll understand PostgreSQL far better than most frontend developers who "use it via ORM."**
