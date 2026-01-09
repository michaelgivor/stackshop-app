import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import type { MutateCartFnInput } from "@/types/cart-types";

// ===== SERVER FUNCTIONS (Client-Safe) =====

const fetchCartItemsServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getCartItems } = await import("./cart.actions");
    return getCartItems();
  },
);

export const mutateCartServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: MutateCartFnInput) => data)
  .handler(async ({ data }: { data: MutateCartFnInput }) => {
    const { addToCart, updateCartItem, removeFromCart, clearCart } =
      await import("./cart.actions");
    switch (data.action) {
      case "add":
        return await addToCart(data.productId, data.quantity);
      case "remove":
        return await removeFromCart(data.productId);
      case "update":
        return await updateCartItem(data.productId, data.quantity);
      case "clear":
        return await clearCart();
    }
  });

// ===== QUERY OPTIONS (React Query) =====
// These define how React Query should cache and fetch cart data

export const cartItemsQueryOptions = () =>
  queryOptions({
    queryKey: cartKeys.items(),
    queryFn: () => fetchCartItemsServerFn(),
  });

// ===== QUERY KEY FACTORIES =====
// Centralized query key management for cache invalidation

export const cartKeys = {
  all: ["cart"] as const,
  items: () => [...cartKeys.all, "items"] as const,
} as const;
