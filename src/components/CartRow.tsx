/* eslint-disable import/order */
import { Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/types/cart-types";

interface CartRowProps {
  item: CartItem;
  onDecrement: (item: CartItem) => void;
  onIncrement: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  isLoading: boolean;
}

export const CartRow = memo(function CartRow({
  item,
  onDecrement,
  onIncrement,
  onRemove,
  isLoading,
}: CartRowProps) {
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-[auto,1fr,auto]">
      <div className="hidden h-20 w-20 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 sm:flex dark:border-slate-800 dark:bg-slate-900">
        <img
          src={item.image}
          alt={item.name}
          className="h-12 w-12 object-contain"
          loading="lazy"
        />
      </div>
      <div className="space-y-1">
        <Link
          to="/products/$id"
          params={{ id: item.id }}
          className="text-base font-semibold hover:text-blue-600 dark:hover:text-blue-400"
        >
          {item.name}
        </Link>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span>${Number(item.price).toFixed(2)}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600 dark:text-slate-300">
            {item.inventory === "in-stock"
              ? "In stock"
              : item.inventory === "backorder"
                ? "Backorder"
                : "Preorder"}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 sm:items-center sm:justify-between sm:gap-2 sm:text-right">
        <div className="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant="outline"
            aria-label={`Decrease ${item.name}`}
            onClick={() => onDecrement(item)}
            disabled={isLoading}
          >
            <Minus size={14} />
          </Button>
          <input
            type="number"
            min={1}
            max={99}
            value={item.quantity}
            readOnly
            className="h-9 w-14 rounded-md border border-slate-200 bg-white text-center text-sm font-semibold shadow-xs dark:border-slate-800 dark:bg-slate-900"
          />
          <Button
            size="icon-sm"
            variant="outline"
            aria-label={`Increase ${item.name}`}
            onClick={() => onIncrement(item)}
            disabled={isLoading}
          >
            <Plus size={14} />
          </Button>
        </div>
        <div className="text-sm font-semibold">
          ${(Number(item.price) * item.quantity).toFixed(2)}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-slate-500 hover:text-red-500"
          onClick={() => onRemove(item)}
          disabled={isLoading}
        >
          Remove
        </Button>
      </div>
    </div>
  );
});
