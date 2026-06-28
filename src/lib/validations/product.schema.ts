import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120, "Name must be at most 120 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(120, "Slug must be at most 120 characters")
    .regex(slugRegex, "Slug must be lowercase kebab-case (e.g. my-product)"),
  sku: z.string().min(3, "SKU must be at least 3 characters").max(50, "SKU must be at most 50 characters"),
  description: z.string().max(5000, "Description must be at most 5000 characters").optional(),
  basePrice: z.coerce.number().min(0, "Base price must be at least 0"),
  discountPrice: z
    .union([z.literal(""), z.coerce.number().min(0, "Discount price must be at least 0")])
    .optional(),
  weight: z.coerce.number().min(1, "Weight must be at least 1 gram"),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock must be at least 0"),
  status: z.enum(["active", "inactive", "draft"]),
  categoryId: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductFormInput = z.input<typeof productFormSchema>;

export const productFormDefaults: ProductFormInput = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  basePrice: 0,
  discountPrice: "",
  weight: 1,
  stock: 0,
  status: "draft",
  categoryId: "",
};

export function formValuesToPayload(values: ProductFormValues) {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    sku: values.sku.trim(),
    description: values.description?.trim() || undefined,
    basePrice: values.basePrice,
    discountPrice:
      values.discountPrice === "" || values.discountPrice === undefined
        ? undefined
        : values.discountPrice,
    weight: values.weight,
    stock: values.stock,
    status: values.status,
    categoryId: values.categoryId?.trim() || undefined,
  };
}

export function productToFormValues(product: {
  name: string;
  slug: string;
  sku: string;
  description?: string;
  basePrice: number;
  discountPrice?: number;
  weight?: number;
  stock: number;
  status?: string;
  categoryId?: string;
}): ProductFormInput {
  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description ?? "",
    basePrice: product.basePrice,
    discountPrice: product.discountPrice ?? "",
    weight: product.weight ?? 1,
    stock: product.stock,
    status: (product.status as ProductFormInput["status"]) ?? "draft",
    categoryId: product.categoryId ?? "",
  };
}