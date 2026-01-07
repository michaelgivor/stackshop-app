import type { BadgeValue, InventoryValue } from "../drizzle/schema";

type SampleProduct = {
  name: string;
  description: string;
  price: string;
  badge?: BadgeValue | null;
  rating: string;
  reviews: number;
  image: string;
  inventory: InventoryValue;
};

export const sampleProducts: Array<SampleProduct> = [
  {
    name: "TanStack Router Pro",
    description:
      "The most powerful routing solution for React. Built with TypeScript, featuring type-safe routes, code splitting, and server-side rendering.",
    price: "99.99",
    badge: "New",
    rating: "4.8",
    reviews: 127,
    image: "/tanstack-circle-logo.png",
    inventory: "in-stock",
  },
  {
    name: "TanStack Query Enterprise",
    description:
      "Powerful data synchronization for React. Fetch, cache, and update server state with zero configuration.",
    price: "149.99",
    badge: "New",
    rating: "4.9",
    reviews: 234,
    image: "/tanstack-circle-logo.png",
    inventory: "in-stock",
  },
  {
    name: "TanStack Table Premium",
    description:
      "Headless UI for building powerful tables and datagrids. Fully customizable and framework agnostic.",
    price: "79.99",
    badge: "New",
    rating: "4.7",
    reviews: 89,
    image: "/tanstack-circle-logo.png",
    inventory: "in-stock",
  },
  {
    name: "TanStack Start Framework",
    description:
      "Full-stack React framework with file-based routing, server-side rendering, and built-in optimizations.",
    price: "199.99",
    badge: "Featured",
    rating: "4.6",
    reviews: 156,
    image: "/tanstack-circle-logo.png",
    inventory: "in-stock",
  },
  {
    name: "TanStack Form Builder",
    description:
      "Headless form library with validation, async submission, and field-level control. Perfect for complex forms.",
    price: "59.99",
    badge: "Sale",
    rating: "4.5",
    reviews: 78,
    image: "/tanstack-circle-logo.png",
    inventory: "backorder",
  },
  {
    name: "TanStack Virtual Scroller",
    description:
      "High-performance virtual scrolling for large lists. Smooth scrolling with minimal memory footprint.",
    price: "49.99",
    badge: "Limited",
    rating: "4.4",
    reviews: 92,
    image: "/tanstack-circle-logo.png",
    inventory: "in-stock",
  },
  {
    name: "TanStack DevTools Suite",
    description:
      "Complete developer tools for debugging TanStack applications. Time-travel debugging and performance profiling.",
    price: "129.99",
    badge: "Featured",
    rating: "4.7",
    reviews: 145,
    image: "/tanstack-circle-logo.png",
    inventory: "in-stock",
  },
  {
    name: "TanStack Store Manager",
    description:
      "Lightweight state management with derived state, subscriptions, and persistence. Perfect for React apps.",
    price: "39.99",
    badge: "Sale",
    rating: "4.3",
    reviews: 67,
    image: "/tanstack-circle-logo.png",
    inventory: "preorder",
  },
];
