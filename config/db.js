import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const db_url = import.meta.env.VITE_APP_DATABASE_URL
const sql = neon(db_url);
export const db = drizzle(sql, {schema});
