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

function toValue(
  next: Partial<ImageUploaderValue> | undefined
): ImageUploaderValue {
  return {
    imageUrl: next?.imageUrl ?? "",
    altText: next?.altText ?? "",
    imageType: next?.imageType ?? "main",
    isFeatured: next?.isFeatured ?? false,
    sortOrder: next?.sortOrder ?? 0,
  };
}

export default function ImageUploader({
  value,
  onChange,
  onFileSelected,
  onUploadingChange,
  onSubmit,
  className,
  disabled = false,
  title = "Product Image",
  description = "Upload an image file or paste a direct image URL.",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const isUploadingRef = useRef(false);
  const [internalValue, setInternalValue] = useState<ImageUploaderValue>(() =>
    toValue(value)
  );
  const [localPreview, setLocalPreview] = useState<string>(
    value?.imageUrl ?? ""
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setInternalValue(toValue(value));
    setLocalPreview(value?.imageUrl ?? "");
  }, [value]);

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
    setInternalValue(next);
    onChange?.(next);
  };

  const setUploading = (next: boolean) => {
    isUploadingRef.current = next;
    setIsUploading(next);
    onUploadingChange?.(next);
  };

  const safeParseJson = async (response: Response) => {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  };

  const extractSecureUrl = (payload: unknown): string => {
    if (!payload || typeof payload !== "object") return "";
    const row = payload as {
      secure_url?: string;
      secureUrl?: string;
      url?: string;
      data?: unknown;
    };

    if (typeof row.secure_url === "string") return row.secure_url;
    if (typeof row.secureUrl === "string") return row.secureUrl;
    if (typeof row.url === "string") return row.url;
    if (row.data && typeof row.data === "object")
      return extractSecureUrl(row.data);
    return "";
  };

  const extractSignData = (payload: unknown): Record<string, unknown> => {
    if (!payload || typeof payload !== "object") return {};
    const row = payload as { data?: unknown } & Record<string, unknown>;
    if (row.data && typeof row.data === "object") {
      return row.data as Record<string, unknown>;
    }
    return row;
  };

  const uploadWithSignedUrl = async (file: File): Promise<string> => {
    const signResponse = await apiClient.post<unknown>("/media/sign", {
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      folder: "products",
    });

    const signData = extractSignData(signResponse.data);
    const cloudName = String(
      signData.cloudName ?? signData.cloud_name ?? ""
    ).trim();
    const resourceType = String(
      signData.resourceType ?? signData.resource_type ?? "image"
    ).trim();
    const uploadUrl = String(
      signData.uploadUrl ??
        signData.upload_url ??
        (cloudName
          ? `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`
          : "")
    ).trim();

    if (!uploadUrl) {
      throw new Error(
        "Upload URL Cloudinary tidak tersedia dari response signature."
      );
    }

    const formData = new FormData();
    formData.append("file", file);

    const apiKey = String(signData.apiKey ?? signData.api_key ?? "").trim();
    const timestamp = signData.timestamp ?? signData.timeStamp;
    const signature = String(signData.signature ?? "").trim();
    const folder = String(signData.folder ?? "products").trim();
    const uploadPreset = String(
      signData.uploadPreset ?? signData.upload_preset ?? ""
    ).trim();

    if (apiKey) formData.append("api_key", apiKey);
    if (timestamp != null && timestamp !== "")
      formData.append("timestamp", String(timestamp));
    if (signature) formData.append("signature", signature);
    if (folder) formData.append("folder", folder);
    if (uploadPreset) formData.append("upload_preset", uploadPreset);

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Upload ke Cloudinary gagal setelah signed URL didapat.");
    }

    const uploadData = await safeParseJson(uploadResponse);
    const secureUrl = extractSecureUrl(uploadData);

    if (!secureUrl) {
      throw new Error(
        "Cloudinary berhasil upload, tetapi secure_url tidak ditemukan."
      );
    }

    return secureUrl;
  };

  const uploadDirect = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "products");

    const uploadResponse = await apiClient.post<unknown>(
      "/media/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const secureUrl = extractSecureUrl(uploadResponse.data);

    if (!secureUrl) {
      throw new Error(
        "Backend upload selesai, tetapi secure_url tidak ditemukan."
      );
    }

    return secureUrl;
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

    setUploading(true);
    setPreviewFromFile(file);

    onFileSelected?.(file);

    uploadWithSignedUrl(file)
      .catch(() => uploadDirect(file))
      .then((secureUrl) => {
        setLocalPreview(secureUrl);
        emitChange({ ...internalValue, imageUrl: secureUrl });
        toast.success("Image berhasil diupload ke Cloudinary.");
      })
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : "Gagal upload image.";
        toast.error(message);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const resetForm = () => {
    setInternalValue(toValue(undefined));
    setLocalPreview("");
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const handleSubmit = () => {
    if (!internalValue.imageUrl.trim()) {
      toast.error("Image URL is required.");
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
          <div
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={handleDrop}
            className="group relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#F6B8CB] bg-[#FFF4F8] transition"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => handleFile(event.target.files?.[0])}
              disabled={disabled}
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isUploading}
              className="flex h-full w-full flex-col items-center justify-center gap-3 px-5 py-8 text-center outline-none disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3 text-[#D5A0B5]">
                  <ImagePlus className="size-8 animate-pulse text-[#F1AFC4]" />
                  <p className="text-[13px] font-medium text-[#B98CA0]">
                    Uploading image...
                  </p>
                </div>
              ) : previewReady ? (
                <div className="relative flex h-full w-full items-center justify-center">
                  <img
                    src={previewSrc}
                    alt={internalValue.altText || "Preview"}
                    className="max-h-[210px] max-w-full rounded-2xl object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-[#D5A0B5]">
                  <ImagePlus className="size-8 text-[#F1AFC4]" />
                  <div>
                    <p className="text-[13px] font-medium text-[#B98CA0]">
                      Enter image URL to preview
                    </p>
                  </div>
                </div>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">
              Image URL <span className="text-[#D5557E]">*</span>
            </Label>
            <Input
              id="imageUrl"
              value={internalValue.imageUrl}
              onChange={(event) => {
                const next = event.target.value;
                setLocalPreview(next);
                emitChange({ ...internalValue, imageUrl: next });
              }}
              placeholder="https://images.unsplash.com/..."
              disabled={disabled || isUploading}
              className="border-[#E5E7EB] focus-visible:border-[#F1AFC4] focus-visible:ring-[#F1AFC4]/30"
            />
            <p className="text-[12px] leading-5 text-[#8D6B5B]">
              Paste a direct image URL (Unsplash, CDN, etc.)
            </p>

            <div className="space-y-2">
              <Label htmlFor="altText">
                Title <span className="text-[#D5557E]">*</span>
              </Label>
              <Input
                id="altText"
                value={internalValue.altText}
                onChange={(event) => {
                  const next = event.target.value;
                  emitChange({ ...internalValue, altText: next });
                }}
                placeholder="Describe the image for accessibility..."
                disabled={disabled || isUploading}
                className="border-[#E5E7EB] focus-visible:border-[#F1AFC4] focus-visible:ring-[#F1AFC4]/30"
              />
              <p className="text-[12px] leading-5 text-[#8D6B5B]">
                Provide a descriptive alt text for the image.
              </p>
            </div>

            <div className="mt-3">
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
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  disabled || isUploading || !internalValue.imageUrl.trim()
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[#D5557E] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C84E77] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
