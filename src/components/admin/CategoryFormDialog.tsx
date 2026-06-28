"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCategory, updateCategory } from "@/lib/api/categories";
import {
  collectDescendantIds,
  findCategoryNode,
  type CategoryTreeNode,
} from "@/lib/categories/buildCategoryTree";
import { handleApiError } from "@/lib/errorHandler";
import {
  categoryFormSchema,
  formValuesToCategoryPayload,
  slugifyCategoryName,
  type CategoryFormValues,
} from "@/lib/validations/category.schema";
import type { Category } from "@/types";

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  tree: CategoryTreeNode[];
  flatCategories: Category[];
  category?: Category | null;
  defaultParentId?: string | null;
  onSuccess?: () => void;
};

const EMPTY_FORM: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  parentId: null,
  imageUrl: "",
  sortOrder: 0,
  isActive: true,
};

export default function CategoryFormDialog({
  open,
  onOpenChange,
  mode,
  tree,
  flatCategories,
  category,
  defaultParentId,
  onSuccess,
}: CategoryFormDialogProps) {
  const [pending, startTransition] = useTransition();
  const [values, setValues] = useState<CategoryFormValues>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const parentOptions = useMemo(() => {
    if (mode === "edit" && category) {
      const node = findCategoryNode(tree, category.id);
      const blocked = node ? collectDescendantIds(node) : new Set([category.id]);
      return flatCategories.filter((item) => !blocked.has(item.id));
    }
    return flatCategories;
  }, [category, flatCategories, mode, tree]);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && category) {
      setValues({
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
        parentId: category.parentId ?? null,
        imageUrl: category.imageUrl ?? "",
        sortOrder: category.sortOrder ?? 0,
        isActive: category.isActive,
      });
      setSlugTouched(true);
    } else {
      setValues({
        ...EMPTY_FORM,
        parentId: defaultParentId ?? null,
      });
      setSlugTouched(false);
    }
    setFieldErrors({});
  }, [open, mode, category, defaultParentId]);

  const handleNameChange = (name: string) => {
    setValues((current) => ({
      ...current,
      name,
      slug: slugTouched ? current.slug : slugifyCategoryName(name),
    }));
  };

  const handleSubmit = () => {
    const parsed = categoryFormSchema.safeParse(values);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString();
        if (key) errors[key] = issue.message;
      });
      setFieldErrors(errors);
      toast.error("Please fix the validation errors.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = formValuesToCategoryPayload(parsed.data);
        if (mode === "edit" && category) {
          await updateCategory(category.id, payload);
          toast.success("Category updated successfully.");
        } else {
          await createCategory(payload);
          toast.success("Category created successfully.");
        }
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        handleApiError(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={values.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Category name"
            />
            {fieldErrors.name ? (
              <p className="text-sm text-red-500">{fieldErrors.name}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category-slug">Slug</Label>
            <Input
              id="category-slug"
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setValues((current) => ({ ...current, slug: e.target.value }));
              }}
              placeholder="category-slug"
            />
            {fieldErrors.slug ? (
              <p className="text-sm text-red-500">{fieldErrors.slug}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category-parent">Parent</Label>
            <Select
              value={values.parentId ?? "root"}
              onValueChange={(value) =>
                setValues((current) => ({
                  ...current,
                  parentId: value === "root" ? null : value,
                }))
              }
            >
              <SelectTrigger id="category-parent">
                <SelectValue placeholder="No parent (root)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">No parent (root)</SelectItem>
                {parentOptions.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category-description">Description</Label>
            <Input
              id="category-description"
              value={values.description ?? ""}
              onChange={(e) =>
                setValues((current) => ({
                  ...current,
                  description: e.target.value,
                }))
              }
              placeholder="Optional"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category-image">Image URL</Label>
            <Input
              id="category-image"
              value={values.imageUrl ?? ""}
              onChange={(e) =>
                setValues((current) => ({ ...current, imageUrl: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category-sort">Sort order</Label>
            <Input
              id="category-sort"
              type="number"
              min={0}
              value={values.sortOrder ?? 0}
              onChange={(e) =>
                setValues((current) => ({
                  ...current,
                  sortOrder: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <Label htmlFor="category-active">Active</Label>
            <Switch
              id="category-active"
              checked={values.isActive}
              onCheckedChange={(checked) =>
                setValues((current) => ({ ...current, isActive: checked }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={pending}
            className="bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
            onClick={handleSubmit}
          >
            {pending ? "Saving…" : mode === "edit" ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
