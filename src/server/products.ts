import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/drizzle/db";
import { productsTable } from "@/drizzle/schema";

export const getAllProducts = createServerFn({ method: "GET" }).handler(async () => {
  const products = await db.select().from(productsTable);
  return products;
});

export const getRecommendedProducts = createServerFn({
  method: "GET",
}).handler(async () => {
  const products = await db.select().from(productsTable).limit(3);
  return products;
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator(z.uuid())
  .handler(async ({ data: id }) => {
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);
    return rows[0] ?? null;
  });
