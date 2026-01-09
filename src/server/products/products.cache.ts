import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

// ===== SERVER FUNCTIONS (Client-Safe) =====
// These use dynamic imports to prevent server code from being bundled

const fetchAllProductsServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getAllProducts } = await import("./products.actions");
    return getAllProducts();
  },
);

const fetchRecommendedProductsServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const { getRecommendedProducts } = await import("./products.actions");
  return getRecommendedProducts();
});

const fetchProductByIdServerFn = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { getProductById } = await import("./products.actions");
    return getProductById(id);
  });

// ===== QUERY OPTIONS (React Query) =====
// These define how React Query should cache and fetch product data

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: ["products"] as const,
    queryFn: () => fetchAllProductsServerFn(),
  });

export const recommendedProductsQueryOptions = () =>
  queryOptions({
    queryKey: ["recommended-products"] as const,
    queryFn: () => fetchRecommendedProductsServerFn(),
  });

// Individual product details
export const productDetailQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: ["product", productId] as const,
    queryFn: () => fetchProductByIdServerFn({ data: productId }),
  });

// User cart
export const userCartQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user", userId, "cart"] as const,
    queryFn: () => {
      // TODO: Implement when needed
      throw new Error(`Cart query for user ${userId} not implemented yet`);
    },
    enabled: false, // Disabled until implemented
  });

// Future query options (add as needed)

// ===== QUERY KEY FACTORIES =====
// Centralized query key management for cache invalidation

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  recommended: () => ["recommended-products"] as const,
} as const;
