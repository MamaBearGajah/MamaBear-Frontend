// Single Responsibility: menampilkan info kapan poin AKAN direset, kalau ada.
// Catatan: tampil hanya jika backend sudah set `pointsExpiredAt` untuk user ini.
// Saat ini field tersebut belum pernah diisi backend, jadi banner ini akan
// tersembunyi sampai logic expiry poin diimplementasikan di sisi server.

import { AlertCircle } from "lucide-react";

interface Props {
  expiresAt: string | null;
}

export function PointsResetBanner({ expiresAt }: Props) {
  if (!expiresAt) return null;

  const expiryDate = new Date(expiresAt);
  if (expiryDate.getTime() < Date.now()) return null; // sudah lewat, jangan tampilkan

  const formattedDate = expiryDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
      <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
      <p className="text-sm text-amber-700">
        Poin kamu akan{" "}
        <span className="font-bold">direset pada {formattedDate}</span>. Gunakan poinmu
        sebelum kedaluwarsa!
      </p>
    </div>
  );
}