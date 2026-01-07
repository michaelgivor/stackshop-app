import type { ProductSelect } from "@/drizzle/schema";
import {
  getAllDbProducts,
  getDbProductById,
  getRecommendedDbProducts,
} from "@/server/products/products.db";

/**
 * Retrieves all products from the database.
 * @returns Array of products, or empty array if none found or on error
 */
export async function getAllProducts(): Promise<Array<ProductSelect>> {
  try {
    const products = await getAllDbProducts();

    if (products.length === 0) return [];

    return products as Array<ProductSelect>;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

/**
 * Retrieves recommended products from the database.
 * @returns Array of recommended products, or empty array if none found or on error
 */
export async function getRecommendedProducts(): Promise<Array<ProductSelect>> {
  try {
    const products = await getRecommendedDbProducts();

    if (products.length === 0) {
      return [];
    }

    return products as Array<ProductSelect>;
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return [];
  }
}

/**
 * Retrieves a single product by ID.
 * @param id - The product UUID
 * @returns Product object if found, null if not found or on error
 */
export async function getProductById(id: string): Promise<ProductSelect | null> {
  try {
    const results = await getDbProductById(id);

    if (results.length === 0) return null;

    return results[0] as ProductSelect;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}
