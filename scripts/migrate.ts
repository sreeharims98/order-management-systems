import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

interface Migration {
  name: string;
  content: string;
}

async function getMigrations(): Promise<Migration[]> {
  const migrationsDir = path.join(__dirname, '../src/database/migrations');
  const files = fs.readdirSync(migrationsDir).filter((file) => file.endsWith('.sql'));

  const migrations: Migration[] = files.sort().map((file) => ({
    name: file,
    content: fs.readFileSync(path.join(migrationsDir, file), 'utf-8'),
  }));

  return migrations;
}

async function createMigrationsTable(): Promise<void> {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Migrations table created/verified');
  } catch (error) {
    console.error('❌ Failed to create migrations table:', error);
    throw error;
  }
}

async function getExecutedMigrations(): Promise<string[]> {
  try {
    const result = await sql`SELECT migration_name FROM schema_migrations ORDER BY executed_at`;
    return result.map((row: any) => row.migration_name);
  } catch (error) {
    console.error('❌ Failed to fetch executed migrations:', error);
    throw error;
  }
}

async function runMigration(name: string, content: string): Promise<void> {
  try {
    // Split by semicolon and filter empty statements
    const statements = content
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      await sql.query(statement);
    }

    // Record migration in tracking table
    await sql`
      INSERT INTO schema_migrations (migration_name)
      VALUES (${name})
      ON CONFLICT (migration_name) DO NOTHING
    `;

    console.log(`✅ Applied migration: ${name}`);
  } catch (error) {
    console.error(`❌ Failed to apply migration ${name}:`, error);
    throw error;
  }
}

async function runMigrations(): Promise<void> {
  try {
    console.log('\n🔄 Starting database migrations...\n');

    // Create migrations tracking table
    await createMigrationsTable();

    // Get list of migrations to run
    const migrations = await getMigrations();
    const executedMigrations = await getExecutedMigrations();

    if (migrations.length === 0) {
      console.log('⚠️  No migrations found');
      return;
    }

    console.log(`📋 Found ${migrations.length} migration(s)`);
    console.log(`✓ Already executed: ${executedMigrations.length}\n`);

    // Run pending migrations
    let executedCount = 0;
    for (const migration of migrations) {
      if (!executedMigrations.includes(migration.name)) {
        await runMigration(migration.name, migration.content);
        executedCount++;
      } else {
        console.log(`⏭️  Skipped (already executed): ${migration.name}`);
      }
    }

    console.log(`\n✨ Migration completed! (${executedCount} new migration(s) applied)`);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();
