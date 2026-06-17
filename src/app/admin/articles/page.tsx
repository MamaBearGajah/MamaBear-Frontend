"use client";

/**
 * FIX: src/app/admin/articles/page.tsx
 *
 * Bugs yang diperbaiki:
 * 1. Duplicate import `User` dari lucide-react (3x) → rename ke UserIcon
 * 2. `User` dari @/types konflik dengan `User` lucide → pakai alias UserIcon
 * 3. `setauthorId` (lowercase a) dipanggil sebagai `setAuthorId` di form → konsistenkan
 * 4. `handleUpdateBlog(selectedBlogId)` — selectedBlogId bisa null → add null guard
 * 5. Import `apiClient` tidak dipakai → hapus
 * 6. `console.log` di render body → hapus
 * 7. Status badge styling yang ter-comment out → aktifkan
 * 8. Tambah toast (sonner) menggantikan alert()
 * 9. `BlogStatus` tambah type assertion yang aman untuk status setter
 */

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createBlog, getAllBlogs, updateBlog, deleteBlog } from "@/lib/api/blog";
import {
  User as UserType,
  BlogCreateListParams,
  BlogUpdateListParams,
  BlogList,
  BlogStatus,
} from "@/types";
import { mockBlogs } from "@/lib/blog/articlesData";
import {
  CalendarDays,
  Eye,
  FileText,
  Pencil,
  Trash2,
  User as UserIcon,
  Newspaper,
  Plus,
  Loader2,
} from "lucide-react";

const BLOG_STATUSES: BlogStatus[] = ["draft", "published"];

const MOCK_USERS: UserType[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Alex Tan",
    email: "alex@example.com",
    role: "admin",
    isVerified: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

const EMPTY_CREATE_FORM: BlogCreateListParams = {
  title: "",
  authorId: "",
  slug: "",
  content: "",
  excerpt: "",
  coverImage: "",
  status: "draft",
};

export default function AdminArticlesPage() {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // FIX: Satu nama konsisten — setAuthorId (bukan setauthorId)
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<BlogStatus>("draft");

  const [form, setForm] = useState<BlogCreateListParams>(EMPTY_CREATE_FORM);
  const [blog, setBlog] = useState<BlogList[]>([]);

  // ================= FETCH BLOGS =================
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const fetchedBlogs = await getAllBlogs();
        setBlog(
          Array.isArray(fetchedBlogs) && fetchedBlogs.length > 0
            ? fetchedBlogs
            : mockBlogs
        );
      } catch {
        setBlog(mockBlogs);
      }
    }
    fetchBlogs();
  }, []);

  // ================= FETCH USERS =================
  useEffect(() => {
    // TODO: ganti dengan API call ke /users ketika endpoint tersedia
    setUsers(MOCK_USERS);
  }, []);

  // ================= CREATE BLOG =================
  const handleSubmit = async () => {
    if (!form.title || !form.slug || !form.content) {
      toast.error("Title, slug, dan content wajib diisi");
      return;
    }

    setIsSaving(true);
    try {
      const created = await createBlog(form);
      toast.success("Blog berhasil dibuat!");
      setOpenCreateModal(false);
      setForm(EMPTY_CREATE_FORM);
      // Refresh list
      setBlog((prev) => [created as unknown as BlogList, ...prev]);
    } catch (err) {
      console.error("Create blog failed:", err);
      toast.error("Gagal membuat blog. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  // ================= UPDATE BLOG =================
  const handleUpdateBlog = async () => {
    // FIX: null guard untuk selectedBlogId
    if (!selectedBlogId) return;

    if (!title || !slug) {
      toast.error("Title dan slug wajib diisi");
      return;
    }

    setIsSaving(true);
    try {
      const payload: BlogUpdateListParams = {
        title,
        authorId,
        slug,
        content,
        excerpt,
        coverImage,
        status,
      };

      await updateBlog(selectedBlogId, payload);
      toast.success("Blog berhasil diperbarui!");
      setOpenUpdateModal(false);

      // Refresh list
      setBlog((prev) =>
        prev.map((b) =>
          b.id === selectedBlogId ? { ...b, ...payload } : b
        )
      );
    } catch (err) {
      console.error("Failed to update blog:", err);
      toast.error("Gagal memperbarui blog.");
    } finally {
      setIsSaving(false);
    }
  };

  // ================= DELETE BLOG =================
  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    try {
      await deleteBlog(id);
      toast.success("Blog dihapus");
      setBlog((prev) => prev.filter((b) => b.id !== id));
    } catch {
      toast.error("Gagal menghapus blog");
    }
  };

  // ================= OPEN EDIT MODAL =================
  const openEdit = (item: BlogList) => {
    setSelectedBlogId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setSlug(item.slug);
    setExcerpt(item.excerpt);
    setCoverImage(item.coverImage);
    // FIX: konsisten pakai setAuthorId
    setAuthorId(item.authorId);
    setStatus(item.status);
    setOpenUpdateModal(true);
  };

  // ================= HELPERS =================
  const statusBadge = (s: BlogStatus) => {
    const cls =
      s === "published"
        ? "bg-green-100 text-green-800"
        : s === "cancelled"
          ? "bg-gray-100 text-gray-600"
          : "bg-yellow-100 text-yellow-800";
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>
        {s}
      </span>
    );
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="p-5">
      {/* ────────────────── UPDATE MODAL ────────────────── */}
      {openUpdateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setOpenUpdateModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenUpdateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Update Blog</h2>

            <div className="space-y-3">
              {[
                { label: "Title", val: title, set: setTitle, id: "u-title" },
                { label: "Slug", val: slug, set: setSlug, id: "u-slug" },
                { label: "Cover Image URL", val: coverImage, set: setCoverImage, id: "u-cover" },
              ].map(({ label, val, set, id }) => (
                <div key={id}>
                  <label htmlFor={id} className="block mb-1 font-medium text-sm">
                    {label}
                  </label>
                  <input
                    type="text"
                    id={id}
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="u-author" className="block mb-1 font-medium text-sm">
                  Author
                </label>
                <select
                  id="u-author"
                  value={authorId}
                  // FIX: setAuthorId (bukan setauthorId)
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full border p-2 rounded text-sm"
                >
                  <option value="">Select Author</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="u-excerpt" className="block mb-1 font-medium text-sm">
                  Excerpt
                </label>
                <textarea
                  id="u-excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full border p-2 rounded text-sm"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="u-content" className="block mb-1 font-medium text-sm">
                  Content
                </label>
                <textarea
                  id="u-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border p-2 rounded text-sm"
                  rows={8}
                />
              </div>

              <div>
                <label htmlFor="u-status" className="block mb-1 font-medium text-sm">
                  Status
                </label>
                <select
                  id="u-status"
                  value={status}
                  // FIX: cast yang aman dengan type guard
                  onChange={(e) => {
                    const val = e.target.value;
                    if (BLOG_STATUSES.includes(val as BlogStatus)) {
                      setStatus(val as BlogStatus);
                    }
                  }}
                  className="w-full border p-2 rounded text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setOpenUpdateModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleUpdateBlog}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── HEADER ────────────────── */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-pink-600" />
          <h1 className="text-xl font-bold">
            Articles{" "}
            <span className="text-sm font-normal text-gray-500">
              ({blog.length})
            </span>
          </h1>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition text-sm"
          onClick={() => {
            setForm(EMPTY_CREATE_FORM);
            setOpenCreateModal(true);
          }}
        >
          <Plus size={16} />
          Add Article
        </button>
      </div>

      {/* ────────────────── BLOG LIST ────────────────── */}
      {blog.length > 0 ? (
        <div className="space-y-3">
          {blog.map((item) => (
            <div
              key={item.id}
              className="grid items-stretch bg-white border rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
              style={{ gridTemplateColumns: "112px 1fr auto", borderColor: "#e5e7eb" }}
            >
              {/* Cover image */}
              <div className="w-28 h-24 shrink-0 bg-gray-50 flex items-center justify-center">
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText size={24} className="text-gray-300" />
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col gap-1.5 px-4 py-3 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {item.title}
                  </p>
                  {statusBadge(item.status)}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {item.content?.replace(/#{1,6}\s|(\*+)/g, "").slice(0, 120)}…
                </p>
                <div className="flex items-center gap-4 mt-auto pt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    {/* FIX: UserIcon (bukan User yang konflik) */}
                    <UserIcon size={11} /> {item.authorId}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <CalendarDays size={11} />
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye size={11} /> {item.viewCount?.toLocaleString() ?? 0}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-center gap-2 px-4">
                <button
                  onClick={() => openEdit(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBlog(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">Belum ada artikel.</p>
      )}

      {/* ────────────────── CREATE MODAL ────────────────── */}
      {openCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setOpenCreateModal(false)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Create New Blog
              </h2>
              <button
                type="button"
                onClick={() => setOpenCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div>
                <label
                  htmlFor="createtitle"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="createtitle"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                  placeholder="Judul artikel"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="createslug"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  id="createslug"
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                  placeholder="my-blog-post"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="createauthorid"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Author
                </label>
                <select
                  id="createauthorid"
                  value={form.authorId}
                  onChange={(e) => setForm({ ...form, authorId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                >
                  <option value="">Select Author</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="createexcerpt"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Excerpt
                </label>
                <textarea
                  id="createexcerpt"
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                  placeholder="Deskripsi singkat artikel..."
                />
              </div>

              <div>
                <label
                  htmlFor="createcontent"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="createcontent"
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                  placeholder="Tulis konten artikel di sini..."
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="createcoverimage"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Cover Image URL
                </label>
                <input
                  id="createcoverimage"
                  type="text"
                  value={form.coverImage}
                  onChange={(e) =>
                    setForm({ ...form, coverImage: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label
                  htmlFor="createstatus"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="createstatus"
                  value={form.status}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (BLOG_STATUSES.includes(val as BlogStatus)) {
                      setForm({ ...form, status: val as BlogStatus });
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}