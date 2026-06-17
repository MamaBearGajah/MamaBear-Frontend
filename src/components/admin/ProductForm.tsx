"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUploader, {
  type ImageUploaderValue,
} from "@/components/admin/ImageUploader";
import ProductGallery, {
  type ProductImage,
} from "@/components/admin/ProductGallery";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import StatusBadge from "@/components/shared/StatusBadge";
import { apiClient, authHeaders } from "@/lib/api/client";
import { deleteProductAndRedirectAction, revalidateAdminProductsAction } from "@/lib/actions/products";
import { stashProductListRefresh, buildProductsListReturnUrl } from "@/lib/admin/product-list-refresh";
import { cn, toSlug } from "@/lib/utils";
import {
  productFormDefaults,
  productFormSchema,
  formValuesToPayload,
  productToFormValues,
  type ProductFormInput,
  type ProductFormValues,
} from "@/lib/validations/product.schema";
import { getApiErrorMessage, handleApiError } from "@/lib/errorHandler";
import type { Category, Product, ProductStatus } from "@/types";

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft", label: "Draft" },
];

function toProductImagePayload(images: ProductImage[]) {
  return images.map((img) => ({
    imageUrl: img.imageUrl,
    altText: img.altText,
    imageType: img.imageType,
    isFeatured: img.isFeatured,
    sortOrder: img.sortOrder,
  }));
}

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
  categories: Category[];
  accessToken?: string;
}

const EMPTY_IMAGE_VALUE: ImageUploaderValue = {
  imageUrl: "",
  altText: "",
  imageType: "main",
  isFeatured: false,
  sortOrder: 0,
};

function normalizeGalleryImages(images: ProductImage[]) {
  const nextImages = images.map((img) => ({ ...img }));
  const mainIndex = nextImages.findIndex((img) => img.imageType === "main");

  if (mainIndex > 0) {
    const [mainImage] = nextImages.splice(mainIndex, 1);
    nextImages.unshift(mainImage);
  }

  return nextImages.map((img, index) => ({
    ...img,
    sortOrder: index + 1,
    isFeatured: index === 0,
  }));
}

export default function ProductForm({
  mode,
  product,
  categories,
  accessToken,
}: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>(() => {
    if (!product || !product.images) return [];
    return normalizeGalleryImages(
      [...product.images]
        .sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity))
        .map((img, index) => ({
          id: img.id,
          imageUrl: img.imageUrl ?? "",
          altText: img.altText ?? "",
          imageType: img.imageType ?? "other",
          isFeatured: (img.sortOrder ?? index + 1) === 1,
          sortOrder: img.sortOrder ?? index + 1,
        }))
    );
  });
  const slugManuallyEdited = useRef(false);

  const isEdit = mode === "edit" && !!product;

  const [imageValue, setImageValue] = useState<ImageUploaderValue | undefined>(
    () => {
      if (!product || !product.images || product.images.length === 0)
        return undefined;
      const first = product.images[0];
      return {
        imageUrl: first.imageUrl ?? "",
        altText: first.altText ?? product.name ?? "",
        imageType:
          (first.imageType as ImageUploaderValue["imageType"]) ?? "main",
        isFeatured: !!product.images.find((i) => i.isFeatured),
        sortOrder: first.sortOrder ?? 0,
      };
    }
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? productToFormValues(product as never)
      : productFormDefaults,
  });

  const nameValue = watch("name");
  const statusValue = watch("status");
  const categoryIdValue = watch("categoryId");

  const parseFieldErrors = (
    error: unknown
  ): Record<string, string> | undefined => {
    if (!isAxiosError(error)) return undefined;
    const details = error.response?.data?.error?.details;
    if (!Array.isArray(details) || !details.length) return undefined;
    return Object.fromEntries(
      details.map((detail: { field: string; message: string }) => [
        detail.field,
        detail.message,
      ])
    );
  };

  const getErrorMessage = (error: unknown): string => getApiErrorMessage(error);

  useEffect(() => {
    if (isEdit || slugManuallyEdited.current) return;
    if (nameValue) {
      setValue("slug", toSlug(nameValue), { shouldValidate: true });
    }
  }, [nameValue, isEdit, setValue]);

  const onSubmit = (data: ProductFormValues) => {
    if (imageUploading) {
      toast.error("Wait for the image upload to finish.");
      return;
    }

    const uploadableImages = galleryImages.filter((image) =>
      Boolean(image.imageUrl?.trim()),
    );

    if (galleryImages.some((image) => !image.imageUrl?.trim())) {
      toast.error("Upload pending images before saving.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          ...formValuesToPayload(data),
          images: toProductImagePayload(uploadableImages),
        };

        const headers = authHeaders(accessToken);

        if (isEdit) {
          await apiClient.patch(`/products/${product!.id}`, payload, {
            headers,
          });
          const savedPatch = {
            id: product!.id,
            name: data.name,
            slug: data.slug,
          };
          stashProductListRefresh(savedPatch);
          router.push(buildProductsListReturnUrl(savedPatch));
        } else {
          const { data: response } = await apiClient.post<{ data: Product }>(
            "/products",
            {
              ...payload,
              mainImage: uploadableImages.find(
                (image) => image.imageType === "main",
              )?.imageUrl,
            },
            { headers },
          );
          if (response.data?.id) {
            const savedPatch = {
              id: response.data.id,
              name: data.name,
              slug: data.slug,
            };
            stashProductListRefresh(savedPatch);
            router.push(buildProductsListReturnUrl(savedPatch));
          } else {
            router.push(`/admin/products?updated=${Date.now()}`);
          }
        }

        toast.success(
          isEdit ? "Product updated successfully" : "Product created successfully"
        );
        await revalidateAdminProductsAction();
      } catch (error) {
        const fieldErrors = parseFieldErrors(error);
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, message]) => {
            setError(field as keyof ProductFormInput, { message });
          });
        }
        toast.error(getErrorMessage(error) ?? "Failed to save product");
      }
    });
  };

  const handleDelete = () => {
    if (!product) return;
    startDeleteTransition(async () => {
      try {
        await deleteProductAndRedirectAction(product.id);
      } catch (error) {
        handleApiError(error);
      }
    });
  };

  const fieldClass = (field: keyof ProductFormInput) =>
    cn(errors[field] && "border-destructive");

  const handleImageSubmit = (val: ImageUploaderValue) => {
    // Include the File (if present) and a preview URL so ProductGallery can show it
    if (
      val.imageType === "main" &&
      galleryImages.some((img) => img.imageType === "main")
    ) {
      toast.error(
        "A main image already exists. Remove the existing main image before adding a new one."
      );
      return;
    }

    const previewUrl = val.file ? URL.createObjectURL(val.file) : undefined;
    const newImage: ProductImage = {
      imageUrl: val.imageUrl ?? "",
      file: (val as any).file ?? null,
      previewUrl: previewUrl ?? null,
      altText: val.altText,
      imageType: val.imageType,
      isFeatured: galleryImages.length === 0, // first image = featured
      sortOrder: galleryImages.length + 1,
      status: "pending",
    };
    setGalleryImages((prev) => normalizeGalleryImages([...prev, newImage]));
    setImageValue(EMPTY_IMAGE_VALUE);
    toast.success("Image added to gallery");
  };

  const handleImageDelete = (index: number) => {
    const nextImages = normalizeGalleryImages(
      galleryImages.filter((_, i) => i !== index)
    );
    setGalleryImages(nextImages);
    toast.success("Image removed");
  };

  const handleGalleryReorder = (images: ProductImage[]) => {
    setGalleryImages(normalizeGalleryImages(images));
  };

  // Flatten categories for select — exclude parent-less entries if needed
  const leafCategories = categories.filter((c) => c.id !== "cat-root");

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-8 max-w-6xl space-y-8"
      >
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <div className="space-y-8">
            {/* Status */}
            <section className="space-y-3 pt-2">
              <Label>Status</Label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setValue("status", opt.value, { shouldValidate: true })
                    }
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                      statusValue === opt.value
                        ? "text-foreground border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-light-pink)]"
                        : "border-border bg-background hover:bg-muted"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <StatusBadge status={statusValue} />
              {errors.status && (
                <p className="text-destructive text-sm">
                  {errors.status.message}
                </p>
              )}
            </section>

            {/* Name, Slug, SKU, Description */}
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Product name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="ASI Booster Tea – Hazelnut"
                  className={fieldClass("name")}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register("slug", {
                    onChange: () => {
                      slugManuallyEdited.current = true;
                    },
                  })}
                  placeholder="asi-booster-tea-hazelnut"
                  className={fieldClass("slug")}
                />
                {errors.slug && (
                  <p className="text-destructive text-sm">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="SKU-001"
                  className={fieldClass("sku")}
                />
                {errors.sku && (
                  <p className="text-destructive text-sm">
                    {errors.sku.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  {...register("description")}
                  placeholder="Product description…"
                  className={fieldClass("description")}
                />
                {errors.description && (
                  <p className="text-destructive text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </section>

            {/* Pricing, Weight, Stock, Category */}
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base price (IDR) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min={0}
                  {...register("basePrice")}
                  className={fieldClass("basePrice")}
                />
                {errors.basePrice && (
                  <p className="text-destructive text-sm">
                    {errors.basePrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPrice">
                  Discount price (IDR)
                  <span className="text-muted-foreground ml-1 text-xs">
                    — optional, shown to customers
                  </span>
                </Label>
                <Input
                  id="discountPrice"
                  type="number"
                  min={0}
                  placeholder="Leave empty if no discount"
                  {...register("discountPrice")}
                  className={fieldClass("discountPrice")}
                />
                {errors.discountPrice && (
                  <p className="text-destructive text-sm">
                    {errors.discountPrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (grams) *</Label>
                <Input
                  id="weight"
                  type="number"
                  min={1}
                  {...register("weight")}
                  className={fieldClass("weight")}
                />
                {errors.weight && (
                  <p className="text-destructive text-sm">
                    {errors.weight.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  {...register("stock")}
                  className={fieldClass("stock")}
                />
                {errors.stock && (
                  <p className="text-destructive text-sm">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  value={categoryIdValue || "none"}
                  onValueChange={(v) =>
                    setValue("categoryId", v === "none" ? "" : v, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="categoryId" className="w-full sm:max-w-xs">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {leafCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>
          </div>

          {/* Image sidebar */}
          <div className="space-y-6 xl:sticky xl:top-6">
            <ImageUploader
              value={imageValue}
              onChange={(v) => setImageValue(v)}
              onUploadingChange={setImageUploading}
              onSubmit={handleImageSubmit}
              mainImageExists={galleryImages.some(
                (img) => img.imageType === "main"
              )}
            />
          </div>
        </div>

        <ProductGallery
          images={galleryImages}
          className="mt-8"
          onDelete={(index) => handleImageDelete(index)}
          onReorder={handleGalleryReorder}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          {isEdit ? (
            <Button
              type="button"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={pending || imageUploading}
              className="bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
            >
              {pending
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Add Product"}
            </Button>
          </div>
        </div>
      </form>

      {isEdit && product && (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete product?"
          description={`Product "${product.name}" will be permanently deleted.`}
          confirmLabel="Delete"
          variant="destructive"
          loading={deletePending}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}