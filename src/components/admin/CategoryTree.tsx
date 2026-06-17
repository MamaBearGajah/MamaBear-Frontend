"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  FolderPlus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import CategoryFormDialog from "@/components/admin/CategoryFormDialog";
import { deleteCategory, updateCategory } from "@/lib/api/categories";
import { handleApiError } from "@/lib/errorHandler";
import type { CategoryTreeNode } from "@/lib/categories/buildCategoryTree";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

type CategoryTreeProps = {
  tree: CategoryTreeNode[];
  flatCategories: Category[];
};

function patchTreeActive(
  nodes: CategoryTreeNode[],
  id: string,
  isActive: boolean,
): CategoryTreeNode[] {
  return nodes.map((node) => ({
    ...node,
    isActive: node.id === id ? isActive : node.isActive,
    children: patchTreeActive(node.children, id, isActive),
  }));
}

function CategoryTreeNodeRow({
  node,
  depth,
  flatCategories,
  tree,
  onEdit,
  onAddChild,
  onDelete,
  onToggleActive,
}: {
  node: CategoryTreeNode;
  depth: number;
  flatCategories: Category[];
  tree: CategoryTreeNode[];
  onEdit: (category: Category) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (category: Category) => void;
  onToggleActive: (category: Category, isActive: boolean) => void;
}) {
  const hasChildren = node.children.length > 0;
  const [expanded, setExpanded] = useState(depth < 1);

  return (
    <li>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2.5",
          !node.isActive && "opacity-70",
        )}
        style={{ marginLeft: depth * 20 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded p-0.5 text-muted-foreground hover:text-foreground"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={cn(
                "size-4 transition-transform",
                expanded && "rotate-90",
              )}
            />
          </button>
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-foreground">{node.name}</p>
            {!node.isActive ? (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                Inactive
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            /{node.slug}
            {typeof node.productCount === "number"
              ? ` · ${node.productCount} products`
              : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={node.isActive}
            onCheckedChange={(checked) => onToggleActive(node, checked)}
            aria-label={`Toggle ${node.name}`}
          />

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => onAddChild(node.id)}
            aria-label={`Add subcategory to ${node.name}`}
          >
            <FolderPlus className="size-4" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => onEdit(node)}
            aria-label={`Edit ${node.name}`}
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-8 text-red-500 hover:text-red-600"
            onClick={() => onDelete(node)}
            aria-label={`Delete ${node.name}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {hasChildren && expanded ? (
        <ul className="mt-2 space-y-2">
          {node.children.map((child) => (
            <CategoryTreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              flatCategories={flatCategories}
              tree={tree}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function CategoryTree({ tree, flatCategories }: CategoryTreeProps) {
  const router = useRouter();
  const [treeState, setTreeState] = useState(tree);
  const [pending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  useEffect(() => {
    setTreeState(tree);
  }, [tree]);

  const refresh = () => router.refresh();

  const openCreate = (parentId: string | null = null) => {
    setFormMode("create");
    setEditingCategory(null);
    setDefaultParentId(parentId);
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setFormMode("edit");
    setEditingCategory(category);
    setDefaultParentId(null);
    setFormOpen(true);
  };

  const handleToggleActive = (category: Category, isActive: boolean) => {
    setTreeState((current) => patchTreeActive(current, category.id, isActive));

    startTransition(async () => {
      try {
        const updated = await updateCategory(category.id, { isActive });
        const nextActive = updated.isActive ?? isActive;
        setTreeState((current) =>
          patchTreeActive(current, category.id, nextActive),
        );
        toast.success(
          nextActive ? "Category activated" : "Category deactivated",
        );
      } catch (error) {
        setTreeState((current) =>
          patchTreeActive(current, category.id, category.isActive),
        );
        handleApiError(error);
      }
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      try {
        await deleteCategory(deleteTarget.id);
        toast.success("Category deleted successfully.");
        setDeleteTarget(null);
        refresh();
      } catch (error) {
        handleApiError(error);
      }
    });
  };

  if (treeState.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <p className="text-muted-foreground">No categories yet.</p>
        <Button
          type="button"
          className="mt-4 bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
          onClick={() => openCreate()}
        >
          <Plus className="mr-2 size-4" />
          Add Category
        </Button>

        <CategoryFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          mode={formMode}
          tree={treeState}
          flatCategories={flatCategories}
          category={editingCategory}
          defaultParentId={defaultParentId}
          onSuccess={refresh}
        />
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          type="button"
          className="bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
          onClick={() => openCreate()}
        >
          <Plus className="mr-2 size-4" />
          Add Category
        </Button>
      </div>

      <ul className="space-y-2">
        {treeState.map((node) => (
          <CategoryTreeNodeRow
            key={node.id}
            node={node}
            depth={0}
            flatCategories={flatCategories}
            tree={treeState}
            onEdit={openEdit}
            onAddChild={(parentId) => openCreate(parentId)}
            onDelete={setDeleteTarget}
            onToggleActive={handleToggleActive}
          />
        ))}
      </ul>

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        tree={treeState}
        flatCategories={flatCategories}
        category={editingCategory}
        defaultParentId={defaultParentId}
        onSuccess={refresh}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete category?"
        description={
          deleteTarget
            ? `Category "${deleteTarget.name}" will be permanently deleted.`
            : undefined
        }
        confirmLabel="Delete"
        variant="destructive"
        loading={pending}
        onConfirm={handleDelete}
      />
    </>
  );
}
