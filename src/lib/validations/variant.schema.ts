import { z } from "zod";

export const variantFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  value: z.string().min(1, "Nilai wajib diisi"),
  basePrice: z.coerce.number().min(0, "Harga dasar minimal 0"),
  discountPrice: z
    .union([z.literal(""), z.coerce.number().min(0, "Harga diskon minimal 0")])
    .optional(),
  priceAdjustment: z.coerce.number().default(0),
  stock: z.coerce
    .number()
    .int("Stok harus bilangan bulat")
    .min(0, "Stok minimal 0"),
  weight: z
    .union([z.literal(""), z.coerce.number().int().min(0, "Berat minimal 0")])
    .optional(), // in grams, override product weight if different
  sortOrder: z.coerce.number().int().min(0).default(0),
  imageUrl: z
    .union([z.literal(""), z.string().url("URL gambar tidak valid")])
    .optional(),
  sku: z.string().optional(),
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
  weight: "",
  sortOrder: 0,
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
    weight:
      values.weight === "" || values.weight === undefined
        ? undefined
        : values.weight,
    sortOrder: values.sortOrder,
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
  weight?: number | null;
  sortOrder?: number | null;
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
    weight: variant.weight ?? "",
    sortOrder: variant.sortOrder ?? 0,
    imageUrl: variant.imageUrl ?? "",
    sku: variant.sku,
    isActive: variant.isActive ?? true,
  };
}