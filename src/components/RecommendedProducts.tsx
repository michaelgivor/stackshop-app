/* eslint-disable import/order */
import { use } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { ProductSelect } from "@/drizzle/schema";

export function RecommendedProducts({
  recommendedProducts,
}: {
  recommendedProducts: Promise<Array<ProductSelect>>;
}) {
  const recommendedProductsData = use(recommendedProducts);
  return (
    <div>
      <h2 className="my-4 text-2xl font-bold">Recommended Products</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendedProductsData.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
