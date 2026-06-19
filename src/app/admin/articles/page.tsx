"use client";

/**
 * src/app/admin/articles/page.tsx
 * CRUD blog post: list, create, edit, publish/draft, delete
 * BE: GET /blog (admin: all), POST /blog, PATCH /blog/:id, DELETE /blog/:id
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, Loader2, Newspaper,
  Eye, EyeOff, Search, X, ImagePlus,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import { normalizeApiResponse } from "@/lib/api/normalize-api-response";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ─── Types ───────────────────────────────────────────────────────────────────

type BlogStatus = "draft" | "published";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: BlogStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: BlogStatus;
};

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  status: "draft",
};

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function fmtDate(s?: string) {
  if (!s) return "—";
  try { return format(parseISO(s), "d MMM yyyy", { locale: localeId }); }
  catch { return "—"; }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminArticlesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "form">("list");
  const [editTarget, setEditTarget] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [coverPreview, setCoverPreview] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const slugManualEdited = useRef(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/blog", { params: { limit: 100 } });
      const norm = normalizeApiResponse<BlogPost[]>(res.data);
      setPosts(Array.isArray(norm.data) ? norm.data : []);
    } catch {
      toast.error("Gagal memuat artikel");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setCoverPreview("");
    slugManualEdited.current = false;
    setView("form");
  }

  function openEdit(p: BlogPost) {
    setEditTarget(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? "",
      content: p.content,
      coverImage: p.coverImage ?? "",
      status: p.status,
    });
    setCoverPreview(p.coverImage ?? "");
    slugManualEdited.current = true;
    setView("form");
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: slugManualEdited.current ? f.slug : toSlug(title),
    }));
  }

  // Upload cover image via /media/upload
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Maksimal 5MB"); return; }
    setCoverPreview(URL.createObjectURL(file));
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "blog");
      const res = await apiClient.post("/media/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const data = (res.data?.data ?? res.data) as { imageUrl: string };
      setForm((f) => ({ ...f, coverImage: data.imageUrl }));
      setCoverPreview(data.imageUrl);
      toast.success("Cover berhasil diupload");
    } catch {
      toast.error("Gagal upload cover");
      setCoverPreview("");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  }

  async function handleSave(publishNow = false) {
    if (!form.title.trim()) { toast.error("Judul wajib diisi"); return; }
    if (!form.content.trim()) { toast.error("Konten wajib diisi"); return; }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || toSlug(form.title),
        excerpt: form.excerpt.trim() || undefined,
        content: form.content.trim(),
        coverImage: form.coverImage || undefined,
        status: publishNow ? "published" : form.status,
      };

      if (editTarget) {
        await apiClient.patch(`/blog/${editTarget.id}`, payload);
        toast.success("Artikel diperbarui");
      } else {
        await apiClient.post("/blog", payload);
        toast.success(publishNow ? "Artikel dipublish" : "Draft disimpan");
      }

      setView("list");
      fetchPosts();
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message ?? "Gagal menyimpan artikel");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(p: BlogPost) {
    const newStatus = p.status === "published" ? "draft" : "published";
    try {
      await apiClient.patch(`/blog/${p.id}`, { status: newStatus });
      setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, status: newStatus } : x));
      toast.success(newStatus === "published" ? "Artikel dipublish" : "Artikel dijadikan draft");
    } catch {
      toast.error("Gagal mengubah status");
    }
  }

  async function handleDelete(p: BlogPost) {
    if (!confirm(`Hapus artikel "${p.title}"?`)) return;
    try {
      await apiClient.delete(`/blog/${p.id}`);
      setPosts((prev) => prev.filter((x) => x.id !== p.id));
      toast.success("Artikel dihapus");
    } catch {
      toast.error("Gagal menghapus artikel");
    }
  }

  const filtered = posts.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Form view ────────────────────────────────────────────────────────────

  if (view === "form") {
    return (
      <div className="min-h-full bg-[#FAFAFB] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button onClick={() => setView("list")} className="text-sm text-gray-400 hover:text-gray-700">
                ← Kembali ke daftar
              </button>
              <h1 className="mt-1 text-xl font-semibold text-[#4C3437]">
                {editTarget ? "Edit Artikel" : "Buat Artikel Baru"}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
                {saving && form.status === "draft" ? <Loader2 className="size-4 animate-spin mr-1" /> : null}
                Simpan Draft
              </Button>
              <Button
                onClick={() => handleSave(true)} disabled={saving}
                className="bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
              >
                {saving ? <Loader2 className="size-4 animate-spin mr-1" /> : null}
                Publish
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F1E9EB] bg-white p-6 shadow-sm space-y-5">
            {/* Cover image */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="relative h-48 w-full overflow-hidden rounded-xl border-2 border-dashed border-pink-200 bg-pink-50">
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer rounded-lg bg-white px-3 py-1.5 text-xs font-medium">
                        Ganti
                        <input type="file" accept="image/*" className="sr-only" onChange={handleCoverUpload} />
                      </label>
                      <button onClick={() => { setForm((f) => ({ ...f, coverImage: "" })); setCoverPreview(""); }} className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-red-500">
                        Hapus
                      </button>
                    </div>
                    {uploadingCover && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Loader2 className="size-8 animate-spin text-white" />
                      </div>
                    )}
                  </>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-pink-300 hover:text-pink-400">
                    <ImagePlus className="size-8" />
                    <span className="text-sm">Upload cover image (maks. 5MB)</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={handleCoverUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Judul */}
            <div className="space-y-1">
              <Label>Judul Artikel *</Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Tips Menyusui untuk Ibu Baru"
                className="text-base font-medium"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => { slugManualEdited.current = true; setForm((f) => ({ ...f, slug: e.target.value })); }}
                placeholder="tips-menyusui-ibu-baru"
                className="font-mono text-sm"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1">
              <Label>Excerpt <span className="text-xs text-gray-400">— ringkasan singkat untuk preview</span></Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={2}
                placeholder="Ringkasan singkat artikel..."
              />
            </div>

            {/* Konten */}
            <div className="space-y-1">
              <Label>Konten *</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={16}
                placeholder="Tulis konten artikel di sini... (mendukung Markdown)"
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-400">Mendukung Markdown untuk formatting.</p>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <Label>Status</Label>
              <div className="flex gap-2">
                {(["draft", "published"] as BlogStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${form.status === s ? "border-[#D95A87] bg-pink-50 text-[#D95A87]" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    {s === "draft" ? "Draft" : "Published"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── List view ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full bg-[#FAFAFB] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#4C3437]">Artikel / Blog</h1>
            <p className="mt-1 text-sm text-gray-500">{posts.length} artikel total</p>
          </div>
          <Button onClick={openCreate} className="w-full gap-2 sm:w-auto bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90">
            <Plus className="size-4" /> Tulis Artikel
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-full border border-[#EFE6EA] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#D95A87]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-[#D95A87]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Newspaper className="size-10 mb-3 opacity-40" />
            <p className="text-sm">{search ? `Tidak ada artikel "${search}"` : "Belum ada artikel"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-start gap-4 rounded-2xl border border-[#F1E9EB] bg-white p-4 shadow-sm">
                {/* Cover thumbnail */}
                {p.coverImage ? (
                  <img src={p.coverImage} alt={p.title} className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-pink-50">
                    <Newspaper className="size-6 text-pink-200" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-[#4C3437] line-clamp-1">{p.title}</h3>
                      <p className="mt-0.5 text-xs text-gray-400 font-mono">{p.slug}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {p.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                  {p.excerpt && <p className="mt-1 text-xs text-gray-500 line-clamp-1">{p.excerpt}</p>}
                  <p className="mt-1 text-xs text-gray-400">
                    {p.status === "published" && p.publishedAt ? `Publish: ${fmtDate(p.publishedAt)}` : `Dibuat: ${fmtDate(p.createdAt)}`}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => handleToggleStatus(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" title={p.status === "published" ? "Jadikan draft" : "Publish"}>
                    {p.status === "published" ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                  <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#D95A87]">
                    <Pencil className="size-4" />
                  </button>
                  <button onClick={() => handleDelete(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
