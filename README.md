# Mamabear Frontend

Next.js 16 storefront + admin panel untuk e-commerce Mamabear.

**Live:** [https://mamabear-frontend.vercel.app](https://mamabear-frontend.vercel.app)

---

## Tech stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui, Radix UI |
| State | React Context (Auth, Cart, Checkout, Wishlist) |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Charts | Recharts |
| Payment | Xendit |
| Error monitoring | Sentry |
| Font | Quicksand, Urbanist |

---

## Prasyarat

- Node.js 20+
- Backend Mamabear berjalan di `http://localhost:3000` (lihat repo backend)

---

## Instalasi

```bash
npm install
```

Salin file environment:

```bash
cp .env.example .env.local
```

Isi nilai yang diperlukan di `.env.local`:

```env
# URL backend API (wajib)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Service account untuk SSR catalog (server-only, jangan pakai NEXT_PUBLIC_)
SHOP_SERVER_EMAIL=admin@mamabear.id
SHOP_SERVER_PASSWORD=Admin@12345

# Mock data — set false jika backend sudah jalan
MOCK_PRODUCTS=false
NEXT_PUBLIC_MOCK_PRODUCTS=false
```

---

## Menjalankan

```bash
# Development (port 3001)
npm run dev

# Build production
npm run build

# Jalankan production build
npm start

# Lint
npm run lint
```

Frontend berjalan di `http://localhost:3001`

---

## Struktur folder

```
src/
├── app/
│   ├── (auth)/          # Login, register, reset password
│   ├── (shop)/          # Storefront publik
│   │   ├── products/    # Halaman produk & detail
│   │   ├── cart/        # Keranjang belanja
│   │   ├── checkout/    # Info → Method → Review
│   │   ├── payment/     # Xendit payment redirect
│   │   ├── order-success/
│   │   ├── account/     # Profil, alamat, order history
│   │   ├── wishlist/
│   │   ├── promotion/   # Bundle hamper
│   │   └── ...
│   └── admin/           # Panel admin (role: admin / super_admin)
│       ├── orders/
│       ├── products/
│       ├── variants/
│       ├── customers/
│       ├── membership/
│       ├── vouchers/
│       ├── reports/     # Hanya super_admin
│       ├── users/       # Hanya super_admin
│       └── settings/    # Hanya super_admin
├── components/
│   ├── admin/
│   ├── cart/
│   ├── checkout/
│   ├── layout/
│   ├── productDetail/
│   ├── shared/
│   └── ui/              # shadcn/ui components
├── context/             # AuthContext, CartContext, CheckoutContext, WishlistContext
├── hooks/               # useCart, useAuth, useWishlist, dll.
├── lib/
│   ├── api/             # Semua API client (products, orders, cart, dll.)
│   ├── actions/         # Next.js Server Actions
│   ├── auth/            # Session, token helpers
│   └── shop/            # Business logic (place-order, shipping, dll.)
└── types/               # TypeScript types global
```

---

## Flow utama

### Checkout (storefront)

```
Pilih produk → Pilih variant → Add to Cart / Checkout langsung
    ↓
/cart → Pilih item → Proceed to Checkout
    ↓
/checkout/info   (isi alamat pengiriman)
    ↓
/checkout/method (pilih kurir: JNE / J&T / POS)
    ↓
/checkout/review (konfirmasi + bayar)
    ↓
Xendit payment gateway
    ↓
/order-success
```

### Admin panel

Akses di `/admin`. Butuh login dengan role `admin` atau `super_admin`.

| Fitur | admin | super_admin |
|---|:---:|:---:|
| Dashboard & Reports | — | ✓ |
| Orders | ✓ | ✓ |
| Products & Variants | ✓ | ✓ |
| Customers | ✓ | ✓ |
| Membership & Vouchers | ✓ | ✓ |
| Content (Artikel, FAQ, Banner) | ✓ | ✓ |
| Admin Users | — | ✓ |
| Settings | — | ✓ |

---

## Auth

- Login menggunakan cookie `accessToken` + `refreshToken` yang di-set backend
- Middleware (`src/proxy.ts`) menjaga route `/checkout`, `/account`, `/wishlist`, `/payment` — redirect ke `/login?redirect=<path>` jika belum login
- Admin route dijaga oleh `AdminLayout` (client-side) dan `SuperAdminRouteGuard`

---

## Variabel environment lengkap

| Variabel | Wajib | Keterangan |
|---|:---:|---|
| `NEXT_PUBLIC_API_URL` | ✓ | Base URL backend API |
| `SHOP_SERVER_EMAIL` | ✓ | Email service account untuk SSR |
| `SHOP_SERVER_PASSWORD` | ✓ | Password service account untuk SSR |
| `MOCK_PRODUCTS` | — | `true` untuk dev tanpa backend |
| `NEXT_PUBLIC_MOCK_PRODUCTS` | — | Sama, untuk client-side |
| `NEXT_PUBLIC_ASSET_BASE_URL` | — | Base URL untuk gambar produk |