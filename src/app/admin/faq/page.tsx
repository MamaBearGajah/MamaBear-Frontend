"use client";

/**
 * src/app/admin/faq/page.tsx
 * CRUD FAQ: list, create, edit, toggle active, reorder (drag manual)
 * BE: GET /faq, POST /faq, PATCH /faq/:id, DELETE /faq/:id
 */

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, HelpCircle, ToggleLeft, ToggleRight, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import { normalizeApiResponse } from "@/lib/api/normalize-api-response";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  isActive: boolean;
};

type FormState = { question: string; answer: string; category: string; isActive: boolean };
const EMPTY_FORM: FormState = { question: "", answer: "", category: "", isActive: true };

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FaqItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/faq");
      const norm = normalizeApiResponse<FaqItem[]>(res.data);
      const list = (Array.isArray(norm.data) ? norm.data : []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setFaqs(list);
    } catch { toast.error("Gagal memuat FAQ"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  function openCreate() { setEditTarget(null); setForm(EMPTY_FORM); setDialogOpen(true); }
  function openEdit(f: FaqItem) { setEditTarget(f); setForm({ question: f.question, answer: f.answer, category: f.category ?? "", isActive: f.isActive }); setDialogOpen(true); }

  async function handleSave() {
    if (!form.question.trim()) { toast.error("Pertanyaan wajib diisi"); return; }
    if (!form.answer.trim()) { toast.error("Jawaban wajib diisi"); return; }
    setSaving(true);
    try {
      const payload = { question: form.question.trim(), answer: form.answer.trim(), category: form.category.trim() || undefined, isActive: form.isActive };
      if (editTarget) {
        await apiClient.patch(`/faq/${editTarget.id}`, payload);
        toast.success("FAQ diperbarui");
      } else {
        await apiClient.post("/faq", { ...payload, order: faqs.length });
        toast.success("FAQ dibuat");
      }
      setDialogOpen(false);
      fetchFaqs();
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message ?? "Gagal menyimpan FAQ");
    } finally { setSaving(false); }
  }

  async function handleToggle(f: FaqItem) {
    try {
      await apiClient.patch(`/faq/${f.id}`, { isActive: !f.isActive });
      setFaqs((prev) => prev.map((x) => x.id === f.id ? { ...x, isActive: !f.isActive } : x));
    } catch { toast.error("Gagal mengubah status"); }
  }

  async function handleDelete(f: FaqItem) {
    if (!confirm(`Hapus FAQ ini?`)) return;
    try {
      await apiClient.delete(`/faq/${f.id}`);
      setFaqs((prev) => prev.filter((x) => x.id !== f.id));
      toast.success("FAQ dihapus");
    } catch { toast.error("Gagal menghapus FAQ"); }
  }

  async function moveOrder(idx: number, dir: -1 | 1) {
    const next = idx + dir;
    if (next < 0 || next >= faqs.length) return;
    const updated = [...faqs];
    [updated[idx], updated[next]] = [updated[next], updated[idx]];
    setFaqs(updated);
    try {
      await Promise.all([
        apiClient.patch(`/faq/${updated[idx].id}`, { order: idx }),
        apiClient.patch(`/faq/${updated[next].id}`, { order: next }),
      ]);
    } catch { toast.error("Gagal menyimpan urutan"); fetchFaqs(); }
  }

  return (
    <div className="min-h-full bg-[#FAFAFB] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#4C3437]">FAQ</h1>
            <p className="mt-1 text-sm text-gray-500">{faqs.length} pertanyaan</p>
          </div>
          <Button onClick={openCreate} className="w-full gap-2 sm:w-auto bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90">
            <Plus className="size-4" /> Tambah FAQ
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-[#D95A87]" /></div>
        ) : faqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <HelpCircle className="size-10 mb-3 opacity-40" />
            <p className="text-sm">Belum ada FAQ</p>
          </div>
        ) : (
          <div className="space-y-2">
            {faqs.map((f, idx) => (
              <div key={f.id} className={`rounded-xl border p-4 ${f.isActive ? "border-[#F1E9EB] bg-white" : "border-gray-200 bg-gray-50 opacity-60"}`}>
                <div className="flex items-start gap-3">
                  {/* Reorder */}
                  <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
                    <button onClick={() => moveOrder(idx, -1)} disabled={idx === 0} className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"><ChevronUp className="size-3.5" /></button>
                    <button onClick={() => moveOrder(idx, 1)} disabled={idx === faqs.length - 1} className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"><ChevronDown className="size-3.5" /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-[#4C3437] text-sm">{f.question}</p>
                      {f.category && <span className="shrink-0 rounded-full bg-pink-50 px-2 py-0.5 text-xs text-pink-700">{f.category}</span>}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{f.answer}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button onClick={() => handleToggle(f)} className="inline-flex">
                      {f.isActive ? <ToggleRight className="size-5 text-green-500" /> : <ToggleLeft className="size-5 text-gray-400" />}
                    </button>
                    <button onClick={() => openEdit(f)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#D95A87]"><Pencil className="size-3.5" /></button>
                    <button onClick={() => handleDelete(f)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editTarget ? "Edit FAQ" : "Tambah FAQ"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Pertanyaan *</Label>
              <Input value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} placeholder="Bagaimana cara memesan produk?" />
            </div>
            <div className="space-y-1">
              <Label>Jawaban *</Label>
              <Textarea rows={4} value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} placeholder="Untuk memesan, Anda bisa..." />
            </div>
            <div className="space-y-1">
              <Label>Kategori <span className="text-xs text-gray-400">— opsional</span></Label>
              <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Pengiriman / Pembayaran / Produk" />
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}>
                {form.isActive ? <ToggleRight className="size-6 text-green-500" /> : <ToggleLeft className="size-6 text-gray-400" />}
              </button>
              <Label>{form.isActive ? "Aktif (tampil di website)" : "Nonaktif"}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving} className="w-full gap-2 sm:w-auto bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90">
              {saving && <Loader2 className="size-4 animate-spin" />}
              {editTarget ? "Simpan" : "Buat FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}