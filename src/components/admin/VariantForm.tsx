"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUploader, {
  type ImageUploaderValue,
} from "@/components/admin/ImageUploader";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import StatusBadge from "@/components/shared/StatusBadge";
import { deleteProductAndRedirectAction } from "@/lib/actions/products";
import { cn, toSlug } from "@/lib/utils";
import {
  variantFormDefaults,
  variantFormSchema,
  formValuesToPayload,
  variantToFormValues,
  type VariantFormInput,
  type VariantFormValues,
} from "@/lib/validations/variant.schema";
import { handleApiError } from "@/lib/errorHandler";
import { variantApi } from "../../lib/api/variants";

const STATUS_OPTIONS: { value: boolean; label: string }[] = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

interface VariantFormProps {
  mode: "create" | "edit";
  variant?: any;
  productId?: string;
  variantId?: string;
  productOptions?: any;
}

export default function VariantForm({
  mode,
  variant,
  productId,
  variantId,
  productOptions,
}: VariantFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [createProductId, setCreateProductId] = useState<string>("");

  const isEdit = mode === "edit";

  const [imageValue, setImageValue] = useState<ImageUploaderValue | undefined>(
    () => {
      if (!variant || !variant.images || variant.images.length === 0)
        return undefined;
      const first = variant.images[0];
      return {
        imageUrl: first.imageUrl ?? "",
        altText: first.altText ?? variant.name ?? "",
        imageType:
          (first.imageType as ImageUploaderValue["imageType"]) ?? "main",
        isFeatured: !!variant.images.find((i: any) => i.isFeatured),
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
  } = useForm<VariantFormInput, unknown, VariantFormValues>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: variant
      ? variantToFormValues(variant as never)
      : variantFormDefaults,
  });

  const isActiveValue = watch("isActive");

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

  const onSubmit = (data: VariantFormValues) => {
    if (imageUploading) {
      toast.error("Tunggu upload image selesai dulu.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          ...formValuesToPayload(data),
          mainImage: imageValue?.imageUrl?.trim() || undefined,
        };

        if (isEdit && productId && variantId) {
          await variantApi.update(productId, variantId, payload);
        } else {
          await variantApi.create(payload, createProductId);
        }

        toast.success(
          isEdit ? "Variant updated successfully" : "Variant created successfully"
        );
        router.push("/admin/variants");
      } catch (error) {
        const fieldErrors = parseFieldErrors(error);
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, message]) => {
            setError(field as keyof VariantFormInput, { message });
          });
        }
        toast.error(getErrorMessage(error) ?? "Failed to save variant");
      }
    });
  };

  const handleDelete = () => {
    if (!variant) return;
    startDeleteTransition(async () => {
      try {
        await deleteProductAndRedirectAction(variant.id);
      } catch (error) {
        handleApiError(error);
      }
    });
  };

  const fieldClass = (field: keyof VariantFormInput) =>
    cn(errors[field] && "border-destructive");

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-6xl space-y-8"
      >
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/variants">Cancel</Link>
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
                : "Add Variant"}
          </Button>
        </div>

        <div className="mt-2 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <div className="space-y-8">
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="createProductId">Product name</Label>
                <Select
                  value={createProductId || "none"}
                  onValueChange={(v) => setCreateProductId(v)}
                >
                  <SelectTrigger
                    id="createProductId"
                    className="w-full sm:max-w-xs"
                  >
                    <SelectValue placeholder="Pilih Produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa Produk</SelectItem>
                    {productOptions?.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Variant name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="ASI Booster Tea"
                  className={fieldClass("name")}
                  disabled={!isEdit && !createProductId}
                />
                {errors.name ? (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Ukuran/Rasa Varian *</Label>
                <Input
                  id="value"
                  {...register("value")}
                  placeholder="Hazelnut"
                  className={fieldClass("value")}
                  disabled={!isEdit && !createProductId}
                />
                {errors.value ? (
                  <p className="text-destructive text-sm">
                    {errors.value.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceAdjustment">Price adjustment *</Label>
                <Input
                  id="priceAdjustment"
                  {...register("priceAdjustment")}
                  placeholder="0"
                  className={fieldClass("priceAdjustment")}
                  disabled={!isEdit && !createProductId}
                />
                {errors.priceAdjustment ? (
                  <p className="text-destructive text-sm">
                    {errors.priceAdjustment.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="SKU-001"
                  className={fieldClass("sku")}
                  disabled={!isEdit && !createProductId}
                />
                {errors.sku ? (
                  <p className="text-destructive text-sm">
                    {errors.sku.message}
                  </p>
                ) : null}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base price (IDR) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min={0}
                  {...register("basePrice")}
                  className={fieldClass("basePrice")}
                  disabled={!isEdit && !createProductId}
                />
                {errors.basePrice ? (
                  <p className="text-destructive text-sm">
                    {errors.basePrice.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount price (IDR)</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  min={0}
                  placeholder="Optional"
                  {...register("discountPrice")}
                  className={fieldClass("discountPrice")}
                  disabled={!isEdit && !createProductId}
                />
                {errors.discountPrice ? (
                  <p className="text-destructive text-sm">
                    {errors.discountPrice.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  {...register("stock")}
                  className={fieldClass("stock")}
                  disabled={!isEdit && !createProductId}
                />
                {errors.stock ? (
                  <p className="text-destructive text-sm">
                    {errors.stock.message}
                  </p>
                ) : null}
              </div>

              <section className="space-y-3">
                <Label>Status</Label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() =>
                        setValue("isActive", opt.value, {
                          shouldValidate: true,
                        })
                      }
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                        isActiveValue === opt.value
                          ? "text-foreground border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-light-pink)]"
                          : "border-border bg-background hover:bg-muted"
                      )}
                      disabled={!isEdit}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {errors.isActive ? (
                  <p className="text-destructive text-sm">
                    {errors.isActive.message}
                  </p>
                ) : null}
              </section>
            </section>
          </div>

          <div className="space-y-6 xl:sticky xl:top-6">
            <ImageUploader
              value={imageValue}
              onChange={(v) => setImageValue(v)}
              onUploadingChange={setImageUploading}
            />
          </div>
        </div>

        {isEdit ? (
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        ) : null}
      </form>

      {isEdit && variant ? (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete variant?"
          description={`Variant "${variant.name}" will be permanently deleted.`}
          confirmLabel="Delete"
          variant="destructive"
          loading={deletePending}
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  );
}
