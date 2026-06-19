"use client";

/**
 * ProductForm.tsx — create & edit produk + variant dalam satu form.
 * Fixed for Zod v4 + @hookform/resolvers v5 compatibility.
 * z.coerce.number() → z.preprocess to avoid 'unknown' type inference.
 */

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  Trash2, Plus, ChevronDown, ChevronUp,
  ImagePlus, X, Loader2, Package,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import StatusBadge from "@/components/shared/StatusBadge";
import { apiClient, authHeaders } from "@/lib/api/client";
import {
  deleteProductAndRedirectAction,
  revalidateAdminProductsAction,
} from "@/lib/actions/products";
import { cn, toSlug } from "@/lib/utils";
import { handleApiError } from "@/lib/errorHandler";
import { variantApi } from "@/lib/api/variants";
import type { Category, Product, ProductStatus } from "@/types";

// ─── Number coercion helpers — Zod v4 + @hookform/resolvers v5 compatible ────
// z.preprocess also infers as unknown in Zod v4.
// Fix: use z.string/number union with transform, then cast via pipe to z.number()
// to force the output type to be `number` (not unknown).
const zNum = (min = 0) =>
  z.union([z.number(), z.string().transform(Number)]).pipe(z.number().min(min));

const zNumInt = (min = 0) =>
  z.union([z.number(), z.string().transform(Number)]).pipe(z.number().int().min(min));

const zNumOpt = () =>
  z.union([
    z.literal(""),
    z.number().min(0),
    z.string().transform((v) => (v === "" ? undefined : Number(v))),
  ]).transform((v) => (v === "" ? undefined : (v as number | undefined)))
    .pipe(z.number().min(0).optional());

// ─── Upload helpers ───────────────────────────────────────────────────────────

type SignResponse = {
  uploadUrl: string; signature: string; timestamp: number;
  apiKey: string; folder: string;
};

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload)
    return (payload as { data: T }).data;
  return payload as T;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const signRes = await apiClient.post<unknown>("/media/sign", {
    folder: "products", fileName: file.name, fileType: file.type,
  });
  const sign = unwrapData<SignResponse>(signRes.data);
  if (!sign?.uploadUrl) throw new Error("Upload URL tidak tersedia.");

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sign.apiKey);
  fd.append("timestamp", String(sign.timestamp));
  fd.append("signature", sign.signature);
  fd.append("folder", sign.folder);

  const res = await fetch(sign.uploadUrl, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`Cloudinary error: ${await res.text()}`);
  const json = await res.json() as { secure_url: string };
  if (!json.secure_url) throw new Error("secure_url tidak ada di response.");
  return json.secure_url;
}

async function uploadViaServer(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", "products");
  const res = await apiClient.post<unknown>("/media/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const data = unwrapData<{ imageUrl: string }>(res.data);
  if (!data?.imageUrl) throw new Error("imageUrl tidak ada di response.");
  return data.imageUrl;
}

async function uploadFile(file: File): Promise<string> {
  try { return await uploadToCloudinary(file); }
  catch { return await uploadViaServer(file); }
}

// ─── ImagePicker ──────────────────────────────────────────────────────────────

interface ImagePickerProps {
  previewUrl?: string;
  onFileChange: (file: File, previewUrl: string) => void;
  onClear: () => void;
  size?: "sm" | "md";
  label?: string;
}

function ImagePicker({ previewUrl, onFileChange, onClear, size = "md", label = "Gambar" }: ImagePickerProps) {
  const boxClass = size === "sm" ? "h-20 w-20" : "h-28 w-28";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Ukuran file maksimal 5MB"); return; }
    const preview = URL.createObjectURL(file);
    onFileChange(file, preview);
    e.target.value = "";
  };

  return (
    <div className="flex items-start gap-3">
      <div className={cn("relative shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-pink-200 bg-pink-50", boxClass)}>
        {previewUrl ? (
          <>
            <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
            <button type="button" onClick={onClear} className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 text-gray-500 hover:text-red-500">
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 text-pink-300 hover:text-pink-400">
            <ImagePlus className={size === "sm" ? "h-5 w-5" : "h-7 w-7"} />
            {size !== "sm" && <span className="text-[10px]">Pilih gambar</span>}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleChange} />
          </label>
        )}
      </div>
      <div className="pt-1 text-xs text-muted-foreground">
        {!previewUrl && (
          <>
            <p>Format: JPG, PNG, WebP</p>
            <p>Maks. 5MB</p>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted">
              <ImagePlus className="h-3.5 w-3.5" /> Pilih file
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleChange} />
            </label>
          </>
        )}
        {previewUrl && (
          <button type="button" onClick={onClear} className="mt-1 text-red-400 hover:text-red-600">Hapus gambar</button>
        )}
      </div>
    </div>
  );
}

// ─── Zod Schema — using zNum helpers for Zod v4 compatibility ────────────────

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const variantSchema = z.object({
  id:              z.string().optional(),
  name:            z.string().min(1, "Nama wajib diisi"),
  value:           z.string().min(1, "Nilai wajib diisi"),
  basePrice:       zNum(0),
  discountPrice:   zNumOpt(),
  priceAdjustment: zNum(0),
  stock:           zNumInt(0),
  weight:          zNumOpt(),
  sku:             z.string().optional(),
  sortOrder:       zNumInt(0),
  imageUrl:        z.string().optional(),
  isActive:        z.boolean().default(true),
  _imageFile:      z.any().optional(),
  _imagePreview:   z.string().optional(),
  _open:           z.boolean().optional(),
});

const productSchema = z.object({
  name:              z.string().min(2, "Nama minimal 2 karakter").max(120),
  slug:              z.string().min(1, "Slug wajib diisi").max(120).regex(slugRegex, "Slug harus lowercase kebab-case"),
  sku:               z.string().min(3, "SKU minimal 3 karakter").max(50),
  description:       z.string().max(5000).optional(),
  notes:             z.string().max(500).optional(),
  basePrice:         zNum(0),
  discountPrice:     zNumOpt(),
  weight:            zNum(1),
  stock:             zNumInt(0),
  status:            z.enum(["active", "inactive", "draft"]),
  categoryId:        z.string().optional(),
  mainImageUrl:      z.string().optional(),
  _mainImageFile:    z.any().optional(),
  _mainImagePreview: z.string().optional(),
  variants:          z.array(variantSchema).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
  categories: Category[];
  accessToken?: string;
}

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft", label: "Draft" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProductForm({ mode, product, categories, accessToken }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteVariantIndex, setDeleteVariantIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const slugManuallyEdited = useRef(false);
  const isEdit = mode === "edit" && !!product;

  // ─── Default values ───────────────────────────────────────────────────────

  const defaultValues: ProductFormValues = product
    ? {
        name:              product.name,
        slug:              product.slug,
        sku:               product.sku ?? "",
        description:       product.description ?? "",
        notes:             (product as any).notes ?? "",
        basePrice:         Number(product.basePrice),
        discountPrice:     product.discountPrice ? Number(product.discountPrice) : undefined,
        weight:            product.weight ?? 1,
        stock:             product.stock ?? 0,
        status:            (product.status as ProductStatus) ?? "draft",
        categoryId:        product.categoryId ?? "",
        mainImageUrl:      product.images?.find((i: any) => i.isFeatured)?.imageUrl ?? product.images?.[0]?.imageUrl ?? "",
        _mainImagePreview: "",
        variants: (product as any).variants?.map((v: any) => ({
          id:              v.id,
          name:            v.name,
          value:           v.value,
          basePrice:       Number(v.basePrice),
          discountPrice:   v.discountPrice ? Number(v.discountPrice) : undefined,
          priceAdjustment: Number(v.priceAdjustment ?? 0),
          stock:           v.stock,
          weight:          v.weight ? Number(v.weight) : undefined,
          sku:             v.sku ?? "",
          sortOrder:       v.sortOrder ?? 0,
          imageUrl:        v.imageUrl ?? "",
          isActive:        v.isActive ?? true,
          _imagePreview:   v.imageUrl ?? "",
          _open:           false,
        })) ?? [],
      }
    : {
        name: "", slug: "", sku: "", description: "", notes: "",
        basePrice: 0, discountPrice: undefined, weight: 1, stock: 0,
        status: "draft", categoryId: "",
        mainImageUrl: "", _mainImagePreview: "",
        variants: [],
      };

  // ─── Form ─────────────────────────────────────────────────────────────────

  const {
    register, handleSubmit, watch, setValue, control,
    setError, formState: { errors },
  } = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  const nameValue         = watch("name");
  const statusValue       = watch("status");
  const mainImagePreview  = watch("_mainImagePreview");
  const mainImageUrl      = watch("mainImageUrl");

  useEffect(() => {
    if (isEdit || slugManuallyEdited.current) return;
    if (nameValue) setValue("slug", toSlug(nameValue), { shouldValidate: true });
  }, [nameValue, isEdit, setValue]);

  // ─── Upload all pending images ────────────────────────────────────────────

  async function uploadAllPending(values: ProductFormValues) {
    let finalMainImageUrl = values.mainImageUrl ?? "";
    if (values._mainImageFile instanceof File)
      finalMainImageUrl = await uploadFile(values._mainImageFile);

    const variantImageUrls = await Promise.all(
      (values.variants ?? []).map(async (v) => {
        if (v._imageFile instanceof File) return await uploadFile(v._imageFile);
        return v.imageUrl ?? "";
      })
    );
    return { finalMainImageUrl, variantImageUrls };
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  const onSubmit = (data: ProductFormValues) => {
    startTransition(async () => {
      setIsUploading(true);
      const toastId = toast.loading("Mengupload gambar...");
      try {
        const { finalMainImageUrl, variantImageUrls } = await uploadAllPending(data);
        toast.loading("Menyimpan produk...", { id: toastId });

        const headers = authHeaders(accessToken);

        const variantPayloads = (data.variants ?? []).map((v, i) => ({
          id:              v.id,
          name:            v.name.trim(),
          value:           v.value.trim(),
          basePrice:       v.basePrice,
          discountPrice:   v.discountPrice ?? undefined,
          priceAdjustment: v.priceAdjustment ?? 0,
          stock:           v.stock,
          weight:          v.weight ?? undefined,
          sku:             v.sku?.trim() || undefined,
          sortOrder:       v.sortOrder ?? 0,
          imageUrl:        variantImageUrls[i] || undefined,
          isActive:        v.isActive,
        }));

        const baseProductPayload = {
          name:          data.name.trim(),
          slug:          data.slug.trim(),
          sku:           data.sku.trim(),
          description:   data.description?.trim() || undefined,
          notes:         data.notes?.trim() || undefined,
          basePrice:     data.basePrice,
          discountPrice: data.discountPrice ?? undefined,
          weight:        data.weight,
          stock:         data.stock,
          status:        data.status,
          categoryId:    data.categoryId?.trim() || undefined,
          // BE requires mainImage as string (not optional, not array)
          mainImage:     finalMainImageUrl || "",
          ...(finalMainImageUrl && {
            images: [{ imageUrl: finalMainImageUrl, imageType: "main", isFeatured: true, sortOrder: 1 }],
          }),
        };

        if (isEdit && product) {
          await apiClient.patch(`/products/${product.id}`, baseProductPayload, { headers });

          const existingIds = new Set<string>((product as any).variants?.map((v: any) => v.id) ?? []);
          const submittedIds = new Set<string>(variantPayloads.filter((v) => v.id).map((v) => v.id!));

          for (const eid of existingIds) {
            if (!submittedIds.has(eid)) await variantApi.delete(product.id, eid).catch(() => {});
          }
          for (const vp of variantPayloads) {
            const { id, ...rest } = vp;
            if (id && existingIds.has(id)) await variantApi.update(product.id, id, rest);
            else await variantApi.create(rest, product.id);
          }
        } else {
          await apiClient.post("/products", {
            ...baseProductPayload,
            variants: variantPayloads.length > 0 ? variantPayloads.map(({ id, ...v }) => v) : undefined,
          }, { headers });
        }

        toast.success(isEdit ? "Produk berhasil diperbarui" : "Produk berhasil dibuat", { id: toastId });
        await revalidateAdminProductsAction();
        router.push("/admin/products");
      } catch (error) {
        toast.dismiss(toastId);
        if (isAxiosError(error)) {
          const details = error.response?.data?.error?.details;
          if (Array.isArray(details))
            details.forEach(({ field, message }: any) => setError(field as any, { message }));
          toast.error(error.response?.data?.error?.message ?? error.response?.data?.message ?? "Gagal menyimpan produk");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Terjadi kesalahan");
        }
      } finally {
        setIsUploading(false);
      }
    });
  };

  const addVariant = () => {
    append({
      name: "", value: "", basePrice: 0, discountPrice: undefined,
      priceAdjustment: 0, stock: 0, weight: undefined, sku: "",
      sortOrder: fields.length, imageUrl: "", isActive: true,
      _imageFile: undefined, _imagePreview: "", _open: true,
    });
  };

  const isSaving = pending || isUploading;
  const leafCategories = categories.filter((c) => c.id !== "cat-root");

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit as any)} className="mx-auto max-w-4xl space-y-6 pb-16">

        {/* Top actions */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Batal</Link>
          </Button>
          <Button type="submit" disabled={isSaving} className="min-w-36 bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90">
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isUploading ? "Mengupload..." : "Menyimpan..."}
              </span>
            ) : isEdit ? "Simpan Perubahan" : "Buat Produk"}
          </Button>
        </div>

        {/* ══ SECTION 1: Info Produk ══════════════════════════════════════ */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-base font-semibold text-gray-800">Informasi Produk</h2>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button key={opt.value} type="button"
                  onClick={() => setValue("status", opt.value, { shouldValidate: true })}
                  className={cn("rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                    statusValue === opt.value
                      ? "border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-light-pink)] text-foreground"
                      : "border-border bg-background hover:bg-muted")}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <StatusBadge status={statusValue} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Nama */}
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="name">Nama Produk *</Label>
              <Input id="name" {...register("name")} placeholder="ASI Booster Tea – Hazelnut"
                className={cn(errors.name && "border-destructive")} />
              {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" {...register("slug", { onChange: () => { slugManuallyEdited.current = true; } })}
                placeholder="asi-booster-tea-hazelnut" className={cn(errors.slug && "border-destructive")} />
              {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
            </div>

            {/* SKU */}
            <div className="space-y-1">
              <Label htmlFor="sku">SKU *</Label>
              <Input id="sku" {...register("sku")} placeholder="MB-TEA-001"
                className={cn(errors.sku && "border-destructive")} />
              {errors.sku && <p className="text-destructive text-xs">{errors.sku.message}</p>}
            </div>

            {/* Deskripsi */}
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" rows={4} {...register("description")} placeholder="Deskripsi produk..." />
            </div>

            {/* Notes */}
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="notes">Catatan <span className="text-xs text-muted-foreground">— misal: "Tidak untuk ibu hamil"</span></Label>
              <Input id="notes" {...register("notes")} placeholder="Catatan tambahan opsional..." />
            </div>

            {/* Harga Dasar */}
            <div className="space-y-1">
              <Label htmlFor="basePrice">Harga Dasar (Rp) *</Label>
              <Input id="basePrice" type="number" min={0} {...register("basePrice")}
                className={cn(errors.basePrice && "border-destructive")} />
              {errors.basePrice && <p className="text-destructive text-xs">{String(errors.basePrice.message)}</p>}
            </div>

            {/* Harga Diskon */}
            <div className="space-y-1">
              <Label htmlFor="discountPrice">Harga Diskon (Rp) <span className="text-xs text-muted-foreground">— opsional</span></Label>
              <Input id="discountPrice" type="number" min={0} placeholder="Kosongkan jika tidak ada" {...register("discountPrice")} />
            </div>

            {/* Berat */}
            <div className="space-y-1">
              <Label htmlFor="weight">Berat (gram) *</Label>
              <Input id="weight" type="number" min={1} {...register("weight")}
                className={cn(errors.weight && "border-destructive")} />
              {errors.weight && <p className="text-destructive text-xs">{String(errors.weight.message)}</p>}
            </div>

            {/* Stok */}
            <div className="space-y-1">
              <Label htmlFor="stock">Stok *</Label>
              <Input id="stock" type="number" min={0} {...register("stock")}
                className={cn(errors.stock && "border-destructive")} />
              {errors.stock && <p className="text-destructive text-xs">{String(errors.stock.message)}</p>}
            </div>

            {/* Kategori */}
            <div className="space-y-1 sm:col-span-2">
              <Label>Kategori</Label>
              <Controller control={control} name="categoryId"
                render={({ field }) => (
                  <Select value={field.value || "none"} onValueChange={(v) => field.onChange(v === "none" ? "" : v)}>
                    <SelectTrigger className="w-full sm:max-w-xs">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tanpa kategori</SelectItem>
                      {leafCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Gambar Utama */}
          <div className="space-y-2">
            <Label>Gambar Utama Produk</Label>
            <ImagePicker
              previewUrl={mainImagePreview || mainImageUrl || undefined}
              onFileChange={(file, preview) => {
                setValue("_mainImageFile", file);
                setValue("_mainImagePreview", preview);
                setValue("mainImageUrl", "");
              }}
              onClear={() => {
                setValue("_mainImageFile", undefined);
                setValue("_mainImagePreview", "");
                setValue("mainImageUrl", "");
              }}
              size="md" label="Gambar utama produk"
            />
          </div>
        </section>

        {/* ══ SECTION 2: Variants ═════════════════════════════════════════ */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" /> Variant Produk
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Opsional — tambahkan jika produk punya pilihan ukuran, rasa, dll.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addVariant} className="w-full gap-1.5 sm:w-auto">
              <Plus className="h-4 w-4" /> Tambah Variant
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-muted-foreground">
              Belum ada variant.{" "}
              <button type="button" onClick={addVariant} className="font-medium text-[var(--mamabear-dark-pink)] hover:underline">
                Tambah variant
              </button>{" "}
              jika produk punya pilihan ukuran / rasa.
            </div>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => {
              const variantErrors = errors.variants?.[index];
              const isOpen = watch(`variants.${index}._open`) ?? true;
              const variantPreview = watch(`variants.${index}._imagePreview`);
              const variantImageUrl = watch(`variants.${index}.imageUrl`);
              const variantName = watch(`variants.${index}.name`);
              const variantValue = watch(`variants.${index}.value`);

              return (
                <div key={field.id} className="overflow-hidden rounded-xl border border-gray-200">
                  {/* Header */}
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3">
                    <button type="button" onClick={() => setValue(`variants.${index}._open`, !isOpen)}
                      className="flex flex-1 items-center gap-2 text-left">
                      {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                        : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                      <span className="text-sm font-medium text-gray-700">
                        {variantName && variantValue ? `${variantName}: ${variantValue}` : variantName || `Variant ${index + 1}`}
                      </span>
                      {!isOpen && (variantPreview || variantImageUrl) && (
                        <img src={variantPreview || variantImageUrl} alt="" className="ml-auto h-7 w-7 shrink-0 rounded object-cover" />
                      )}
                    </button>
                    <button type="button" onClick={() => setDeleteVariantIndex(index)}
                      className="text-muted-foreground transition-colors hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Fields */}
                  {isOpen && (
                    <div className="grid gap-4 p-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label>Nama Variant *</Label>
                        <Input {...register(`variants.${index}.name`)} placeholder="Ukuran / Rasa / Tipe"
                          className={cn(variantErrors?.name && "border-destructive")} />
                        {variantErrors?.name && <p className="text-destructive text-xs">{variantErrors.name.message}</p>}
                      </div>

                      <div className="space-y-1">
                        <Label>Nilai Variant *</Label>
                        <Input {...register(`variants.${index}.value`)} placeholder="L / Hazelnut / 500ml"
                          className={cn(variantErrors?.value && "border-destructive")} />
                        {variantErrors?.value && <p className="text-destructive text-xs">{variantErrors.value.message}</p>}
                      </div>

                      <div className="space-y-1">
                        <Label>Harga Dasar (Rp) *</Label>
                        <Input type="number" min={0} {...register(`variants.${index}.basePrice`)} />
                      </div>

                      <div className="space-y-1">
                        <Label>Harga Diskon (Rp) <span className="text-xs text-muted-foreground">— opsional</span></Label>
                        <Input type="number" min={0} placeholder="Opsional" {...register(`variants.${index}.discountPrice`)} />
                      </div>

                      <div className="space-y-1">
                        <Label>Stok *</Label>
                        <Input type="number" min={0} {...register(`variants.${index}.stock`)} />
                      </div>

                      <div className="space-y-1">
                        <Label>SKU <span className="text-xs text-muted-foreground">— opsional</span></Label>
                        <Input {...register(`variants.${index}.sku`)} placeholder="MB-TEA-001-L" />
                      </div>

                      <div className="space-y-1">
                        <Label>Berat (gram) <span className="text-xs text-muted-foreground">— override berat produk</span></Label>
                        <Input type="number" min={0} placeholder="Kosongkan untuk pakai berat produk" {...register(`variants.${index}.weight`)} />
                      </div>

                      <div className="space-y-1">
                        <Label>Urutan</Label>
                        <Input type="number" min={0} {...register(`variants.${index}.sortOrder`)} />
                      </div>

                      {/* Status */}
                      <div className="space-y-1 sm:col-span-2">
                        <Label>Status</Label>
                        <Controller control={control} name={`variants.${index}.isActive`}
                          render={({ field }) => (
                            <div className="flex gap-2">
                              {[{ value: true, label: "Active" }, { value: false, label: "Inactive" }].map((opt) => (
                                <button key={opt.label} type="button" onClick={() => field.onChange(opt.value)}
                                  className={cn("rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors",
                                    field.value === opt.value
                                      ? "border-[var(--mamabear-dark-pink)] bg-[var(--mamabear-light-pink)]"
                                      : "border-border bg-background hover:bg-muted")}>
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        />
                      </div>

                      {/* Gambar Variant */}
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Gambar Variant <span className="text-xs text-muted-foreground">— opsional, upload terpisah</span></Label>
                        <ImagePicker
                          previewUrl={variantPreview || variantImageUrl || undefined}
                          onFileChange={(file, preview) => {
                            setValue(`variants.${index}._imageFile`, file);
                            setValue(`variants.${index}._imagePreview`, preview);
                            setValue(`variants.${index}.imageUrl`, "");
                          }}
                          onClear={() => {
                            setValue(`variants.${index}._imageFile`, undefined);
                            setValue(`variants.${index}._imagePreview`, "");
                            setValue(`variants.${index}.imageUrl`, "");
                          }}
                          size="sm" label={`Gambar variant ${index + 1}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {fields.length > 0 && (
            <Button type="button" variant="outline" size="sm" onClick={addVariant} className="w-full gap-1.5">
              <Plus className="h-4 w-4" /> Tambah Variant Lagi
            </Button>
          )}
        </section>

        {/* Delete produk */}
        {isEdit && (
          <div className="flex justify-start">
            <Button type="button" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-1.5 size-4" /> Hapus Produk
            </Button>
          </div>
        )}
      </form>

      {/* Confirm delete produk */}
      {isEdit && product && (
        <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen}
          title="Hapus produk?" description={`Produk "${product.name}" akan dihapus permanen.`}
          confirmLabel="Hapus" variant="destructive" loading={deletePending}
          onConfirm={() => {
            startDeleteTransition(async () => {
              try { await deleteProductAndRedirectAction(product.id); }
              catch (error) { handleApiError(error); }
            });
          }}
        />
      )}

      {/* Confirm delete variant */}
      <ConfirmDialog
        open={deleteVariantIndex !== null} onOpenChange={(open) => !open && setDeleteVariantIndex(null)}
        title="Hapus variant?" description="Variant ini akan dihapus dari produk."
        confirmLabel="Hapus" variant="destructive" loading={false}
        onConfirm={async () => {
          if (deleteVariantIndex === null) return;
          const v = fields[deleteVariantIndex];
          if ((v as any).id && isEdit && product) {
            try { await variantApi.delete(product.id, (v as any).id); }
            catch { toast.error("Gagal menghapus variant dari server"); return; }
          }
          remove(deleteVariantIndex);
          setDeleteVariantIndex(null);
          toast.success("Variant dihapus");
        }}
      />
    </>
  );
}