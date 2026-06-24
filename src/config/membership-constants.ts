/**
 * src/config/membership-constants.ts
 *
 * Konstanta membership di sisi frontend.
 * Harus sinkron dengan backend: src/membership/membership.constants.ts
 *
 * SISTEM REWARD:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ 1. PEMBELIAN  → Rp 1.000 = 1 poin                              │
 * │    Diberikan OTOMATIS backend saat order status → "delivered"   │
 * │    Frontend hanya menampilkan estimasi, TIDAK memanggil API     │
 * │                                                                 │
 * │ 2. DAILY LOGIN → +5 poin/hari, +20 poin bonus tiap 7 hari      │
 * │    Diklaim eksplisit via POST /membership/daily-login           │
 * │                                                                 │
 * │ 3. TIER BENEFIT → Voucher ongkir otomatis saat naik tier:       │
 * │    Silver   → gratis ongkir Rp 5.000                           │
 * │    Gold     → gratis ongkir Rp 10.000                          │
 * │    Platinum → gratis ongkir Rp 15.000                          │
 * │    Dibuat OTOMATIS backend, frontend tampilkan dari activeVouchers│
 * └─────────────────────────────────────────────────────────────────┘
 */

/** Rp per poin dari pembelian: Rp 1.000 belanja = 1 poin */
export const POINT_RATE = 1_000;

/** Nilai rupiah per 1 poin saat redeem: 1 poin = Rp 100 */
export const POINT_TO_RUPIAH = 100;

/** Minimal poin yang bisa diredeem */
export const MIN_REDEEM_POINTS = 100;

/** Poin yang didapat dari daily login */
export const DAILY_LOGIN_POINTS = 5;

/** Bonus poin untuk streak 7 hari */
export const STREAK_BONUS_POINTS = 20;

/** Periode streak (hari) */
export const STREAK_PERIOD_DAYS = 7;

/** Voucher ongkir per tier (Rp) — hanya untuk info display */
export const TIER_SHIPPING_BENEFIT: Record<string, number> = {
  silver:   5_000,
  gold:     10_000,
  platinum: 15_000,
};