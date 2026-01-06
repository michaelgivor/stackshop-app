import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/products/"!
      <br />
      <Link
        className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
        to="/products/$id"
        params={{ id: "1" }}
      >
        Product 1
      </Link>
      <br />
      <Link
        className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
        to="/products/$id"
        params={{ id: "2" }}
      >
        Product 2
      </Link>
      <br />
      <Link
        className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
        to="/products/$id"
        params={{ id: "3" }}
      >
        Product 3
      </Link>
    </div>
  );
}
