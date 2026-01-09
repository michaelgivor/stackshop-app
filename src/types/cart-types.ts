import type { ProductSelect } from "@/drizzle/schema";

export type MutateCartFnInput =
  | {
      action: "add" | "remove" | "update";
      productId: string;
      quantity: number;
    }
  | {
      action: "clear";
      productId?: never;
      quantity?: never;
    };

export type CartItem = ProductSelect & { quantity: number };
