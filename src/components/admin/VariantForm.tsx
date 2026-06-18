"use client";

/**
 * FIXED: src/components/admin/VariantForm.tsx
 *
 * BUG sebelumnya:
 * 1. ImageUploader tidak punya prop `onSubmit` → tombol "Submit Image" tidak
 *    melakukan apa-apa, gambar tidak masuk ke state
 * 2. onSubmit variant menggunakan `imageValue?.imageUrl?.trim()` tapi imageUrl
 *    selalu "" karena file belum pernah diupload (ImageUploader handleFile()
 *    set imageUrl: "" dan hanya attach .file)
 * 3. Akibat: payload.mainImage selalu undefined → variant tersimpan tanpa gambar
 *
 * FIX:
 * 1. Tambahkan `onSubmit` pada ImageUploader → saat user klik "Submit Image",
 *    file langsung diupload ke Cloudinary dan imageUrl ter-set di imageValue
 * 2. Tambahkan state `selectedFile` untuk tracking file yang dipilih
 * 3. Saat onSubmit form variant, jika masih ada file pending (belum upload),
 *    upload dulu baru submit
 * 4. Tampilkan preview + status upload di ImageUploader
 */

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
import { deleteProductAndRedirectAction } from "@/lib/actions/products";
import { cn } from "@/lib/utils";
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
import { apiClient } from "@/lib/api/client";

// ─── Cloudinary upload helpers ─────────────────────────────────────────────

type SignResponse = {
  uploadUrl: string;
  signature: string;
  timestamp: number;
  apiKey: string;
  folder: string;
};

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
};

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

async function uploadFileToCloudinary(file: File): Promise<string> {
  const signRes = await apiClient.post<unknown>("/media/sign", {
    folder: "products",
    fileName: file.name,
    fileType: file.type,
  });
  const signData = unwrapData<SignResponse>(signRes.data);

  if (!signData?.uploadUrl) {
    throw new Error("Upload URL tidak tersedia dari server.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signData.apiKey);
  formData.append("timestamp", String(signData.timestamp));
  formData.append("signature", signData.signature);
  formData.append("folder", signData.folder);

  const uploadRes = await fetch(signData.uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Upload Cloudinary gagal: ${errText}`);
  }

  const uploadData = (await uploadRes.json()) as CloudinaryUploadResponse;
  if (!uploadData.secure_url) {
    throw new Error("secure_url tidak ada di response Cloudinary.");
  }
  return uploadData.secure_url;
}

async function uploadFileViaServer(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "products");

  const res = await apiClient.post<unknown>("/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const data = unwrapData<{ imageUrl: string }>(res.data);
  if (!data?.imageUrl) throw new Error("imageUrl tidak ada di response server.");
  return data.imageUrl;
}

async function uploadFile(file: File): Promise<string> {
  try {
    return await uploadFileToCloudinary(file);
  } catch {
    return await uploadFileViaServer(file);
  }
}

// ─── Component ─────────────────────────────────────────────────────────────

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

  // FIX: pisahkan state untuk file yang belum diupload vs imageUrl yang sudah
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    variant?.imageUrl ?? ""
  );

  const isEdit = mode === "edit";

  // imageValue untuk ImageUploader component (controlled)
  const [imageValue, setImageValue] = useState<ImageUploaderValue>({
    imageUrl: variant?.imageUrl ?? "",
    altText: variant?.altText ?? variant?.name ?? "",
    imageType: "main",
    isFeatured: true,
    sortOrder: 0,
  });

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

  // ─── FIX: Handle image submit (Upload saat user klik "Submit Image") ────

  const handleImageSubmit = async (val: ImageUploaderValue) => {
    if (!val.file && !val.imageUrl?.trim()) {
      toast.error("Pilih gambar terlebih dahulu.");
      return;
    }

    // Jika ada file baru → upload sekarang
    if (val.file) {
      setImageUploading(true);
      const toastId = toast.loading("Mengupload gambar variant...");
      try {
        const url = await uploadFile(val.file);
        setUploadedImageUrl(url);
        setPendingFile(null);
        setImageValue({ ...val, imageUrl: url, file: null });
        toast.success("Gambar berhasil diupload!", { id: toastId });
      } catch (err: any) {
        toast.error(`Upload gagal: ${err?.message ?? "Error tidak diketahui"}`, {
          id: toastId,
        });
      } finally {
        setImageUploading(false);
      }
    } else if (val.imageUrl?.trim()) {
      // URL langsung (paste URL) → tidak perlu upload
      setUploadedImageUrl(val.imageUrl.trim());
      setImageValue(val);
      toast.success("Gambar ditambahkan.");
    }
  };

  // Handle saat user memilih file (sebelum submit image)
  const handleImageChange = (val: ImageUploaderValue) => {
    setImageValue(val);
    if (val.file) {
      setPendingFile(val.file);
    }
  };

  // ─── Submit form variant ───────────────────────────────────────────────

  const onSubmit = (data: VariantFormValues) => {
    // Jika masih ada pending file yang belum disubmit
    if (pendingFile && !uploadedImageUrl) {
      toast.error("Klik tombol 'Submit Image' dulu untuk upload gambar sebelum menyimpan.");
      return;
    }

    startTransition(async () => {
      try {
        let finalImageUrl = uploadedImageUrl || imageValue.imageUrl?.trim() || undefined;

        // Safety: jika ada pendingFile dan uploadedImageUrl masih kosong, upload sekarang
        if (pendingFile && !finalImageUrl) {
          setImageUploading(true);
          try {
            finalImageUrl = await uploadFile(pendingFile);
            setUploadedImageUrl(finalImageUrl);
            setPendingFile(null);
          } finally {
            setImageUploading(false);
          }
        }

        const payload = {
          ...formValuesToPayload(data),
          // FIX: imageUrl dari uploadedImageUrl (sudah di-upload), bukan dari imageValue.imageUrl yang mungkin ""
          imageUrl: finalImageUrl || undefined,
        };

        if (isEdit && productId && variantId) {
          await variantApi.update(productId, variantId, payload);
        } else {
          const targetProductId = productId || createProductId;
          if (!targetProductId) {
            toast.error("Pilih produk terlebih dahulu.");
            return;
          }
          await variantApi.create(payload, targetProductId);
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

  const isSaving = pending || imageUploading;
  const hasPendingFile = Boolean(pendingFile && !uploadedImageUrl);

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
            disabled={isSaving}
            className="bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
          >
            {pending
              ? "Saving…"
              : isEdit
                ? "Save changes"
                : "Add Variant"}
          </Button>
        </div>

        {/* Warning jika ada file belum disubmit */}
        {hasPendingFile && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Gambar dipilih tapi belum diupload. Klik{" "}
            <strong>Submit Image</strong> di panel kanan sebelum menyimpan.
          </div>
        )}

        <div className="mt-2 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <div className="space-y-8">
            <section className="grid gap-4 sm:grid-cols-2">
              {/* Pilih Produk (create only) */}
              {!isEdit && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="createProductId">Nama Produk *</Label>
                  <Select
                    value={createProductId || "none"}
                    onValueChange={(v) =>
                      setCreateProductId(v === "none" ? "" : v)
                    }
                  >
                    <SelectTrigger
                      id="createProductId"
                      className="w-full sm:max-w-xs"
                    >
                      <SelectValue placeholder="Pilih Produk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Pilih produk...</SelectItem>
                      {productOptions?.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Variant name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Ukuran"
                  className={fieldClass("name")}
                  disabled={!isEdit && !createProductId}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Nilai Varian *</Label>
                <Input
                  id="value"
                  {...register("value")}
                  placeholder="L / Hazelnut / 500ml"
                  className={fieldClass("value")}
                  disabled={!isEdit && !createProductId}
                />
                {errors.value && (
                  <p className="text-destructive text-sm">
                    {errors.value.message}
                  </p>
                )}
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
                {errors.priceAdjustment && (
                  <p className="text-destructive text-sm">
                    {errors.priceAdjustment.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="SKU-001-L"
                  className={fieldClass("sku")}
                  disabled={!isEdit && !createProductId}
                />
                {errors.sku && (
                  <p className="text-destructive text-sm">
                    {errors.sku.message}
                  </p>
                )}
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
                {errors.basePrice && (
                  <p className="text-destructive text-sm">
                    {errors.basePrice.message}
                  </p>
                )}
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
                {errors.discountPrice && (
                  <p className="text-destructive text-sm">
                    {errors.discountPrice.message}
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
                  disabled={!isEdit && !createProductId}
                />
                {errors.stock && (
                  <p className="text-destructive text-sm">
                    {errors.stock.message}
                  </p>
                )}
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
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {errors.isActive && (
                  <p className="text-destructive text-sm">
                    {errors.isActive.message}
                  </p>
                )}
              </section>
            </section>
          </div>

          {/* FIX: ImageUploader dengan onSubmit prop + onChange + status */}
          <div className="space-y-6 xl:sticky xl:top-6">
            {/* Show uploaded image URL if already uploaded */}
            {uploadedImageUrl && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                <p className="text-xs text-green-700 font-medium mb-2">
                  ✓ Gambar sudah diupload
                </p>
                <img
                  src={uploadedImageUrl}
                  alt="Variant image"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUploadedImageUrl("");
                    setPendingFile(null);
                    setImageValue({
                      imageUrl: "",
                      altText: "",
                      imageType: "main",
                      isFeatured: true,
                      sortOrder: 0,
                    });
                  }}
                  className="mt-2 text-xs text-red-500 hover:underline"
                >
                  Ganti gambar
                </button>
              </div>
            )}

            {/* ImageUploader untuk pilih file baru */}
            {!uploadedImageUrl && (
              <ImageUploader
                value={imageValue}
                // FIX: onChange untuk update state saat file dipilih
                onChange={handleImageChange}
                onUploadingChange={setImageUploading}
                // FIX: onSubmit untuk trigger upload saat user klik "Submit Image"
                onSubmit={handleImageSubmit}
                title="Gambar Variant"
                description="Upload gambar untuk variant ini (opsional)"
              />
            )}
          </div>
        </div>

        {isEdit && (
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
        )}
      </form>

      {isEdit && variant && (
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
      )}
    </>
  );
}