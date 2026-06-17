import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export function slugifyCategoryName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formValuesToCategoryPayload(values: CategoryFormValues) {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: values.description?.trim() || null,
    parentId: values.parentId || null,
    imageUrl: values.imageUrl?.trim() || null,
    sortOrder: values.sortOrder,
    isActive: values.isActive,
  };
}
