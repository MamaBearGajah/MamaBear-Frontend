"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";

export type ImageType =
  | "main"
  | "nutrition"
  | "ingredients"
  | "usage"
  | "other";

export type ImageUploaderValue = {
  imageUrl: string;
  file?: File | null;
  altText: string;
  imageType: ImageType;
  isFeatured: boolean;
  sortOrder: number;
};

export interface ImageUploaderProps {
  value?: Partial<ImageUploaderValue>;
  onChange?: (value: ImageUploaderValue) => void;
  onFileSelected?: (file: File) => void;
  onUploadingChange?: (uploading: boolean) => void;
  onSubmit?: (value: ImageUploaderValue) => void;
  mainImageExists?: boolean;
  className?: string;
  disabled?: boolean;
  title?: string;
  description?: string;
}

const IMAGE_TYPE_OPTIONS: { value: ImageType; label: string }[] = [
  { value: "main", label: "Main Image" },
  { value: "nutrition", label: "Nutrition" },
  { value: "ingredients", label: "Ingredients" },
  { value: "usage", label: "Usage" },
  { value: "other", label: "Other" },
];

// Response dari POST /media/sign
type SignResponse = {
  uploadUrl: string;
  signature: string;
  timestamp: number;
  apiKey: string;
  folder: string;
};

// Response dari Cloudinary setelah upload
type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
};

function toValue(
  next: Partial<ImageUploaderValue> | undefined
): ImageUploaderValue {
  return {
    imageUrl: next?.imageUrl ?? "",
    file: next?.file ?? undefined,
    altText: next?.altText ?? "",
    imageType: next?.imageType ?? "main",
    isFeatured: next?.isFeatured ?? false,
    sortOrder: next?.sortOrder ?? 0,
  };
}

// Unwrap response backend yang dibungkus { success, data: {...} }
function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export default function ImageUploader({
  value,
  onChange,
  onFileSelected,
  onUploadingChange,
  onSubmit,
  mainImageExists = false,
  className,
  disabled = false,
  title = "Product Image",
  description = "Upload an image file or paste a direct image URL.",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const isUploadingRef = useRef(false);

  // Kalau value prop berubah dari luar (controlled), pakai itu.
  // Kalau tidak, simpan state lokal sendiri.
  const isControlled = value !== undefined;
  const [localValue, setLocalValue] = useState<ImageUploaderValue>(() =>
    toValue(value)
  );
  const [localPreview, setLocalPreview] = useState<string>(
    value?.imageUrl ?? ""
  );
  const [isUploading, setIsUploading] = useState(false);

  // Derived: kalau controlled pakai value prop, kalau uncontrolled pakai state lokal
  const internalValue = isControlled ? toValue(value) : localValue;

  useEffect(() => {
    if (!isControlled) return;

    const hasContent = Boolean(
      value?.imageUrl?.trim() || value?.altText?.trim() || value?.file
    );

    if (hasContent) {
      if (value?.imageUrl?.trim()) {
        setLocalPreview(value.imageUrl);
      }
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setLocalPreview("");
    setLocalValue(toValue(undefined));
  }, [isControlled, value]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const previewSrc = localPreview || internalValue.imageUrl;
  const previewReady = Boolean(previewSrc);

  const emitChange = (next: ImageUploaderValue) => {
    if (!isControlled) setLocalValue(next);
    onChange?.(next);
  };

  const setUploading = (next: boolean) => {
    isUploadingRef.current = next;
    setIsUploading(next);
    onUploadingChange?.(next);
  };

  // Cara 2: signed URL — upload langsung ke Cloudinary, tidak lewat server
  const uploadWithSignedUrl = async (file: File): Promise<string> => {
    // 1. Minta signature dari backend
    const signRes = await apiClient.post<unknown>("/media/sign", {
      folder: "products",
      fileName: file.name,
      fileType: file.type,
    });

    // Backend return { success, data: { uploadUrl, signature, timestamp, apiKey, folder } }
    const signData = unwrapData<SignResponse>(signRes.data);

    if (!signData.uploadUrl) {
      throw new Error("Upload URL tidak tersedia dari response signature.");
    }

    // 2. Build FormData untuk dikirim langsung ke Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", String(signData.timestamp));
    formData.append("signature", signData.signature);
    formData.append("folder", signData.folder);

    // 3. Upload langsung ke Cloudinary
    const uploadRes = await fetch(signData.uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`Upload ke Cloudinary gagal: ${errText}`);
    }

    const uploadData = (await uploadRes.json()) as CloudinaryUploadResponse;

    if (!uploadData.secure_url) {
      throw new Error("Upload berhasil tapi secure_url tidak ditemukan.");
    }

    return uploadData.secure_url;
  };

  // Cara 1: fallback — upload lewat server
  const uploadDirect = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "products");

    const uploadRes = await apiClient.post<unknown>("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Backend return { success, data: { imageUrl, publicId } }
    const data = unwrapData<{ imageUrl: string; publicId: string }>(
      uploadRes.data
    );

    if (!data.imageUrl) {
      throw new Error(
        "Backend upload selesai, tetapi imageUrl tidak ditemukan."
      );
    }

    return data.imageUrl;
  };

  const setPreviewFromFile = (file: File) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setLocalPreview(objectUrl);
  };

  const handleFile = (file?: File | null) => {
    if (!file || disabled || isUploadingRef.current) return;

    // Validasi tipe & ukuran sebelum upload
    const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED.includes(file.type)) {
      toast.error("Tipe file tidak didukung. Gunakan jpeg, png, atau webp.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB.");
      return;
    }

    // New flow: do NOT upload immediately. Keep file in local state and show preview.
    setPreviewFromFile(file);
    onFileSelected?.(file);
    // emit change with file attached; imageUrl remains empty until ProductGallery uploads
    emitChange({ ...internalValue, file, imageUrl: "" });
    setUploading(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const resetForm = () => {
    setLocalValue(toValue(undefined));
    setLocalPreview("");
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const handleSubmit = () => {
    // Require either a selected file or an existing imageUrl, plus altText
    if (!(internalValue.file || internalValue.imageUrl?.trim())) {
      toast.error("Pilih file gambar terlebih dahulu.");
      return;
    }
    if (mainImageExists && internalValue.imageType === "main") {
      toast.error("Main image sudah ada. Hapus main image yang lama dulu.");
      return;
    }
    if (!internalValue.altText.trim()) {
      toast.error("Title / alt text wajib diisi.");
      return;
    }
    onSubmit?.(internalValue);
    resetForm();
  };

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl bg-white shadow-[0_10px_28px_rgba(108,67,53,0.08)]",
        className
      )}
    >
      <div className="border-b border-[#E8E3E8] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#FDE7EE] text-[#D5557E]">
            <ImagePlus className="size-4.5" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#6C4735]">{title}</h3>
        </div>
      </div>

      <div className="px-5 pt-4 pb-5">
        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="group relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#F6B8CB] bg-[#FFF4F8] transition"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
              disabled={disabled}
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isUploading}
              className="flex h-full w-full flex-col items-center justify-center gap-3 px-5 py-8 text-center outline-none disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <ImagePlus className="size-8 animate-pulse text-[#F1AFC4]" />
                  <p className="text-[13px] font-medium text-[#B98CA0]">
                    Uploading...
                  </p>
                </div>
              ) : previewReady ? (
                <img
                  src={previewSrc}
                  alt={internalValue.altText || "Preview"}
                  className="max-h-[210px] max-w-full rounded-2xl object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <ImagePlus className="size-8 text-[#F1AFC4]" />
                  <p className="text-[11px] font-medium text-[#B98CA0]">
                    Drag & drop atau klik untuk pilih gambar
                  </p>
                  <p className="text-[11px] text-[#D5A0B5]">
                    jpeg, jpg, png, webp — maks 5MB
                  </p>
                </div>
              )}
            </button>
          </div>

          {/* Image URL input removed — uploader only selects a File and sends it to gallery */}

          {/* Alt text */}
          <div className="space-y-2">
            <Label htmlFor="altText">
              Title <span className="text-[#D5557E]">*</span>
            </Label>
            <Input
              id="altText"
              value={internalValue.altText}
              onChange={(e) =>
                emitChange({ ...internalValue, altText: e.target.value })
              }
              placeholder="Deskripsikan gambar ini..."
              disabled={disabled || isUploading}
              className="border-[#E5E7EB] focus-visible:border-[#F1AFC4] focus-visible:ring-[#F1AFC4]/30"
            />
          </div>

          {/* Image type */}
          <div className="space-y-2">
            <Label htmlFor="imageType">Image Type</Label>
            <Select
              value={internalValue.imageType}
              onValueChange={(v) =>
                emitChange({ ...internalValue, imageType: v as ImageType })
              }
            >
              <SelectTrigger id="imageType" className="w-full sm:max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_TYPE_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.value === "main" && mainImageExists}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                disabled ||
                isUploading ||
                !(internalValue.file || internalValue.imageUrl?.trim()) ||
                !internalValue.altText.trim()
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#D5557E] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C84E77] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Image
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
