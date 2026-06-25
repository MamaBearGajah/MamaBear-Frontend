export const DEFAULT_DELIVERY_ETA_LABEL = "2–4 hari kerja";

export function getDeliveryEstimateLabel(
  createdAt: string,
  courier?: string,
  estimatedDelivery?: string | null,
): { etaText: string; estimatedDate: Date } {
  // ── Prioritas: gunakan estimatedDelivery dari BE kalau ada ──────────────
  if (estimatedDelivery) {
    const estimatedDate = new Date(estimatedDelivery);
    if (!isNaN(estimatedDate.getTime())) {
      const now = new Date();
      const diffDays = Math.ceil(
        (estimatedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const etaText =
        diffDays <= 0
          ? "Segera tiba"
          : `Estimasi ${diffDays} hari lagi`;
      return { etaText, estimatedDate };
    }
  }

  // ── Fallback: hitung dari courier name ──────────────────────────────────
  const courierLower = (courier ?? "").toLowerCase();
  const isExpress =
    courierLower.includes("express") ||
    courierLower.includes("yes") ||
    courierLower.includes("oke");
  const daysToAdd = isExpress ? 2 : 4;
  const estimatedDate = new Date(createdAt);
  estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);

  return {
    etaText: isExpress ? "1–2 hari kerja" : DEFAULT_DELIVERY_ETA_LABEL,
    estimatedDate,
  };
}

/**
 * Format order number untuk display.
 * Prioritas: pakai orderNumber dari BE (format ORB-YYYYMMDD-XXXX).
 * Fallback: format dari UUID untuk backward compat.
 */
export function formatDisplayOrderId(
  idOrOrderNumber: string,
  orderNumber?: string,
): string {
  // Kalau ada orderNumber eksplisit dari BE, pakai langsung
  if (orderNumber) return orderNumber;

  // Kalau id sendiri sudah format ORB-... atau MB-..., pakai langsung
  if (/^(ORB|MB)-/i.test(idOrOrderNumber)) return idOrOrderNumber;

  // Fallback lama: generate dari UUID (backward compat)
  if (!idOrOrderNumber) return "—";
  const year = new Date().getFullYear();
  const suffix = idOrOrderNumber.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `MB-${year}-${suffix}`;
}