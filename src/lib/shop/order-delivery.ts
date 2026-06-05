/** Fallback delivery estimate when BE does not return ETD. */
export const DEFAULT_DELIVERY_ETA_LABEL = "2–4 hari kerja";

export function getDeliveryEstimateLabel(
  createdAt: string,
  courier?: string,
): { etaText: string; estimatedDate: Date } {
  const isExpress = (courier ?? "").toLowerCase().includes("express");
  const daysToAdd = isExpress ? 2 : 3;
  const estimatedDate = new Date(createdAt);
  estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);

  return {
    etaText: isExpress ? "1–2 hari kerja" : DEFAULT_DELIVERY_ETA_LABEL,
    estimatedDate,
  };
}

export function formatDisplayOrderId(id: string): string {
  if (!id) return "—";
  if (/^MB-/i.test(id)) return id;
  const year = new Date().getFullYear();
  const suffix = id.replace(/-/g, "").slice(0, 4).toUpperCase();
  return `MB-${year}-${suffix}`;
}
