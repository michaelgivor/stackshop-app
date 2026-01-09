// Import the generated route tree
import { QueryClient } from "@tanstack/react-query";
import { Link, createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const isDevelopment = process.env.NODE_ENV === "development";

  const router = createRouter({
    routeTree,
    context: {
      queryClient: new QueryClient({
        defaultOptions: {
          queries: {
            // Environment-aware defaults
            staleTime: isDevelopment ? 0 : 5 * 60 * 1000, // Dev: always fresh, Prod: 5 min
            gcTime: isDevelopment ? 5 * 60 * 1000 : 30 * 60 * 1000, // Dev: 5min, Prod: 30min
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnReconnect: true, // Refetch when internet reconnects
            retry: (failureCount, error: any) => {
              // Don't retry 4xx client errors
              if (error?.status >= 400 && error?.status < 500) return false;
              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
          },
        },
      }),
    },

    scrollRestoration: true,
    defaultPreload: "intent", // preload all the links
    defaultPreloadStaleTime: 30 * 1000, // 30 seconds for route loaders

    defaultNotFoundComponent: () => {
      return (
        <div>
          <p>Not found!</p>
          <Link to="/">Go home</Link>
        </div>
      );
    },
  });

  return router;
};
