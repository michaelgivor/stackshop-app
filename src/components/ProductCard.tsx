/* eslint-disable import/order */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useCallback } from "react";
import { ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProductSelect } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { cartKeys, mutateCartServerFn } from "@/server/cart/cart.cache";

const inventoryTone = {
  "in-stock": "bg-emerald-50 text-emerald-600 border-emerald-100",
  backorder: "bg-amber-50 text-amber-700 border-amber-100",
  preorder: "bg-indigo-50 text-indigo-700 border-indigo-100",
};

export function ProductCard({ product }: { product: ProductSelect }) {
  const queryClient = useQueryClient();
  
  // Memoize callback functions to prevent recreation on every render
  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: cartKeys.all });
  }, [queryClient]);
  
  const onError = useCallback((error: Error) => {
    console.error("Failed to add to cart:", error);
  }, []);
  
  // Mutation for adding items to cart
  const addToCartMutation = useMutation({
    mutationFn: (productData: { productId: string; quantity: number }) => 
      mutateCartServerFn({
        data: {
          action: "add",
          productId: productData.productId,
          quantity: productData.quantity,
        },
      }),
    onSuccess,
    onError,
  });

  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="h-full cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
    >
      <Card className="flex h-full flex-col px-2 py-4">
        <CardHeader className="gap-2">
          <div className="flex items-center gap-2">
            {product.badge && (
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                {product.badge}
              </span>
            )}
          </div>
          <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex grow flex-col justify-end">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-semibold">{product.rating}</span>
              <span className="text-slate-400">({product.reviews} reviews)</span>
            </p>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold",
                inventoryTone[product.inventory],
              )}
            >
              {product.inventory}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t-0 bg-transparent pt-0">
          <span className="text-lg font-semibold">${product.price}</span>
          <Button
            size="sm"
            variant={"secondary"}
            className={"bg-slate-900 text-white hover:bg-slate-800"}
            disabled={addToCartMutation.isPending}
            onClick={e => {
              e.preventDefault();
              addToCartMutation.mutate({
                productId: product.id,
                quantity: 1,
              });
            }}
          >
            <ShoppingBagIcon size={16} />
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
