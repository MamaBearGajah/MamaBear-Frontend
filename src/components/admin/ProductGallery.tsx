"use client";

import React from "react";
import { Trash2, GripVertical } from "lucide-react";
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
  altText?: string;
  imageType?: string;
  isFeatured?: boolean;
  sortOrder?: number;
};

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

  const featured = index === 0;

  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-3 py-2">
      <div className="text-sm font-semibold text-[var(--mamabear-dark-pink)]">
        {index + 1}
      </div>

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-50"
      >
        <GripVertical className="size-4" />
      </button>

      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
        <img
          src={img.imageUrl}
          alt={img.altText ?? "Product image"}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="text-foreground truncate text-sm font-medium">
          {img.altText ?? "Untitled"}
        </span>
        <span className="text-muted-foreground mt-1 truncate text-xs">
          {img.imageType ?? "other"}
        </span>
      </div>

      <div className="flex gap-2">
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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const itemIds = images.map(
    (img, index) => `${String(img.id ?? img.imageUrl)}-${index}`
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = itemIds.indexOf(active.id as string);
    const overIndex = itemIds.indexOf(over.id as string);
    if (activeIndex === -1 || overIndex === -1) return;

    const nextImages = arrayMove(images, activeIndex, overIndex).map(
      (image, idx) => ({
        ...image,
        sortOrder: idx + 1,
        isFeatured: idx === 0,
      })
    );

    onReorder?.(nextImages);
  };

  if (!images || images.length === 0) {
    return (
      <section className={cn("rounded-2xl bg-white p-4 shadow-sm", className)}>
        <Label>Product Gallery</Label>
        <p className="text-muted-foreground mt-2 text-sm">No images yet.</p>
      </section>
    );
  }

  return (
    <section className={cn("rounded-2xl bg-white p-4 shadow-sm", className)}>
      <div className="mb-3 flex items-center justify-between">
        <Label className="mb-0">Product Gallery</Label>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">
            {images.map((img, index) => {
              const itemId = `${String(img.id ?? img.imageUrl)}-${index}`;
              return (
                <SortableGalleryItem
                  key={itemId}
                  id={itemId}
                  index={index}
                  img={img}
                  onDelete={onDelete}
                />
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>
    </section>
  );
}
