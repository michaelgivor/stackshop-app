/* eslint-disable import/consistent-type-specifier-style */
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Header from "@/components/Header";
import appCss from "@/styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "StackShop",
      },
      {
        description: "StackShop is a platform for selling and buying products.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-6">
              <ErrorBoundary
                fallback={
                  <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-red-600">Something went wrong</h2>
                      <p className="mt-2 text-slate-600">Please try refreshing the page</p>
                    </div>
                  </div>
                }
              >
                <Suspense
                  fallback={
                    <div className="flex min-h-[400px] items-center justify-center">
                      <div className="text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-slate-600">Loading...</p>
                      </div>
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </ErrorBoundary>
            </main>
          </div>
          <TanStackDevtools
            config={{
              position: "bottom-left",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <ReactQueryDevtools />
          <Scripts />
        </body>
      </html>
    </QueryClientProvider>
  );
}
