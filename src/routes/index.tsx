import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecommendedProducts } from "@/server/products";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    // This runs on server during SSR AND on client during navigation

    const products = await getRecommendedProducts();

    return { products };
  },
});

function App() {
  const { products } = Route.useLoaderData();

  return (
    <div className="space-y-12 bg-linear-to-b from-slate-50 via-white to-slate-50 p-6">
      <section>
        <Card className="bg-white/80 p-8 shadow-md">
          <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
            Your favourite e-commerce store
          </p>
          <CardTitle className="max-w-2xl text-4xl leading-tight font-bold text-slate-900 dark:text-white">
            <h1>StartShop - Your one-stop shop for all your needs</h1>
          </CardTitle>
          <CardDescription>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Browse products
              <ArrowRightIcon size={16} />
            </Link>
          </CardDescription>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl space-y-4">
        <Card className="bg-white/80 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <CardHeader className="px-0">
                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  Recommended
                </p>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  Starter picks from the catalog
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-sm text-slate-600">
                Curated items to try the cart and detail pages quickly.
              </CardDescription>
            </div>
            <div>
              <Link
                to="/products"
                className="hidden items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-xl sm:inline-flex"
              >
                View All <ArrowRightIcon size={14} />
              </Link>
            </div>
          </div>
          <div className="mb-6 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard product={product} key={`product-${index}`} />
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
