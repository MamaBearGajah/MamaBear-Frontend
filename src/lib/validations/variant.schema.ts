import { z } from "zod";

export const variantFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
  basePrice: z.coerce.number().min(0, "Base price must be at least 0"),
  discountPrice: z
    .union([z.literal(""), z.coerce.number().min(0, "Discount price must be at least 0")])
    .optional(),
  priceAdjustment: z.coerce.number().default(0),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock must be at least 0"),
  imageUrl: z
    .union([z.literal(""), z.string().url("Image URL is invalid")])
    .optional(),
  sku: z
    .string()
    // .min(3, "SKU minimal 3 karakter")
    // .max(50, "SKU maksimal 50 karakter")
    .optional(),
  isActive: z.boolean().default(true),
});

export type VariantFormValues = z.infer<typeof variantFormSchema>;
export type VariantFormInput = z.input<typeof variantFormSchema>;

export const variantFormDefaults: VariantFormInput = {
  name: "",
  value: "",
  basePrice: 0,
  discountPrice: "",
  priceAdjustment: 0,
  stock: 0,
  imageUrl: "",
  sku: "",
  isActive: true,
};

export function formValuesToPayload(values: VariantFormValues) {
  return {
    name: values.name.trim(),
    value: values.value.trim(),
    basePrice: values.basePrice,
    discountPrice:
      values.discountPrice === "" || values.discountPrice === undefined
        ? undefined
        : values.discountPrice,
    priceAdjustment: values.priceAdjustment,
    stock: values.stock,
    imageUrl: values.imageUrl?.trim() || undefined,
    sku: values.sku?.trim() === "" ? null : values.sku?.trim(),
    isActive: values.isActive,
  };
}

export function variantToFormValues(variant: {
  name: string;
  value: string;
  basePrice: number;
  discountPrice?: number | null;
  priceAdjustment?: number | null;
  stock: number;
  imageUrl?: string | null;
  sku: string;
  isActive?: boolean | null;
}): VariantFormInput {
  return {
    name: variant.name,
    value: variant.value,
    basePrice: variant.basePrice,
    discountPrice: variant.discountPrice ?? "",
    priceAdjustment: variant.priceAdjustment ?? 0,
    stock: variant.stock,
    imageUrl: variant.imageUrl ?? "",
    sku: variant.sku,
    isActive: variant.isActive ?? true,
  };
}
