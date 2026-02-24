// Database connection setup for Neon PostgreSQL
// TODO: Initialize PostgreSQL connection pool

import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { config } from './env';

let sql: NeonQueryFunction<false, false>;

try {
  sql = neon(config.database.url);
  console.log('✅ Database connection established');
} catch (error) {
  console.error('❌ Failed to initialize database connection:', error);
  throw error;
}

export { sql };
export default sql;
