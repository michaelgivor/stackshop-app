/* eslint-disable import/order */
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  BadgeValue,
  InventoryValue,
  ProductInsert,
  ProductSelect,
} from "@/drizzle/schema";
import { convertFormErrors } from "@/lib/helpers";

export const Route = createFileRoute("/products/create-product")({
  component: RouteComponent,
});

type CreateProductData = Pick<
  ProductInsert,
  "name" | "description" | "price" | "image" | "inventory" | "badge"
>;

const submitProductToServer = createServerFn({ method: "POST" })
  .inputValidator((data: CreateProductData) => data)
  .handler(async ({ data }): Promise<ProductSelect | null> => {
    const { createProduct } = await import("@/server/products/products.actions");
    const productData: ProductInsert = {
      ...data,
      badge: data.badge ?? null,
    };
    return createProduct(productData);
  });

function RouteComponent() {
  const navigate = useNavigate();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      badge: undefined as BadgeValue | undefined,
      image: "",
      inventory: "in-stock" as InventoryValue,
    },
    onSubmit: async ({ value }) => {
      // TODO: Implement form submission
      try {
        console.log("value", value);
        await submitProductToServer({ data: value });
        await router.invalidate({ sync: true });

        navigate({ to: "/products" });
      } catch (error) {
        console.error("Error creating product", error);
      }
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="space-y-6">
        <Card>
          <CardHeader className="gap-2">
            <CardTitle className="text-lg">Create Product</CardTitle>
            <CardDescription className="line-clamp-2">
              Fill in the details to add a new product to the catalog.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardContent>
            <form
              onSubmit={e => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value || value.length === 0 ? "Name is required" : undefined,
                }}
              >
                {field => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Product Name *</Label>
                    <Input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="Enter product name"
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError
                      errors={convertFormErrors(field.state.meta.errors)}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="description"
                validators={{
                  onChange: ({ value }) =>
                    !value || value.length === 0
                      ? "Description is required"
                      : undefined,
                }}
              >
                {field => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Description *</Label>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="Enter product description"
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError
                      errors={convertFormErrors(field.state.meta.errors)}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="price"
                validators={{
                  onChange: ({ value }) => {
                    if (!value || value.length === 0) return "Price is required";
                    if (isNaN(Number(value))) return "Price must be a number";
                    return undefined;
                  },
                }}
              >
                {field => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Price *</Label>
                    <Input
                      type="number"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      step="0.01"
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="0.0"
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError
                      errors={convertFormErrors(field.state.meta.errors)}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="image"
                validators={{
                  onChange: ({ value }) => {
                    if (!value || value.length === 0) return "Image URL is required";
                    try {
                      new URL(value);
                      if (value.length > 512)
                        return "Image URL must be 512 chars or less";
                      return undefined;
                    } catch {
                      return "Image must be a valid URL";
                    }
                  },
                }}
              >
                {field => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Image URL *</Label>
                    <Input
                      type="url"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <FieldError
                      errors={convertFormErrors(field.state.meta.errors)}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="badge">
                {field => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Badge (optional)</Label>
                    <Select
                      value={field.state.value ?? ""}
                      onValueChange={value =>
                        field.handleChange(
                          value === "" ? undefined : (value as BadgeValue),
                        )
                      }
                    >
                      <SelectTrigger id={field.name} className={"w-full"}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Sale">Sale</SelectItem>
                        <SelectItem value="Featured">Featured</SelectItem>
                        <SelectItem value="Limited">Limited</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={convertFormErrors(field.state.meta.errors)}
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="inventory">
                {field => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Inventory Status</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={value =>
                        field.handleChange(value as InventoryValue)
                      }
                    >
                      <SelectTrigger id={field.name} className={"w-full"}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="backorder">Backorder</SelectItem>
                        <SelectItem value="preorder">Preorder</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={convertFormErrors(field.state.meta.errors)}
                    />
                  </div>
                )}
              </form.Field>
              <form.Subscribe
                selector={state => [state.isDirty, state.isSubmitting]}
              >
                {([isDirty, isSubmitting]) => (
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={!isDirty || isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Creating..." : "Create Product"}
                    </Button>
                    <Button
                      type="button"
                      variant={"outline"}
                      onClick={() => navigate({ to: "/products" })}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form.Subscribe>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
