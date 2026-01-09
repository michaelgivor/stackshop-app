/* eslint-disable import/order */
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { CartFooter } from "@/components/CartFooter";
import { CartRow } from "@/components/CartRow";
import { EmptyCartState } from "@/components/EmptyCartState";
import { Button } from "@/components/ui/button";
import {
  cartItemsQueryOptions,
  cartKeys,
  mutateCartServerFn,
} from "@/server/cart/cart.cache";
import type { CartItem, MutateCartFnInput } from "@/types/cart-types";

export const Route = createFileRoute("/cart")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    // Ensure data is in cache for SSR and fast client-side navigation
    await queryClient.ensureQueryData(cartItemsQueryOptions());
  },
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: cart } = useSuspenseQuery(cartItemsQueryOptions());

  // Single mutation for all cart operations - MUST be declared before any conditional returns
  const cartMutation = useMutation({
    mutationFn: (input: MutateCartFnInput) => mutateCartServerFn({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });

  // Memoize expensive calculations - MUST be before conditional return
  const { shipping, subtotal, total } = useMemo(() => {
    const shippingCost = cart.items.length > 0 ? 8 : 0;
    const subtotalAmount = cart.items.reduce(
      (acc: number, item) => acc + Number(item.price) * item.quantity,
      0,
    );
    const totalAmount = subtotalAmount + shippingCost;
    return { shipping: shippingCost, subtotal: subtotalAmount, total: totalAmount };
  }, [cart.items]);

  // Memoize handler functions to prevent unnecessary re-renders - MUST be before conditional return
  const handleClearCart = useCallback(() => {
    cartMutation.mutate({ action: "clear" });
  }, [cartMutation]);

  const handleDecrementQuantity = useCallback(
    (item: CartItem) => {
      cartMutation.mutate({
        action: "update",
        productId: item.id,
        quantity: Number(item.quantity) - 1,
      });
    },
    [cartMutation],
  );

  const handleIncrementQuantity = useCallback(
    (item: CartItem) => {
      cartMutation.mutate({
        action: "add",
        productId: item.id,
        quantity: 1,
      });
    },
    [cartMutation],
  );

  const handleRemoveItem = useCallback(
    (item: CartItem) => {
      cartMutation.mutate({
        action: "remove",
        productId: item.id,
        quantity: 0,
      });
    },
    [cartMutation],
  );

  // Early return AFTER ALL hooks are declared
  if (cart.items.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 rounded-2xl border bg-white/80 p-6 shadow-sm lg:grid-cols-[2fr,1fr] dark:border-slate-800 dark:bg-slate-900/80">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Cart</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Review your picks before checking out.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCart}
            disabled={cartMutation.isPending}
          >
            {cartMutation.isPending ? "Clearing..." : "Clear cart"}
          </Button>
        </div>

        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950/40">
          {cart.items.map(item => (
            <CartRow
              key={item.id}
              item={item}
              onDecrement={handleDecrementQuantity}
              onIncrement={handleIncrementQuantity}
              onRemove={handleRemoveItem}
              isLoading={cartMutation.isPending}
            />
          ))}
        </div>
      </div>

      <CartFooter subtotal={subtotal} shipping={shipping} total={total} />
    </div>
  );
}
