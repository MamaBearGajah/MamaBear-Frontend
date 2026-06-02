"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { deleteProductAction } from "@/lib/actions/products";
import { effectivePrice, formatPrice, cn } from "@/lib/utils";
import { handleApiError } from "@/lib/errorHandler";
import type { ProductVariant } from "@/types";

const LOW_STOCK_THRESHOLD = 30;
const PLACEHOLDER_SRC =
  "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=96&h=96&fit=crop";

interface VariantsTableProps {
  variants: ProductVariant[];
  categoryMap: Record<string, string>;
}

export default function VariantsTable({
  variants,
  categoryMap,
}: VariantsTableProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<ProductVariant | null>(null);

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteProductAction(deleteTarget.id);
        toast.success(`"${deleteTarget.name}" berhasil dihapus.`);
        setDeleteTarget(null);
        router.refresh();
      } catch (error) {
        handleApiError(error);
      }
    });
  };

  if (!variants || variants.length === 0) {
    return (
      <div className="border-border bg-card rounded-xl border py-16 text-center">
        <p className="text-muted-foreground">Tidak ada varian ditemukan.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border-border bg-card overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              {/* <TableHead>Rating</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant) => {
              const imageUrl = PLACEHOLDER_SRC;
              const sublabel = variant.sku;
              const isLowStock = variant.stock < LOW_STOCK_THRESHOLD;

              return (
                <TableRow key={variant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={imageUrl}
                          alt={`${variant.name} ${variant.value}`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground truncate font-medium">
                          {variant.productId}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {sublabel}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="min-w-0">
                        <p className="text-foreground truncate font-medium">
                          {`${variant.name} ${variant.value}`}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {sublabel}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{"—"}</TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(variant.priceAdjustment)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-semibold",
                        isLowStock ? "text-red-600" : "text-green-600"
                      )}
                    >
                      {variant.stock}
                    </span>
                  </TableCell>
                  {/* <TableCell>
                    {variant.ratingCount && variant.ratingCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        {variant.avgRating?.toFixed(1)}
                        <span className="text-muted-foreground">
                          ({variant.ratingCount})
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell> */}
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        title="Edit"
                      >
                        <Link
                          href={`/admin/products/${variant.productId}/variants/${variant.id}`}
                        >
                          <Pencil className="size-4 text-blue-600" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        title="View store"
                      >
                        <Link
                          href={`/product/${variant.productId}/variants/${variant.id}`}
                          target="_blank"
                        >
                          <Eye className="size-4 text-green-600" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Delete"
                        onClick={() => setDeleteTarget(variant)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus varian produk?"
        description={
          deleteTarget
            ? `Varian "${deleteTarget.name}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`
            : undefined
        }
        confirmLabel="Hapus"
        variant="destructive"
        loading={pending}
        onConfirm={handleDelete}
      />
    </>
  );
}
