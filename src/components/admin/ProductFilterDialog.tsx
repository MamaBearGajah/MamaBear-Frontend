"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { Category } from "@/types";

export interface ProductFilters {
  categoryId?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

interface ProductFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  initialFilters: ProductFilters;
  onApply: (filters: ProductFilters) => void;
}

export default function ProductFilterDialog({
  open,
  onOpenChange,
  categories,
  initialFilters,
  onApply,
}: ProductFilterDialogProps) {
  const [categoryId, setCategoryId] = useState(initialFilters.categoryId ?? "");
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "outOfStock">(
    initialFilters.inStock === true
      ? "inStock"
      : initialFilters.inStock === false
        ? "outOfStock"
        : "all",
  );
  const [minPrice, setMinPrice] = useState(
    initialFilters.minPrice != null ? String(initialFilters.minPrice) : "",
  );
  const [maxPrice, setMaxPrice] = useState(
    initialFilters.maxPrice != null ? String(initialFilters.maxPrice) : "",
  );

  useEffect(() => {
    if (open) {
      setCategoryId(initialFilters.categoryId ?? "");
      setStockFilter(
        initialFilters.inStock === true
          ? "inStock"
          : initialFilters.inStock === false
            ? "outOfStock"
            : "all",
      );
      setMinPrice(initialFilters.minPrice != null ? String(initialFilters.minPrice) : "");
      setMaxPrice(initialFilters.maxPrice != null ? String(initialFilters.maxPrice) : "");
    }
  }, [open, initialFilters]);

  const handleApply = () => {
    onApply({
      categoryId: categoryId || undefined,
      inStock:
        stockFilter === "inStock" ? true : stockFilter === "outOfStock" ? false : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    onApply({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Produk</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="filter-category">Kategori</Label>
            <Select
              value={categoryId || "all"}
              onValueChange={(v) => setCategoryId(v === "all" ? "" : v)}
            >
              <SelectTrigger id="filter-category" className="w-full">
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua kategori</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="filter-stock">Stok</Label>
            <Select
              value={stockFilter}
              onValueChange={(v) => setStockFilter(v as typeof stockFilter)}
            >
              <SelectTrigger id="filter-stock" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="inStock">Tersedia</SelectItem>
                <SelectItem value="outOfStock">Habis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="filter-min-price">Harga min</Label>
              <Input
                id="filter-min-price"
                type="number"
                min={0}
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-max-price">Harga max</Label>
              <Input
                id="filter-max-price"
                type="number"
                min={0}
                placeholder="999999"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button
            type="button"
            className="bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
            onClick={handleApply}
          >
            Terapkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
