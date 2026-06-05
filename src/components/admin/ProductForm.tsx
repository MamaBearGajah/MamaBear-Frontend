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
import { deleteProductAndRedirectAction } from "@/lib/actions/products";
import { cn, toSlug } from "@/lib/utils";
import {
  productFormDefaults,
  productFormSchema,
  formValuesToPayload,
  productToFormValues,
  type ProductFormInput,
  type ProductFormValues,
} from "@/lib/validations/product.schema";
import { handleApiError } from "@/lib/errorHandler";
import type { Category, Product, ProductStatus } from "@/types";

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft", label: "Draft" },
];

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

  const getErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
      return error.response?.data?.error?.message ?? error.message;
    }
    if (error instanceof Error) return error.message;
    return "Terjadi kesalahan";
  };

  useEffect(() => {
    if (isEdit || slugManuallyEdited.current) return;
    if (nameValue) {
      setValue("slug", toSlug(nameValue), { shouldValidate: true });
    }
  }, [nameValue, isEdit, setValue]);

  const onSubmit = (data: ProductFormValues) => {
    if (imageUploading) {
      toast.error("Tunggu upload image selesai dulu.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          ...formValuesToPayload(data),
          mainImage: imageValue?.imageUrl?.trim() || undefined,
          images: galleryImages.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            altText: img.altText,
            imageType: img.imageType,
            isFeatured: img.isFeatured,
            sortOrder: img.sortOrder,
          })),
        };

        const headers = authHeaders(accessToken);

        if (isEdit) {
          // PATCH bukan PUT — sesuai backend @Patch(':id')
          await apiClient.patch(`/products/${product!.id}`, payload, {
            headers,
          });
        } else {
          await apiClient.post("/products", payload, { headers });
        }

        toast.success(
          isEdit ? "Produk berhasil diperbarui" : "Produk berhasil dibuat"
        );
        router.push("/admin/products");
      } catch (error) {
        const fieldErrors = parseFieldErrors(error);
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, message]) => {
            setError(field as keyof ProductFormInput, { message });
          });
        }
        toast.error(getErrorMessage(error) ?? "Gagal menyimpan produk");
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
        "Main image sudah ada. Hapus yang lama dulu sebelum menambah main baru."
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
        className="mx-auto max-w-6xl space-y-8"
      >
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={pending || imageUploading}
            className="bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
          >
            {pending
              ? "Menyimpan…"
              : isEdit
                ? "Simpan perubahan"
                : "Add Product"}
          </Button>
        </div>

        <div className="mt-2 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <div className="space-y-8">
            {/* Status */}
            <section className="space-y-3">
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
                <Label htmlFor="name">Nama produk *</Label>
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
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  rows={5}
                  {...register("description")}
                  placeholder="Deskripsi produk…"
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
                <Label htmlFor="basePrice">Harga dasar (Rp) *</Label>
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
                  Harga diskon (Rp)
                  <span className="text-muted-foreground ml-1 text-xs">
                    — opsional, yang ditampilkan ke customer
                  </span>
                </Label>
                <Input
                  id="discountPrice"
                  type="number"
                  min={0}
                  placeholder="Kosongkan jika tidak ada diskon"
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
                <Label htmlFor="weight">Berat (gram) *</Label>
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
                <Label htmlFor="stock">Stok *</Label>
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
                <Label htmlFor="categoryId">Kategori</Label>
                <Select
                  value={categoryIdValue || "none"}
                  onValueChange={(v) =>
                    setValue("categoryId", v === "none" ? "" : v, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="categoryId" className="w-full sm:max-w-xs">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa kategori</SelectItem>
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

        {isEdit && (
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
              Hapus
            </Button>
          </div>
        )}
      </form>

      {isEdit && product && (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Hapus produk?"
          description={`Produk "${product.name}" akan dihapus permanen.`}
          confirmLabel="Hapus"
          variant="destructive"
          loading={deletePending}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
