import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

// Environment detection
const isDevelopment = process.env.NODE_ENV === "development";

/*
 * DEVELOPMENT MODE: All staleTime = 0 (always fresh data)
 * - Immediate feedback when seeding/creating data
 * - No cache confusion during development
 * - Perfect for demos and testing
 *
 * PRODUCTION MODE: Tiered caching strategy
 * - Static content: 30 min cache (product descriptions)
 * - Semi-static: 15 min cache (product listings)
 * - Dynamic: 2 min cache (inventory, pricing)
 * - Real-time: 0 cache (cart, checkout)
 */

// Cache time configurations by data volatility
const CACHE_TIMES = {
  // Real-time critical data (cart, checkout, payments)
  REALTIME: {
    staleTime: 0, // Always fresh - critical for user experience
    gcTime: isDevelopment ? 5 * 60 * 1000 : 30 * 60 * 1000, // Dev: 5min, Prod: 30min
  },

  // Dynamic content (inventory, pricing, availability)
  DYNAMIC: {
    staleTime: isDevelopment ? 0 : 2 * 60 * 1000, // Dev: always fresh, Prod: 2 min
    gcTime: isDevelopment ? 5 * 60 * 1000 : 15 * 60 * 1000, // Dev: 5min, Prod: 15min
  },

  // Semi-static content (product listings, categories)
  SEMI_STATIC: {
    staleTime: isDevelopment ? 0 : 15 * 60 * 1000, // Dev: always fresh, Prod: 15 min
    gcTime: isDevelopment ? 5 * 60 * 1000 : 60 * 60 * 1000, // Dev: 5min, Prod: 1hr
  },

  // Static content (product descriptions, rarely changing data)
  STATIC: {
    staleTime: isDevelopment ? 0 : 30 * 60 * 1000, // Dev: always fresh, Prod: 30 min
    gcTime: isDevelopment ? 5 * 60 * 1000 : 2 * 60 * 60 * 1000, // Dev: 5min, Prod: 2hr
  },
} as const;

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

// ===== QUERY OPTIONS (React Query) =====
// These define how React Query should cache and fetch product data

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: ["products"] as const,
    queryFn: () => fetchAllProductsServerFn(),
    ...CACHE_TIMES.SEMI_STATIC,
    refetchOnWindowFocus: isDevelopment, // Refetch on focus in development
    refetchInterval: isDevelopment ? 2000 : false, // Auto-refetch every 2 seconds in dev
  });

export const recommendedProductsQueryOptions = () =>
  queryOptions({
    queryKey: ["recommended-products"] as const,
    queryFn: () => fetchRecommendedProductsServerFn(),
    ...CACHE_TIMES.SEMI_STATIC,
    refetchOnWindowFocus: isDevelopment, // Refetch on focus in development
    refetchInterval: isDevelopment ? 2000 : false, // Auto-refetch every 2 seconds in dev
  });

// Future production query options (ready for implementation)

// Individual product details - static content with longer cache
export const productDetailQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: ["product", productId, "details"] as const,
    queryFn: () => {
      // TODO: Implement when individual product server function is ready
      throw new Error(`Product detail query for ${productId} not implemented yet`);
    },
    ...CACHE_TIMES.STATIC,
    enabled: false, // Disabled until implemented
  });

// Product inventory - dynamic content with short cache
export const productInventoryQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: ["product", productId, "inventory"] as const,
    queryFn: () => {
      // TODO: Implement inventory checking
      throw new Error(`Inventory query for ${productId} not implemented yet`);
    },
    ...CACHE_TIMES.DYNAMIC,
    enabled: false, // Disabled until implemented
    refetchInterval: isDevelopment ? false : 60 * 1000, // Auto-refetch every minute in production
  });

// User cart - real-time critical data
export const userCartQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user", userId, "cart"] as const,
    queryFn: () => {
      // TODO: Implement cart functionality
      throw new Error(`Cart query for user ${userId} not implemented yet`);
    },
    ...CACHE_TIMES.REALTIME,
    enabled: false, // Disabled until implemented
    refetchOnWindowFocus: true, // Always refetch cart when user returns
  });

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
