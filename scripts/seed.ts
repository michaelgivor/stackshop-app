// Load environment variables FIRST
import dotenv from "dotenv";
import { sampleProducts } from "../src/data/sample-products";

// Prevent Nitro/Vite from initializing when running as a standalone script
process.env.NITRO_PRESET = "node-server";
process.env.NODE_ENV = process.env.NODE_ENV || "production";

dotenv.config();

async function seed() {
  try {
    // Dynamically import database modules after environment variables are loaded
    const { db } = await import("../src/drizzle/db");
    const { productsTable, cartItemsTable } = await import("../src/drizzle/schema");

    console.log("🌱 Starting database seed...");

    // Check if --reset flag is passed
    const shouldReset =
      process.argv.includes("--reset") || process.argv.includes("-r");

    if (shouldReset) {
      console.log("🗑️  Clearing existing data...");
      // Clear cart items first (due to foreign key constraint)
      await db.delete(cartItemsTable);
      console.log("   Cleared all cart items");
      // Then clear products
      await db.delete(productsTable);
      console.log("   Cleared all products");
    }

    // Insert sample products
    console.log(`📦 Inserting ${sampleProducts.length} products...`);
    await db.insert(productsTable).values(sampleProducts);

    console.log("✅ Database seeded successfully!");
    console.log(`   Inserted ${sampleProducts.length} products`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Only run seed() if this file is executed directly (not imported)
// This script should only run when executed via npm run db:seed
// It should NOT run when imported by other modules (like Vite during dev)
const isRunningAsScript =
  process.argv[1]?.includes("seed.ts") || process.argv[1]?.includes("tsx");

if (isRunningAsScript) {
  seed();
}
