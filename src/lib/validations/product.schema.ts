import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productFormSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(120, "Nama maksimal 120 karakter"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(120, "Slug maksimal 120 karakter")
    .regex(slugRegex, "Slug harus lowercase kebab-case (contoh: produk-saya)"),
  sku: z.string().min(3, "SKU minimal 3 karakter").max(50, "SKU maksimal 50 karakter"),
  description: z.string().max(5000, "Deskripsi maksimal 5000 karakter").optional(),
  basePrice: z.coerce.number().min(0, "Harga dasar minimal 0"),
  discountPrice: z
    .union([z.literal(""), z.coerce.number().min(0, "Harga diskon minimal 0")])
    .optional(),
  weight: z.coerce.number().min(1, "Berat minimal 1 gram"),
  stock: z.coerce
    .number()
    .int("Stok harus bilangan bulat")
    .min(0, "Stok minimal 0"),
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
