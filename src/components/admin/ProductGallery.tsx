"use client";

import React, { useEffect, useState } from "react";
import { Trash2, GripVertical, Clock, Check, X } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ProductImage = {
  id?: string | number;
  imageUrl: string;
  file?: File | null;
  altText?: string;
  imageType?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  status?: "pending" | "success" | "failed";
  error?: string | null;
  previewUrl?: string | null;
};

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

interface ProductGalleryProps {
  images: ProductImage[];
  className?: string;
  onDelete?: (index: number) => void;
  onReorder?: (images: ProductImage[]) => void;
}

function SortableGalleryItem({
  id,
  index,
  img,
  onDelete,
}: {
  id: string;
  index: number;
  img: ProductImage;
  onDelete?: (index: number) => void;
}) {
  const canDrag = img.imageType !== "main";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.75 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-3 py-2">
      <div className="text-sm font-semibold text-[var(--mamabear-dark-pink)]">
        {index + 1}
      </div>

      <button
        type="button"
        {...(canDrag ? attributes : {})}
        {...(canDrag ? listeners : {})}
        disabled={!canDrag}
        className={cn(
          "text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-50",
          !canDrag && "cursor-not-allowed opacity-40 hover:bg-transparent"
        )}
      >
        <GripVertical className="size-4" />
      </button>

      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
        {(() => {
          const src = img.imageUrl || img.previewUrl || null;
          if (src) {
            return (
              <img
                src={src}
                alt={img.altText ?? "Product image"}
                className="h-full w-full object-cover"
              />
            );
          }

          return <div className="h-full w-full" />;
        })()}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="text-foreground truncate text-sm font-medium">
          {img.altText ?? "Untitled"}
        </span>
        <span className="text-muted-foreground mt-1 truncate text-xs">
          {img.imageType ?? "other"}
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-2">
        {img.status && (
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white">
            {img.status === "pending" && (
              <Clock className="size-4 text-amber-500" />
            )}
            {img.status === "success" && (
              <Check className="size-4 text-green-600" />
            )}
            {img.status === "failed" && <X className="size-4 text-red-600" />}
          </span>
        )}

        <div className="max-w-[240px] min-w-0 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          {img.status === "success" && img.imageUrl ? (
            <span className="block truncate">{img.imageUrl}</span>
          ) : img.status === "failed" ? (
            <span className="block truncate text-red-600">
              {img.error ?? "Upload failed"}
            </span>
          ) : (
            <span className="block truncate text-amber-600">
              {img.status === "pending" ? "Uploading..." : "Waiting to upload"}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => onDelete?.(index)}
          className="text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
}

export default function ProductGallery({
  images,
  className,
  onDelete,
  onReorder,
}: ProductGalleryProps) {
  const [imagesState, setImagesState] = useState<ProductImage[]>(() =>
    (images || []).map((img) => ({ ...img }))
  );

  useEffect(() => {
    // When parent images change, sync and create previewUrls for file items
    setImagesState((_) =>
      (images || []).map((img) => ({
        ...img,
        previewUrl: img.previewUrl ?? null,
      }))
    );
  }, [images]);

  // create object URLs for items with file but no previewUrl
  useEffect(() => {
    const created: string[] = [];
    setImagesState((prev) =>
      prev.map((it) => {
        if (it.file && !it.previewUrl) {
          try {
            const url = URL.createObjectURL(it.file);
            created.push(url);
            return { ...it, previewUrl: url };
          } catch {
            return it;
          }
        }
        return it;
      })
    );

    return () => {
      created.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const itemIds = imagesState.map(
    (img, index) =>
      `${String(img.id ?? img.imageUrl ?? img.previewUrl ?? index)}-${index}`
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = itemIds.indexOf(active.id as string);
    const overIndex = itemIds.indexOf(over.id as string);
    if (activeIndex === -1 || overIndex === -1) return;

    const moved = arrayMove(imagesState, activeIndex, overIndex);
    const mainImage = moved.find((image) => image.imageType === "main");
    const orderedImages = mainImage
      ? [mainImage, ...moved.filter((image) => image !== mainImage)]
      : moved;

    const nextImages = orderedImages.map((image, idx) => ({
      ...image,
      sortOrder: idx + 1,
      isFeatured: idx === 0,
    }));

    setImagesState(nextImages);
    onReorder?.(nextImages);
  };

  const uploadWithSignedUrl = async (file: File): Promise<string> => {
    const signRes = await apiClient.post<unknown>("/media/sign", {
      folder: "products",
      fileName: file.name,
      fileType: file.type,
    });

    const signData = unwrapData<SignResponse>(signRes.data);

    if (!signData.uploadUrl) {
      throw new Error("No upload URL");
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
      throw new Error(`Upload failed: ${errText}`);
    }

    const uploadData = (await uploadRes.json()) as CloudinaryUploadResponse;

    if (!uploadData.secure_url) {
      throw new Error("No secure_url in response");
    }

    return uploadData.secure_url;
  };

  if (!imagesState || imagesState.length === 0) {
    return (
      <section className={cn("rounded-2xl bg-white p-4 shadow-sm", className)}>
        <div className="space-y-1">
          <Label>Product Gallery</Label>
          <p className="text-muted-foreground text-xs">
            All product images are shown in display order. The main image, or
            the item in position 1, is automatically treated as featured.
          </p>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">No images yet.</p>
      </section>
    );
  }

  return (
    <section className={cn("rounded-2xl bg-white p-4 shadow-sm", className)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="space-y-1">
          <Label className="mb-0">Product Gallery</Label>
          <p className="text-muted-foreground text-xs">
            All product images are shown in display order. The main image, or
            the item in position 1, is automatically treated as featured.
          </p>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">
            {imagesState.map((img, index) => {
              const itemId = `${String(img.id ?? img.imageUrl ?? img.previewUrl ?? index)}-${index}`;
              return (
                <SortableGalleryItem
                  key={itemId}
                  id={itemId}
                  index={index}
                  img={img}
                  onDelete={(i) => {
                    // revoke preview URL if present
                    const next = imagesState.filter((_, idx) => idx !== i);
                    const removed = imagesState[i];
                    if (removed?.previewUrl)
                      URL.revokeObjectURL(removed.previewUrl);
                    setImagesState(next);
                    onDelete?.(i);
                  }}
                />
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          onClick={async () => {
            // Upload all pending images (those with a file and not yet success)
            const next = [...imagesState];
            for (let i = 0; i < next.length; i++) {
              const img = next[i];
              if (img.status === "success") continue;
              if (!img.file) {
                // nothing to upload; mark failed
                next[i] = {
                  ...img,
                  status: "failed",
                  error: "No file to upload",
                };
                setImagesState([...next]);
                continue;
              }

              next[i] = { ...img, status: "pending" };
              setImagesState([...next]);

              try {
                const secureUrl = await uploadWithSignedUrl(img.file);
                next[i] = { ...img, status: "success", imageUrl: secureUrl };
                setImagesState([...next]);
              } catch (err: any) {
                next[i] = {
                  ...img,
                  status: "failed",
                  error: err?.message ?? String(err),
                };
                setImagesState([...next]);
                toast.error(`Upload failed: ${err?.message ?? String(err)}`);
              }
            }

            onReorder?.(next);
          }}
        >
          Upload All
        </Button>
      </div>
    </section>
  );
}
