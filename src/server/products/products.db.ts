/* eslint-disable import/order */
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import type { ProductInsert } from "@/drizzle/schema";
import { productsTable } from "@/drizzle/schema";

export async function getAllDbProducts() {
  const productsData = await db.select().from(productsTable);
  return productsData;
}

export async function getRecommendedDbProducts() {
  const productsData = await db.select().from(productsTable).limit(3);
  return productsData;
}

export async function getDbProductById(id: string) {
  const results = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);
  return results;
}

export async function createDbProduct(data: ProductInsert) {
  const result = await db.insert(productsTable).values(data).returning();

  return result[0];
}
