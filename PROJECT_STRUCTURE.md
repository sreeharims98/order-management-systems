# Project Structure

## Directory Layout

```
order-management-api/
├── src/                               # Source code
│   ├── config/
│   │   ├── env.ts                    # Environment configuration
│   │   ├── database.ts               # PostgreSQL/Neon connection
│   │   └── constants.ts              # Application constants
│   │
│   ├── routes/
│   │   ├── users.ts                  # User endpoints
│   │   ├── products.ts               # Product endpoints
│   │   └── orders.ts                 # Order endpoints
│   │
│   ├── controllers/
│   │   ├── userController.ts         # User request handling
│   │   ├── productController.ts      # Product request handling
│   │   └── orderController.ts        # Order request handling
│   │
│   ├── services/
│   │   ├── userService.ts            # User business logic
│   │   ├── productService.ts         # Product business logic
│   │   └── orderService.ts           # Order business logic (with transactions)
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts           # Global error handling
│   │   ├── validation.ts             # Request validation
│   │   └── authentication.ts         # JWT & auth middleware
│   │
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces & types
│   │
│   ├── utils/
│   │   ├── logger.ts                 # Winston logger
│   │   ├── validator.ts              # Validation helpers
│   │   └── helpers.ts                # Utility functions
│   │
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_products.sql
│   │   │   ├── 003_create_orders.sql
│   │   │   ├── 004_create_order_items.sql
│   │   │   └── 005_create_payments.sql
│   │   └── seeds/
│   │       └── seed.sql              # Development data
│   │
│   └── index.ts                      # Application entry point
│
├── tests/
│   ├── unit/
│   │   ├── services.test.ts
│   │   └── utils.test.ts
│   └── integration/
│       ├── api.test.ts
│       └── database.test.ts
│
├── scripts/
│   ├── migrate.ts                    # Run database migrations
│   ├── seed.ts                       # Seed database with test data
│   └── build.sh                      # Build script
│
├── dist/                             # Compiled JavaScript (generated)
├── node_modules/                     # Dependencies (generated)
│
├── .env.example                      # Environment variables template
├── .env                              # Environment variables (gitignored)
├── .gitignore                        # Git ignore rules
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc.json                  # Prettier configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies & scripts
├── jest.config.json                  # Jest testing configuration
└── README.md                         # Project documentation
```

## Architecture Overview

### Layered Architecture

1. **Routes Layer** (`routes/`)
   - Defines API endpoints
   - Maps HTTP requests to controllers

2. **Controllers Layer** (`controllers/`)
   - Handles HTTP request/response
   - Calls services for business logic

3. **Services Layer** (`services/`)
   - Contains business logic
   - Manages database transactions
   - Handles data validation

4. **Database Layer** (`database/`)
   - SQL migrations for schema
   - Query execution
   - Transaction management

5. **Middleware Layer** (`middleware/`)
   - Request validation
   - Error handling
   - Authentication

6. **Utilities** (`utils/`)
   - Logging
   - Validation helpers
   - Common functions

## Key Features

### Database

- **Neon Serverless PostgreSQL** - Managed, auto-scaling database
- Connection pooling with `@neondatabase/serverless` client
- HTTP API support for serverless functions
- Migrations in SQL
- Seed data for development

### API Endpoints

- **Users**: POST, GET
- **Products**: POST, GET, PATCH
- **Orders**: POST (with transactions), GET
- **Order Items**: Automatic creation with orders

### Transaction Support

- Order creation with stock reduction
- Automatic rollback on failure
- ACID compliance

### Testing

- Unit tests for services
- Integration tests for API
- Database operation tests

## Development Workflow

### Setup Environment

1. Create `.env` file with your Neon connection string:
```bash
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/order_management_db
NODE_ENV=development
PORT=3000
```

2. Install dependencies:
```bash
npm install
```

### Run Migrations

```bash
npm run migrate
```

### Seed Database

```bash
npm run seed
```

### Development Mode

```bash
npm run dev
```

### Run Tests

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

See `.env.example` for required configuration:

- `DATABASE_URL` - Neon PostgreSQL connection string (from Neon dashboard)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)

## Next Steps

1. Implement type definitions in `src/types/index.ts`
2. Set up database connection in `src/config/database.ts`
3. Implement services with SQL queries
4. Create controllers that use services
5. Define API routes
6. Add middleware
7. Write unit and integration tests
