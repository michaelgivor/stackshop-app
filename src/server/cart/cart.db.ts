import { desc, eq, gt } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { cartItemsTable, productsTable } from "@/drizzle/schema";

export const getDbCartItems = async () => {
  const cart = await db
    .select()
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .orderBy(desc(cartItemsTable.createdAt));

  return cart;
};

export async function getDbCartItem(productId: string) {
  const existingItem = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.productId, productId))
    .limit(1);
  return existingItem;
}

export async function createDbCartItem(productId: string, quantity: number) {
  await db.insert(cartItemsTable).values({ productId, quantity });
}

export async function updateDbCartItemQuantity(productId: string, quantity: number) {
  await db
    .update(cartItemsTable)
    .set({ quantity })
    .where(eq(cartItemsTable.productId, productId));
}

export async function removeFromDbCart(productId: string) {
  await db.delete(cartItemsTable).where(eq(cartItemsTable.productId, productId));
}

export async function clearDbCart() {
  await db.delete(cartItemsTable).where(gt(cartItemsTable.quantity, 0));
}
