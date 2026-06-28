"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import { adminBundleHamperApi } from "@/lib/api/bundleHamper";
import { normalizeApiResponse } from "@/lib/api/normalize-api-response";
import type { bundleHamperParams } from "@/types";

type BundleItem = bundleHamperParams & {
	id: string;
	createdAt?: string;
	updatedAt?: string;
};

type BundleItemRow = {
	productId: string;
	quantity: number;
};

type BundleFormState = {
	name: string;
	slug: string;
	description: string;
	imageUrl: string;
	publicId: string;
	bundlePrice: number;
	discountPrice: number;
	isActive: boolean;
	stock: number;
	sortOrder: number;
	startDate: string;
	endDate: string;
	items: BundleItemRow[];
};

const EMPTY_FORM: BundleFormState = {
	name: "",
	slug: "",
	description: "",
	imageUrl: "",
	publicId: "",
	bundlePrice: 0,
	discountPrice: 0,
	isActive: true,
	stock: 0,
	sortOrder: 0,
	startDate: "",
	endDate: "",
	items: [{ productId: "", quantity: 1 }],
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

function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function mapBundleFromApi(raw: unknown): BundleItem {
	const row = (raw ?? {}) as Record<string, unknown>;
	const itemsRaw = Array.isArray(row.items) ? row.items : [];

	return {
		id: String(row.id ?? row.bundleId ?? ""),
		name: String(row.name ?? ""),
		slug: String(row.slug ?? ""),
		description: String(row.description ?? row.desc ?? ""),
		imageUrl: String(row.imageUrl ?? row.image_url ?? ""),
		publicId: String(row.publicId ?? row.public_id ?? ""),
		bundlePrice: toNumber(row.bundlePrice ?? row.bundle_price, 0),
		discountPrice: toNumber(row.discountPrice ?? row.discount_price, 0),
		isActive: Boolean(row.isActive ?? row.is_active ?? false),
		stock: toNumber(row.stock, 0),
		sortOrder: toNumber(row.sortOrder ?? row.sort_order, 0),
		startDate: toInputDate(row.startDate ?? row.start_date),
		endDate: toInputDate(row.endDate ?? row.end_date),
		items: itemsRaw.map((item) => {
			const value = (item ?? {}) as Record<string, unknown>;
			return {
				productId: String(value.productId ?? value.product_id ?? ""),
				quantity: toNumber(value.quantity ?? value.qty, 1),
			};
		}),
		createdAt: row.createdAt ? String(row.createdAt) : undefined,
		updatedAt: row.updatedAt ? String(row.updatedAt) : undefined,
	};
}

function mapFormFromBundle(bundle: BundleItem): BundleFormState {
	return {
		name: bundle.name,
		slug: bundle.slug,
		description: bundle.description,
		imageUrl: bundle.imageUrl,
		publicId: bundle.publicId,
		bundlePrice: bundle.bundlePrice,
		discountPrice: bundle.discountPrice,
		isActive: bundle.isActive,
		stock: bundle.stock,
		sortOrder: bundle.sortOrder,
		startDate: toInputDate(bundle.startDate),
		endDate: toInputDate(bundle.endDate),
		items:
			bundle.items.length > 0
				? bundle.items.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
				}))
				: [{ productId: "", quantity: 1 }],
	};
}

function payloadFromForm(form: BundleFormState): bundleHamperParams {
	return {
		name: form.name.trim(),
		slug: form.slug.trim(),
		description: form.description.trim(),
		imageUrl: form.imageUrl.trim(),
		publicId: form.publicId.trim(),
		bundlePrice: Number(form.bundlePrice),
		discountPrice: Number(form.discountPrice),
		isActive: form.isActive,
		stock: Number(form.stock),
		sortOrder: Number(form.sortOrder),
		startDate: form.startDate,
		endDate: form.endDate,
		items: form.items
			.filter((item) => item.productId.trim())
			.map((item) => ({
				productId: item.productId.trim(),
				quantity: Number(item.quantity),
			})),
	};
}

export default function BundlesPage() {
	const [bundles, setBundles] = useState<BundleItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<"create" | "edit">("create");
	const [editingBundleId, setEditingBundleId] = useState<string | null>(null);
	const [form, setForm] = useState<BundleFormState>(EMPTY_FORM);

	const fetchBundles = useCallback(async () => {
		setIsLoading(true);
		try {
			const { data } = await adminBundleHamperApi.getAllAdmin();
			const normalized = normalizeApiResponse<unknown>(data);
			const rows = Array.isArray(normalized.data) ? normalized.data : [];
			setBundles(rows.map(mapBundleFromApi).filter((item) => item.id));
		} catch (error) {
			console.error("Failed to fetch bundles", error);
			toast.error("Failed to fetch bundles");
			setBundles([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchBundles();
	}, [fetchBundles]);

	const openCreateModal = () => {
		setMode("create");
		setEditingBundleId(null);
		setForm(EMPTY_FORM);
		setOpen(true);
	};

	const openEditModal = (bundle: BundleItem) => {
		setMode("edit");
		setEditingBundleId(bundle.id);
		setForm(mapFormFromBundle(bundle));
		setOpen(true);
	};

	const closeModal = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (!nextOpen) {
			setForm(EMPTY_FORM);
			setEditingBundleId(null);
			setMode("create");
		}
	};

	const validateForm = (): boolean => {
		if (!form.name.trim() || !form.slug.trim() || !form.description.trim()) {
			toast.error("Name, slug, and description are required");
			return false;
		}

		if (!form.imageUrl.trim() || !form.publicId.trim()) {
			toast.error("Image URL and public ID are required");
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

		const validItems = form.items.filter((item) => item.productId.trim());
		if (validItems.length === 0) {
			toast.error("At least one bundle item is required");
			return false;
		}

		if (validItems.some((item) => item.quantity <= 0)) {
			toast.error("Bundle item quantity must be greater than zero");
			return false;
		}

		return true;
	};

	const updateItemRow = (index: number, patch: Partial<BundleItemRow>) => {
		setForm((current) => ({
			...current,
			items: current.items.map((item, itemIndex) =>
				itemIndex === index ? { ...item, ...patch } : item,
			),
		}));
	};

	const addItemRow = () => {
		setForm((current) => ({
			...current,
			items: [...current.items, { productId: "", quantity: 1 }],
		}));
	};

	const removeItemRow = (index: number) => {
		setForm((current) => {
			const nextItems = current.items.filter((_, itemIndex) => itemIndex !== index);
			return {
				...current,
				items: nextItems.length > 0 ? nextItems : [{ productId: "", quantity: 1 }],
			};
		});
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!validateForm()) return;

		const payload = payloadFromForm(form);
		setIsSubmitting(true);

		try {
			if (mode === "edit" && editingBundleId) {
				await adminBundleHamperApi.update(editingBundleId, payload);
				toast.success("Bundle updated");
			} else {
				await adminBundleHamperApi.create(payload);
				toast.success("Bundle created");
			}

			closeModal(false);
			await fetchBundles();
		} catch (error) {
			console.error("Failed to save bundle", error);
			toast.error("Failed to save bundle");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (bundle: BundleItem) => {
		const confirmed = window.confirm(
			`Delete bundle \"${bundle.name}\"? This action cannot be undone.`,
		);
		if (!confirmed) return;

		try {
			await adminBundleHamperApi.remove(bundle.id);
			toast.success("Bundle deleted");
			await fetchBundles();
		} catch (error) {
			console.error("Failed to delete bundle", error);
			toast.error("Failed to delete bundle");
		}
	};

	return (
		<div className="space-y-6 p-4 sm:p-6">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">Bundles</h1>
					<p className="text-sm text-muted-foreground">
						Manage bundle hampers shown in storefront.
					</p>
				</div>

				<Button onClick={openCreateModal} className="gap-2">
					<Plus className="size-4" />
					Add Bundle
				</Button>
			</header>

			<div className="overflow-hidden rounded-xl border bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Bundle</TableHead>
							<TableHead>Slug</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Stock</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Items</TableHead>
							<TableHead>Period</TableHead>
							<TableHead className="text-right">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
									Loading bundles...
								</TableCell>
							</TableRow>
						) : bundles.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
									No bundles found.
								</TableCell>
							</TableRow>
						) : (
							bundles.map((bundle) => (
								<TableRow key={bundle.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<img
												src={bundle.imageUrl}
												alt={bundle.name}
												className="h-14 w-24 rounded-md border object-cover"
												onError={(event) => {
													event.currentTarget.style.display = "none";
												}}
											/>
											<div className="min-w-0">
												<p className="truncate font-medium text-foreground">{bundle.name}</p>
												<p className="truncate text-xs text-muted-foreground">
													{bundle.description}
												</p>
											</div>
										</div>
									</TableCell>
									<TableCell className="max-w-32 truncate">{bundle.slug}</TableCell>
									<TableCell>
										<div className="text-sm">
											<p className="font-medium">Rp {bundle.bundlePrice.toLocaleString("id-ID")}</p>
											<p className="text-xs text-muted-foreground">
												Discount: Rp {bundle.discountPrice.toLocaleString("id-ID")}
											</p>
										</div>
									</TableCell>
									<TableCell>{bundle.stock}</TableCell>
									<TableCell>
										<span
											className={`rounded-full px-2 py-1 text-xs font-medium ${
												bundle.isActive
													? "bg-emerald-100 text-emerald-700"
													: "bg-slate-100 text-slate-600"
											}`}
										>
											{bundle.isActive ? "Active" : "Inactive"}
										</span>
									</TableCell>
									<TableCell>{bundle.items.length}</TableCell>
									<TableCell>
										<p className="text-xs text-muted-foreground">
											{toInputDate(bundle.startDate)} to {toInputDate(bundle.endDate)}
										</p>
									</TableCell>
									<TableCell>
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => openEditModal(bundle)}
												className="gap-1"
											>
												<Pencil className="size-3.5" />
												Edit
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => void handleDelete(bundle)}
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
							{mode === "create" ? "Add New Bundle" : "Edit Bundle"}
						</DialogTitle>
						<DialogDescription>
							Fill all bundle properties based on bundleHamperParams.
						</DialogDescription>
					</DialogHeader>

					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={form.name}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											name: event.target.value,
											slug: current.slug ? current.slug : slugify(event.target.value),
										}))
									}
									placeholder="Bundle hamper name"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="slug">Slug</Label>
								<Input
									id="slug"
									value={form.slug}
									onChange={(event) =>
										setForm((current) => ({ ...current, slug: slugify(event.target.value) }))
									}
									placeholder="bundle-hamper"
								/>
							</div>

							<div className="space-y-2 sm:col-span-2">
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									value={form.description}
									onChange={(event) =>
										setForm((current) => ({ ...current, description: event.target.value }))
									}
									placeholder="Bundle description"
								/>
							</div>

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
								<Label htmlFor="publicId">Public ID</Label>
								<Input
									id="publicId"
									value={form.publicId}
									onChange={(event) =>
										setForm((current) => ({ ...current, publicId: event.target.value }))
									}
									placeholder="cloudinary public id"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="bundlePrice">Bundle Price</Label>
								<Input
									id="bundlePrice"
									type="number"
									value={String(form.bundlePrice)}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											bundlePrice: toNumber(event.target.value, 0),
										}))
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="discountPrice">Discount Price</Label>
								<Input
									id="discountPrice"
									type="number"
									value={String(form.discountPrice)}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											discountPrice: toNumber(event.target.value, 0),
										}))
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="stock">Stock</Label>
								<Input
									id="stock"
									type="number"
									value={String(form.stock)}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											stock: toNumber(event.target.value, 0),
										}))
									}
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

							<div className="flex items-center justify-between rounded-lg border px-3 py-2 sm:col-span-2">
								<Label htmlFor="isActive">Active Bundle</Label>
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

						<div className="space-y-3 rounded-xl border p-4">
							<div className="flex items-center justify-between gap-3">
								<div>
									<Label>Items</Label>
									<p className="text-xs text-muted-foreground">
										Add at least one product and quantity for this bundle.
									</p>
								</div>
								<Button type="button" variant="outline" size="sm" onClick={addItemRow}>
									<Plus className="size-4" />
									Add Item
								</Button>
							</div>

							<div className="space-y-3">
								{form.items.map((item, index) => (
									<div key={`${index}-${item.productId}`} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_140px_auto]">
										<div className="space-y-2">
											<Label htmlFor={`item-product-${index}`}>Product ID</Label>
											<Input
												id={`item-product-${index}`}
												value={item.productId}
												onChange={(event) =>
													updateItemRow(index, { productId: event.target.value })
												}
												placeholder="Product UUID"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor={`item-qty-${index}`}>Quantity</Label>
											<Input
												id={`item-qty-${index}`}
												type="number"
												min={1}
												value={String(item.quantity)}
												onChange={(event) =>
													updateItemRow(index, {
														quantity: toNumber(event.target.value, 1),
													})
												}
											/>
										</div>

										<div className="flex items-end">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => removeItemRow(index)}
												className="gap-1"
											>
												<Trash2 className="size-3.5" />
												Remove
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>

						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => closeModal(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting
									? mode === "create"
										? "Creating..."
										: "Saving..."
									: mode === "create"
										? "Create Bundle"
										: "Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
