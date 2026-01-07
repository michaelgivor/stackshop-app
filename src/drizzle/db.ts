import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Validate that DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const connectionString = process.env.DATABASE_URL;

// Create postgres client with connection pooling
// Postgres.js automatically handles SSL for Supabase connections
const client = postgres(connectionString, {
  // Connection pool configuration
  max: 10, // Optimal for most use cases (development and single-instance production)
  idle_timeout: 20, // Close idle connections after 20 seconds
  max_lifetime: 60 * 30, // Recycle connections after 30 minutes
  connect_timeout: 10, // Timeout if connection takes longer than 10 seconds
  // SSL is automatically enabled for .supabase.com domains
  ssl: connectionString.includes("supabase") ? "require" : false,
});

// Creates a drizzle instance using the Postgres.js client to handle the database connection
// between Drizzle and Supabase.
export const db = drizzle(client, { schema, logger: false });
