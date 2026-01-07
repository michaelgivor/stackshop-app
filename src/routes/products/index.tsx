import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { ProductCard } from "@/components/ProductCard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleProducts } from "@/data/seed";

const fetchProducts = createServerFn({ method: "GET" }).handler(() => {
  return sampleProducts;
});

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
  loader: async () => {
    return fetchProducts();
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
  const products = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
    initialData: products,
  });

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
          {data.map((product, index) => (
            <ProductCard key={`product-${index}`} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
