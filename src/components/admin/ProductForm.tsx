"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import {
  createProductAction,
  deleteProductAndRedirectAction,
  updateProductAction,
} from "@/lib/actions/products";
import { cn, toSlug } from "@/lib/utils";
import {
  productFormDefaults,
  productFormSchema,
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
}

export default function ProductForm({ mode, product, categories }: ProductFormProps) {
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const slugManuallyEdited = useRef(false);

  const isEdit = mode === "edit" && !!product;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? productToFormValues(product) : productFormDefaults,
  });

  const nameValue = watch("name");
  const statusValue = watch("status");
  const categoryIdValue = watch("categoryId");

  useEffect(() => {
    if (isEdit || slugManuallyEdited.current) return;
    if (nameValue) {
      setValue("slug", toSlug(nameValue), { shouldValidate: true });
    }
  }, [nameValue, isEdit, setValue]);

  const onSubmit = (data: ProductFormValues) => {
    startTransition(async () => {
      const result = isEdit
        ? await updateProductAction(product!.id, data)
        : await createProductAction(data);

      if (result && !result.success) {
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof ProductFormInput, { message });
          });
        }
        toast.error(result.message ?? "Gagal menyimpan produk");
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-8">
        <section className="space-y-3">
          <Label>Status</Label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("status", opt.value, { shouldValidate: true })}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  statusValue === opt.value
                    ? "border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-light-pink)] text-foreground"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <StatusBadge status={statusValue} />
          {errors.status ? (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          ) : null}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Nama produk *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="ASI Booster Tea – Hazelnut"
              className={fieldClass("name")}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
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
            {errors.slug ? (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              {...register("sku")}
              placeholder="SKU-001"
              className={fieldClass("sku")}
            />
            {errors.sku ? (
              <p className="text-sm text-destructive">{errors.sku.message}</p>
            ) : null}
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
            {errors.description ? (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            ) : null}
          </div>
        </section>

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
            {errors.basePrice ? (
              <p className="text-sm text-destructive">{errors.basePrice.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountPrice">Harga diskon (Rp)</Label>
            <Input
              id="discountPrice"
              type="number"
              min={0}
              placeholder="Opsional"
              {...register("discountPrice")}
              className={fieldClass("discountPrice")}
            />
            {errors.discountPrice ? (
              <p className="text-sm text-destructive">{errors.discountPrice.message}</p>
            ) : null}
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
            {errors.weight ? (
              <p className="text-sm text-destructive">{errors.weight.message}</p>
            ) : null}
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
            {errors.stock ? (
              <p className="text-sm text-destructive">{errors.stock.message}</p>
            ) : null}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="categoryId">Kategori</Label>
            <Select
              value={categoryIdValue || "none"}
              onValueChange={(v) =>
                setValue("categoryId", v === "none" ? "" : v, { shouldValidate: true })
              }
            >
              <SelectTrigger id="categoryId" className="w-full sm:max-w-xs">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tanpa kategori</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <div className="flex gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/products">Batal</Link>
            </Button>
            {isEdit ? (
              <Button
                type="button"
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Hapus
              </Button>
            ) : null}
          </div>
          <Button
            type="submit"
            disabled={pending}
            className="bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
          >
            {pending ? "Menyimpan…" : isEdit ? "Simpan perubahan" : "Buat produk"}
          </Button>
        </div>
      </form>

      {isEdit && product ? (
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
      ) : null}
    </>
  );
}
