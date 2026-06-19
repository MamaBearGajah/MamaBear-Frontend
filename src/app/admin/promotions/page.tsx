"use client";

/**
 * src/app/admin/promotions/page.tsx — RESPONSIVE FIX
 * grid-cols-2 tanpa breakpoint → sm:grid-cols-2, default 1 col di mobile
 * benefits grid → flex-wrap di mobile
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Megaphone, Eye, EyeOff, ImagePlus, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import { promotionApi, type Promotion, type CreatePromotionPayload, type PromotionStatus } from "@/lib/api/promotion";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}
function fmtDate(s?: string) {
  if (!s) return "—";
  try { return format(parseISO(s), "d MMM yyyy", { locale: localeId }); } catch { return "—"; }
}
const STATUS_LABEL: Record<PromotionStatus, string> = { draft: "Draft", active: "Aktif", ended: "Berakhir" };
const STATUS_COLOR: Record<PromotionStatus, string> = {
  draft: "bg-gray-100 text-gray-600", active: "bg-green-100 text-green-700", ended: "bg-red-100 text-red-600",
};

type FormState = {
  title: string; slug: string; badgeText: string; heroImageUrl: string; heroBundleId: string;
  status: PromotionStatus; startDate: string; endDate: string; extraText: string;
  sections: { title: string; body: string; imageUrl: string }[];
  benefits: { icon: string; title: string; description: string }[];
};
const EMPTY_FORM: FormState = {
  title: "", slug: "", badgeText: "", heroImageUrl: "", heroBundleId: "",
  status: "draft", startDate: "", endDate: "", extraText: "",
  sections: [{ title: "", body: "", imageUrl: "" }],
  benefits: [{ icon: "✓", title: "", description: "" }],
};

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editTarget, setEditTarget] = useState<Promotion | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [heroPreview, setHeroPreview] = useState("");
  const slugManual = useRef(false);

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    try { setPromos(await promotionApi.getAll()); }
    catch { toast.error("Gagal memuat promosi"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPromos(); }, [fetchPromos]);

  function openCreate() { setEditTarget(null); setForm(EMPTY_FORM); setHeroPreview(""); slugManual.current = false; setView("form"); }
  function openEdit(p: Promotion) {
    setEditTarget(p);
    setForm({ title: p.title, slug: p.slug, badgeText: p.badgeText ?? "", heroImageUrl: p.heroImageUrl ?? "", heroBundleId: p.heroBundleId ?? "", status: p.status, startDate: p.startDate?.slice(0, 10) ?? "", endDate: p.endDate?.slice(0, 10) ?? "", extraText: p.extraText ?? "", sections: p.sections.length > 0 ? p.sections.map((s) => ({ title: s.title, body: s.body, imageUrl: s.imageUrl ?? "" })) : [{ title: "", body: "", imageUrl: "" }], benefits: p.benefits.length > 0 ? p.benefits.map((b) => ({ icon: b.icon ?? "✓", title: b.title, description: b.description ?? "" })) : [{ icon: "✓", title: "", description: "" }] });
    setHeroPreview(p.heroImageUrl ?? ""); slugManual.current = true; setView("form");
  }

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Maks 5MB"); return; }
    setHeroPreview(URL.createObjectURL(file)); setUploadingHero(true);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("folder", "promotions");
      const res = await apiClient.post("/media/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const imageUrl = (res.data?.data ?? res.data)?.imageUrl as string;
      setForm((f) => ({ ...f, heroImageUrl: imageUrl })); setHeroPreview(imageUrl);
    } catch { toast.error("Gagal upload gambar"); setHeroPreview(""); }
    finally { setUploadingHero(false); e.target.value = ""; }
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("Judul wajib diisi"); return; }
    setSaving(true);
    try {
      const payload: CreatePromotionPayload = { title: form.title.trim(), slug: form.slug.trim() || toSlug(form.title), badgeText: form.badgeText.trim() || undefined, heroImageUrl: form.heroImageUrl || undefined, heroBundleId: form.heroBundleId.trim() || undefined, status: form.status, startDate: form.startDate || undefined, endDate: form.endDate || undefined, extraText: form.extraText.trim() || undefined, sections: form.sections.filter((s) => s.title.trim() || s.body.trim()).map((s, i) => ({ ...s, sortOrder: i })), benefits: form.benefits.filter((b) => b.title.trim()).map((b, i) => ({ ...b, sortOrder: i })) };
      if (editTarget) { await promotionApi.update(editTarget.id, payload); toast.success("Promosi diperbarui"); }
      else { await promotionApi.create(payload); toast.success("Promosi dibuat"); }
      setView("list"); fetchPromos();
    } catch (e: any) { toast.error(e?.response?.data?.error?.message ?? "Gagal menyimpan"); }
    finally { setSaving(false); }
  }

  async function handleDelete(p: Promotion) {
    if (!confirm(`Hapus promosi "${p.title}"?`)) return;
    try { await promotionApi.remove(p.id); setPromos((prev) => prev.filter((x) => x.id !== p.id)); toast.success("Promosi dihapus"); }
    catch { toast.error("Gagal menghapus"); }
  }

  async function toggleStatus(p: Promotion) {
    const next: PromotionStatus = p.status === "active" ? "ended" : "active";
    try { await promotionApi.update(p.id, { status: next }); setPromos((prev) => prev.map((x) => x.id === p.id ? { ...x, status: next } : x)); toast.success(`Status → ${STATUS_LABEL[next]}`); }
    catch { toast.error("Gagal mengubah status"); }
  }

  if (view === "form") {
    return (
      <div className="min-h-full bg-[#FAFAFB] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button onClick={() => setView("list")} className="text-sm text-gray-400 hover:text-gray-700">← Kembali</button>
              <h1 className="mt-1 text-xl font-semibold text-[#4C3437]">{editTarget ? "Edit Promosi" : "Buat Promosi Baru"}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setView("list")}>Batal</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90">
                {saving && <Loader2 className="size-4 animate-spin mr-1" />} Simpan
              </Button>
            </div>
          </div>

          {/* Info Dasar */}
          <div className="rounded-2xl border border-[#F1E9EB] bg-white p-4 sm:p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Info Dasar</h2>
            {/* ✅ FIX: grid-cols-1 default, sm:grid-cols-2 */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="col-span-1 space-y-1 sm:col-span-2">
                <Label>Judul *</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: slugManual.current ? f.slug : toSlug(e.target.value) }))} placeholder="Flash Sale Akhir Tahun" />
              </div>
              <div className="space-y-1">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={(e) => { slugManual.current = true; setForm((f) => ({ ...f, slug: e.target.value })); }} className="font-mono text-sm" placeholder="flash-sale-akhir-tahun" />
              </div>
              <div className="space-y-1">
                <Label>Badge Text</Label>
                <Input value={form.badgeText} onChange={(e) => setForm((f) => ({ ...f, badgeText: e.target.value }))} placeholder="SALE 50%" />
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PromotionStatus }))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                  <option value="draft">Draft</option><option value="active">Aktif</option><option value="ended">Berakhir</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Hero Bundle ID <span className="text-xs text-gray-400">— opsional</span></Label>
                <Input value={form.heroBundleId} onChange={(e) => setForm((f) => ({ ...f, heroBundleId: e.target.value }))} placeholder="uuid-bundle" />
              </div>
              <div className="space-y-1">
                <Label>Mulai</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Berakhir</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>

            {/* Hero image */}
            <div className="space-y-2">
              <Label>Gambar Hero</Label>
              <div className="relative h-36 w-full overflow-hidden rounded-xl border-2 border-dashed border-pink-200 bg-pink-50">
                {heroPreview ? (
                  <>
                    <img src={heroPreview} alt="Hero" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer rounded-lg bg-white px-3 py-1.5 text-xs font-medium">Ganti<input type="file" accept="image/*" className="sr-only" onChange={handleHeroUpload} /></label>
                      <button onClick={() => { setForm((f) => ({ ...f, heroImageUrl: "" })); setHeroPreview(""); }} className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-red-500">Hapus</button>
                    </div>
                    {uploadingHero && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Loader2 className="size-8 animate-spin text-white" /></div>}
                  </>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-pink-300 hover:text-pink-400">
                    <ImagePlus className="size-7" /><span className="text-sm">Upload gambar hero</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={handleHeroUpload} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="rounded-2xl border border-[#F1E9EB] bg-white p-4 sm:p-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-semibold text-gray-800">Sections Konten</h2>
              <button onClick={() => setForm((f) => ({ ...f, sections: [...f.sections, { title: "", body: "", imageUrl: "" }] }))} className="text-xs text-[#D95A87] hover:underline">+ Tambah</button>
            </div>
            {form.sections.map((s, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-3 sm:p-4 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs font-medium text-gray-500">Section {i + 1}</span>
                  {form.sections.length > 1 && <button onClick={() => setForm((f) => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }))} className="text-red-400 hover:text-red-600"><X className="size-4" /></button>}
                </div>
                <Input placeholder="Judul section" value={s.title} onChange={(e) => setForm((f) => { const sec = [...f.sections]; sec[i] = { ...sec[i], title: e.target.value }; return { ...f, sections: sec }; })} />
                <Textarea rows={3} placeholder="Isi konten..." value={s.body} onChange={(e) => setForm((f) => { const sec = [...f.sections]; sec[i] = { ...sec[i], body: e.target.value }; return { ...f, sections: sec }; })} />
                <Input placeholder="URL gambar (opsional)" value={s.imageUrl} onChange={(e) => setForm((f) => { const sec = [...f.sections]; sec[i] = { ...sec[i], imageUrl: e.target.value }; return { ...f, sections: sec }; })} />
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="rounded-2xl border border-[#F1E9EB] bg-white p-4 sm:p-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-semibold text-gray-800">Benefits</h2>
              <button onClick={() => setForm((f) => ({ ...f, benefits: [...f.benefits, { icon: "✓", title: "", description: "" }] }))} className="text-xs text-[#D95A87] hover:underline">+ Tambah</button>
            </div>
            {form.benefits.map((b, i) => (
              /* ✅ FIX: flex-col di mobile, flex-row di sm+ */
              <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <Input placeholder="✓" value={b.icon} onChange={(e) => setForm((f) => { const ben = [...f.benefits]; ben[i] = { ...ben[i], icon: e.target.value }; return { ...f, benefits: ben }; })} className="w-full sm:w-14 text-center" />
                <Input placeholder="Judul benefit" value={b.title} onChange={(e) => setForm((f) => { const ben = [...f.benefits]; ben[i] = { ...ben[i], title: e.target.value }; return { ...f, benefits: ben }; })} className="flex-1" />
                <div className="flex gap-2 flex-1">
                  <Input placeholder="Deskripsi (opsional)" value={b.description} onChange={(e) => setForm((f) => { const ben = [...f.benefits]; ben[i] = { ...ben[i], description: e.target.value }; return { ...f, benefits: ben }; })} className="flex-1" />
                  {form.benefits.length > 1 && <button onClick={() => setForm((f) => ({ ...f, benefits: f.benefits.filter((_, idx) => idx !== i) }))} className="text-red-400 hover:text-red-600 shrink-0"><X className="size-4" /></button>}
                </div>
              </div>
            ))}
          </div>

          {/* Extra Text */}
          <div className="rounded-2xl border border-[#F1E9EB] bg-white p-4 sm:p-6 space-y-2">
            <Label>Extra Text / CTA</Label>
            <Textarea rows={3} value={form.extraText} onChange={(e) => setForm((f) => ({ ...f, extraText: e.target.value }))} placeholder="Dapatkan diskon spesial sekarang..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#FAFAFB] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#4C3437]">Promosi / Landing Page</h1>
            <p className="mt-1 text-sm text-gray-500">{promos.length} promosi</p>
          </div>
          <Button onClick={openCreate} className="w-full gap-2 bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90 sm:w-auto">
            <Plus className="size-4" /> Buat Promosi
          </Button>
        </div>

        {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-[#D95A87]" /></div>
          : promos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Megaphone className="size-10 mb-3 opacity-40" /><p className="text-sm">Belum ada promosi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {promos.map((p) => (
                <div key={p.id} className="flex items-start gap-3 rounded-2xl border border-[#F1E9EB] bg-white p-4 shadow-sm sm:items-center sm:gap-4">
                  {p.heroImageUrl ? <img src={p.heroImageUrl} alt={p.title} className="h-14 w-20 shrink-0 rounded-lg object-cover sm:h-16 sm:w-24" />
                    : <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-pink-50 sm:h-16 sm:w-24"><Megaphone className="size-6 text-pink-200" /></div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2">
                      <h3 className="font-semibold text-[#4C3437] text-sm sm:text-base">{p.title}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[p.status]}`}>{STATUS_LABEL[p.status]}</span>
                    </div>
                    <p className="text-xs font-mono text-gray-400">/{p.slug}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{fmtDate(p.startDate)} – {fmtDate(p.endDate)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button onClick={() => toggleStatus(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">{p.status === "active" ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
                    <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#D95A87]"><Pencil className="size-4" /></button>
                    <button onClick={() => handleDelete(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}