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
import type { ProductListItem } from "@/types";

const LOW_STOCK_THRESHOLD = 30;
const PLACEHOLDER_SRC =
  "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=96&h=96&fit=crop";

interface ProductsTableProps {
  products: ProductListItem[];
  categoryMap: Record<string, string>;
}

export default function ProductsTable({ products, categoryMap }: ProductsTableProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<ProductListItem | null>(null);

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

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card py-16 text-center">
        <p className="text-muted-foreground">Tidak ada produk ditemukan.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const imageUrl =
                product.images?.find((i) => i.isFeatured)?.imageUrl ??
                product.images?.[0]?.imageUrl ??
                PLACEHOLDER_SRC;
              const sublabel =
                product.weight != null ? `${product.weight}g` : product.slug;
              const isLowStock = product.stock < LOW_STOCK_THRESHOLD;

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{product.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{sublabel}</p>
                      </div>
                      </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.categoryId
                      ? (categoryMap[product.categoryId] ?? "—")
                      : "—"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(effectivePrice(product))}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-semibold",
                        isLowStock ? "text-red-600" : "text-green-600",
                      )}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.ratingCount && product.ratingCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        {product.avgRating?.toFixed(1)}
                        <span className="text-muted-foreground">
                          ({product.ratingCount})
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" asChild title="Edit">
                        <Link href={`/admin/products/${product.id}`}>
                          <Pencil className="size-4 text-blue-600" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon-sm" asChild title="View store">
                        <Link href={`/product/${product.id}`} target="_blank">
                          <Eye className="size-4 text-green-600" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Delete"
                        onClick={() => setDeleteTarget(product)}
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
        title="Hapus produk?"
        description={
          deleteTarget
            ? `Produk "${deleteTarget.name}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`
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
