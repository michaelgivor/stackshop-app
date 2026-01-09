import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { ProductCard } from "@/components/ProductCard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { productsQueryOptions } from "@/server/products/products.cache";

const loggerMiddleware = createMiddleware().server(async ({ next, request }) => {
  console.log(
    "---loggerMiddleware---",
    request.url,
    "from",
    request.headers.get("origin"),
  );
  return next();
});

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    // Ensure data is in cache for SSR and fast client-side navigation
    await queryClient.ensureQueryData(productsQueryOptions());
  },
  server: {
    middleware: [loggerMiddleware],
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        return Response.json({ message: "Hello World from POST request!", body });
      },
    },
  },
});

function RouteComponent() {
  // Get data from React Query cache with Suspense
  const { data } = useSuspenseQuery(productsQueryOptions());

  // Sort products by createdAt (oldest first) - only for this page
  const sortedProducts = [...data].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="space-y-6">
      <section className="mx-auto max-w-6xl space-y-4">
        <Card className="bg-white/80 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardHeader className="px-0">
                <p className="text-sm tracking-wide text-slate-500 uppercase">
                  StartShop Catalog
                </p>
                <CardTitle className="text-2xl font-semibold">
                  Products built for makers
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-sm text-slate-600">
                Browse a minimal, production-flavoured catalog with TanStack Start
                server functions and typed routes.
              </CardDescription>
            </div>
          </div>
        </Card>
      </section>
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product, index) => (
            <ProductCard key={`product-${index}`} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
