"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { adminHomeBannerApi } from "@/lib/api/homeBanner";
import { normalizeApiResponse } from "@/lib/api/normalize-api-response";
import type { homeBannerParams } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type BannerItem = homeBannerParams & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

type BannerFormState = {
  imageUrl: string;
  altText: string;
  label: string;
  title: string;
  desc: string;
  path: string;
  isActive: boolean;
  sortOrder: number;
  startDate: string;
  endDate: string;
};

const EMPTY_FORM: BannerFormState = {
  imageUrl: "",
  altText: "",
  label: "",
  title: "",
  desc: "",
  path: "",
  isActive: true,
  sortOrder: 0,
  startDate: "",
  endDate: "",
};

function toInputDate(value: unknown): string {
  if (!value) return "";
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapBannerFromApi(raw: unknown): BannerItem {
  const row = (raw ?? {}) as Record<string, unknown>;

  return {
    id: String(row.id ?? row.bannerId ?? ""),
    imageUrl: String(row.imageUrl ?? row.image_url ?? ""),
    altText: String(row.altText ?? row.alt_text ?? ""),
    label: String(row.label ?? ""),
    title: String(row.title ?? ""),
    desc: String(row.desc ?? row.description ?? ""),
    path: String(row.path ?? "/"),
    isActive: Boolean(row.isActive ?? row.is_active ?? false),
    sortOrder: toNumber(row.sortOrder ?? row.sort_order, 0),
    startDate: toInputDate(row.startDate ?? row.start_date),
    endDate: toInputDate(row.endDate ?? row.end_date),
    createdAt: row.createdAt ? String(row.createdAt) : undefined,
    updatedAt: row.updatedAt ? String(row.updatedAt) : undefined,
  };
}

function mapFormFromBanner(banner: BannerItem): BannerFormState {
  return {
    imageUrl: banner.imageUrl,
    altText: banner.altText,
    label: banner.label,
    title: banner.title,
    desc: banner.desc,
    path: banner.path,
    isActive: banner.isActive,
    sortOrder: banner.sortOrder,
    startDate: toInputDate(banner.startDate),
    endDate: toInputDate(banner.endDate),
  };
}

function payloadFromForm(form: BannerFormState): homeBannerParams {
  return {
    imageUrl: form.imageUrl.trim(),
    altText: form.altText.trim(),
    label: form.label.trim(),
    title: form.title.trim(),
    desc: form.desc.trim(),
    path: form.path.trim(),
    isActive: form.isActive,
    sortOrder: Number(form.sortOrder),
    startDate: form.startDate,
    endDate: form.endDate,
  };
}

export default function HomeBannerPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerFormState>(EMPTY_FORM);

  const editingBanner = useMemo(
    () => banners.find((item) => item.id === editingBannerId) ?? null,
    [banners, editingBannerId],
  );

  const fetchBanners = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await adminHomeBannerApi.getAllAdmin();
      const normalized = normalizeApiResponse<unknown>(data);
      const rows = Array.isArray(normalized.data) ? normalized.data : [];
      setBanners(rows.map(mapBannerFromApi).filter((item) => item.id));
    } catch (error) {
      console.error("Failed to fetch banners", error);
      toast.error("Failed to fetch banners");
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBanners();
  }, [fetchBanners]);

  const openCreateModal = () => {
    setMode("create");
    setEditingBannerId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEditModal = (banner: BannerItem) => {
    setMode("edit");
    setEditingBannerId(banner.id);
    setForm(mapFormFromBanner(banner));
    setOpen(true);
  };

  const closeModal = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setForm(EMPTY_FORM);
      setEditingBannerId(null);
      setMode("create");
    }
  };

  const validateForm = (): boolean => {
    if (!form.imageUrl.trim() || !form.altText.trim() || !form.title.trim()) {
      toast.error("Image URL, alt text, and title are required");
      return false;
    }

    if (!form.path.trim()) {
      toast.error("Path is required");
      return false;
    }

    if (!form.startDate || !form.endDate) {
      toast.error("Start date and end date are required");
      return false;
    }

    if (new Date(form.startDate) > new Date(form.endDate)) {
      toast.error("Start date cannot be after end date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    const payload = payloadFromForm(form);
    setIsSubmitting(true);

    try {
      if (mode === "edit" && editingBannerId) {
        await adminHomeBannerApi.update(editingBannerId, payload);
        toast.success("Banner updated");
      } else {
        await adminHomeBannerApi.create(payload);
        toast.success("Banner created");
      }

      closeModal(false);
      await fetchBanners();
    } catch (error) {
      console.error("Failed to save banner", error);
      toast.error("Failed to save banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (banner: BannerItem) => {
    const confirmed = window.confirm(
      `Delete banner \"${banner.title}\"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await adminHomeBannerApi.remove(banner.id);
      toast.success("Banner deleted");
      await fetchBanners();
    } catch (error) {
      console.error("Failed to delete banner", error);
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Home Banner</h1>
          <p className="text-sm text-muted-foreground">
            Manage homepage banners shown in storefront.
          </p>
        </div>

        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="size-4" />
          Add Banner
        </Button>
      </header>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Banner</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sort</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Loading banners...
                </TableCell>
              </TableRow>
            ) : banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No banners found.
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={banner.imageUrl}
                        alt={banner.altText || banner.title}
                        className="h-14 w-24 rounded-md border object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{banner.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{banner.label}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-36 truncate">{banner.path}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        banner.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>{banner.sortOrder}</TableCell>
                  <TableCell>
                    <p className="text-xs text-muted-foreground">
                      {toInputDate(banner.startDate)} to {toInputDate(banner.endDate)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(banner)}
                        className="gap-1"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => void handleDelete(banner)}
                        className="gap-1"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={closeModal}>
        <DialogContent className="max-h-[85vh] w-[92vw] max-w-[92vw] overflow-y-auto sm:w-[60vw] sm:max-w-[60vw]">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add New Banner" : "Edit Banner"}
            </DialogTitle>
            <DialogDescription>
              Fill all banner properties based on homeBannerParams.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, imageUrl: event.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="altText">Alt Text</Label>
                <Input
                  id="altText"
                  value={form.altText}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, altText: event.target.value }))
                  }
                  placeholder="Alt text for image"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={form.label}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, label: event.target.value }))
                  }
                  placeholder="Promo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Banner title"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={form.desc}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, desc: event.target.value }))
                  }
                  placeholder="Banner description"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="path">Path</Label>
                <Input
                  id="path"
                  value={form.path}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, path: event.target.value }))
                  }
                  placeholder="/products or /promotion"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={String(form.sortOrder)}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sortOrder: toNumber(event.target.value, 0),
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border px-3 py-2 sm:mt-7">
                <Label htmlFor="isActive">Active Banner</Label>
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({ ...current, isActive: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, startDate: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, endDate: event.target.value }))
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => closeModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : mode === "create"
                    ? "Create Banner"
                    : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}