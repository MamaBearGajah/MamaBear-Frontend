"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MessageCircle, Loader2, ChevronLeft, ChevronRight,
  Search, X, ChevronDown, ChevronUp,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import {
  consultationApi,
  type Consultation,
  type ConsultationStatus,
  type ConsultationMeta,
} from "@/lib/api/consultation";
import { Button } from "@/components/ui/button";

const STATUS_OPTS: { value: ConsultationStatus; label: string; color: string }[] = [
  { value: "new", label: "Baru", color: "bg-blue-100 text-blue-700" },
  { value: "in_progress", label: "Diproses", color: "bg-yellow-100 text-yellow-700" },
  { value: "closed", label: "Selesai", color: "bg-green-100 text-green-700" },
];

function fmtDate(s: string) {
  try { return format(parseISO(s), "d MMM yyyy, HH:mm", { locale: localeId }); }
  catch { return s; }
}

function StatusBadge({ status }: { status: ConsultationStatus }) {
  const opt = STATUS_OPTS.find((s) => s.value === status);
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${opt?.color ?? "bg-gray-100 text-gray-600"}`}>
      {opt?.label ?? status}
    </span>
  );
}

export default function AdminConsultationsPage() {
  const [items, setItems] = useState<Consultation[]>([]);
  const [meta, setMeta] = useState<ConsultationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ConsultationStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusForm, setStatusForm] = useState<Record<string, ConsultationStatus>>({});

  // Debounce search — tunggu 400ms setelah user berhenti ketik
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset ke halaman 1 saat search berubah
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page ke 1 saat filter status berubah
  useEffect(() => {
    setPage(1);
  }, [filterStatus]);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const { data, meta } = await consultationApi.adminGetAll({
        page,
        limit: 15,
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(debouncedSearch && { search: debouncedSearch }),
      });
      setItems(data);
      setMeta(meta);
    } catch {
      toast.error("Gagal memuat konsultasi");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, debouncedSearch]);

  useEffect(() => { fetchPage(); }, [fetchPage]);

  function initStatusForm(c: Consultation) {
    setStatusForm((prev) => ({ ...prev, [c.id]: c.status }));
  }

  async function handleUpdate(id: string) {
    const status = statusForm[id];
    if (!status) return;
    setUpdatingId(id);
    try {
      await consultationApi.adminUpdateStatus(id, { status });
      toast.success("Status konsultasi diperbarui");
      setExpandedId(null);
      fetchPage();
    } catch {
      toast.error("Gagal memperbarui status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-full bg-[#FAFAFB] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#4C3437]">Konsultasi Masuk</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola pertanyaan & konsultasi dari customer</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Cari nama, email, pesan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-full border border-[#EFE6EA] bg-white pl-9 pr-4 text-sm outline-none focus:border-[#D95A87]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <div className="flex gap-1">
            {([{ value: "all", label: "Semua" }, ...STATUS_OPTS] as const).map((s) => (
              <button
                key={s.value}
                onClick={() => setFilterStatus(s.value as ConsultationStatus | "all")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  filterStatus === s.value
                    ? "bg-[#D95A87] text-white"
                    : "bg-white border border-[#EFE6EA] text-gray-600 hover:border-[#D95A87]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-[#D95A87]" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MessageCircle className="size-10 mb-3 opacity-40" />
            <p className="text-sm">Tidak ada konsultasi</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((c) => {
              const isOpen = expandedId === c.id;
              const selectedStatus = statusForm[c.id] ?? c.status;
              return (
                <div key={c.id} className="overflow-hidden rounded-2xl border border-[#F1E9EB] bg-white shadow-sm">
                  {/* Header */}
                  <button
                    onClick={() => {
                      if (!isOpen) initStatusForm(c);
                      setExpandedId(isOpen ? null : c.id);
                    }}
                    className="flex w-full items-start justify-between gap-4 p-4 text-left hover:bg-[#FDF8FA]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#4C3437] truncate">{c.name}</p>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {c.email}{c.phone ? ` · ${c.phone}` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">{fmtDate(c.createdAt)}</p>
                    </div>
                    {isOpen
                      ? <ChevronUp className="size-4 shrink-0 text-gray-400 mt-1" />
                      : <ChevronDown className="size-4 shrink-0 text-gray-400 mt-1" />
                    }
                  </button>

                  {/* Detail */}
                  {isOpen && (
                    <div className="border-t border-[#F1E9EB] p-4 space-y-4">
                      <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 whitespace-pre-wrap">
                        {c.message}
                      </div>

                      <div className="max-w-xs space-y-1">
                        <label className="text-sm font-medium text-gray-700">Ubah Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) =>
                            setStatusForm((prev) => ({
                              ...prev,
                              [c.id]: e.target.value as ConsultationStatus,
                            }))
                          }
                          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                        >
                          {STATUS_OPTS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleUpdate(c.id)}
                          disabled={updatingId === c.id}
                          className="w-full gap-2 sm:w-auto bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
                        >
                          {updatingId === c.id && <Loader2 className="size-4 animate-spin" />}
                          Simpan
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-500">
              Halaman {meta.currentPage} dari {meta.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.currentPage <= 1}
                className="inline-flex size-8 items-center justify-center rounded-full border disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={meta.currentPage >= meta.totalPages}
                className="inline-flex size-8 items-center justify-center rounded-full border disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}