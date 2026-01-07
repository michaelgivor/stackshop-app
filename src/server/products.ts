import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { productsTable } from "@/drizzle/schema";

export async function getAllProducts() {
  const products = await db.select().from(productsTable);
  return products;
}

export async function getRecommendedProducts() {
  const products = await db.select().from(productsTable).limit(3);
  return products;
}

export async function getProduct(id: string) {
  const product = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);
  return product[0] ?? null;
}
