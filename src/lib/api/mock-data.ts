import type { Category, Product, ProductListItem, ProductPayload } from "@/types";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-root",
    parentId: null,
    name: "Semua Produk",
    slug: "semua-produk",
    isActive: true,
  },
  {
    id: "cat-1",
    parentId: "cat-root",
    name: "ASI Booster Tea",
    slug: "asi-booster-tea",
    isActive: true,
  },
  {
    id: "cat-2",
    parentId: "cat-root",
    name: "ASI Booster Capsules",
    slug: "asi-booster-capsules",
    isActive: true,
  },
  {
    id: "cat-3",
    parentId: "cat-root",
    name: "Kookie Bites",
    slug: "kookie-bites",
    isActive: true,
  },
  {
    id: "cat-4",
    parentId: "cat-root",
    name: "Chocomalt",
    slug: "chocomalt",
    isActive: true,
  },
  {
    id: "cat-5",
    parentId: "cat-root",
    name: "Sprinkles Cereal",
    slug: "sprinkles-cereal",
    isActive: true,
  },
  {
    id: "cat-6",
    parentId: "cat-root",
    name: "Superfood Pancake Mix",
    slug: "superfood-pancake-mix",
    isActive: true,
  },
  {
    id: "cat-7",
    parentId: "cat-root",
    name: "Protein Bites",
    slug: "protein-bites",
    isActive: true,
  },
  {
    id: "cat-8",
    parentId: "cat-root",
    name: "Pregnancy Support",
    slug: "pregnancy-support",
    isActive: true,
  },
  {
    id: "cat-9",
    parentId: "cat-root",
    name: "Postpartum Recovery",
    slug: "postpartum-recovery",
    isActive: true,
  },
];

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop";

export const INITIAL_MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: "p-1",
    name: "ASI Booster Tea – Hazelnut Milk Tea",
    slug: "asi-booster-tea-hazelnut",
    basePrice: 65000,
    stock: 42,
    avgRating: 4.8,
    ratingCount: 284,
    categoryId: "cat-1",
    weight: 150,
    badge: "best-seller",
    flavorTags: ["Hazelnut", "Lychee", "Thai"],
    images: [{ id: "img-1", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-2",
    name: "ASI Booster Tea – Original",
    slug: "asi-booster-tea-original",
    basePrice: 60000,
    discountPrice: 55000,
    stock: 18,
    avgRating: 4.6,
    ratingCount: 156,
    categoryId: "cat-1",
    weight: 150,
    badge: "new",
    flavorTags: ["Original", "Honey"],
    images: [{ id: "img-2", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-3",
    name: "ASI Booster Capsules – 30ct",
    slug: "asi-booster-capsules-30",
    basePrice: 120000,
    stock: 65,
    avgRating: 4.9,
    ratingCount: 98,
    categoryId: "cat-2",
    weight: 80,
    images: [{ id: "img-3", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-4",
    name: "ASI Booster Capsules – 60ct",
    slug: "asi-booster-capsules-60",
    basePrice: 210000,
    stock: 28,
    avgRating: 4.7,
    ratingCount: 72,
    categoryId: "cat-2",
    weight: 120,
    images: [{ id: "img-4", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-5",
    name: "Kookie Bites – Chocolate Chip",
    slug: "kookie-bites-chocolate",
    basePrice: 55000,
    discountPrice: 45000,
    stock: 55,
    avgRating: 4.8,
    ratingCount: 367,
    categoryId: "cat-3",
    weight: 200,
    badge: "fan-favorite",
    flavorTags: ["Chocolate", "Oat", "Peanut"],
    images: [{ id: "img-5", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-6",
    name: "Kookie Bites – Matcha",
    slug: "kookie-bites-matcha",
    basePrice: 48000,
    stock: 12,
    avgRating: 4.4,
    ratingCount: 89,
    categoryId: "cat-3",
    weight: 200,
    images: [{ id: "img-6", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-7",
    name: "ASI Booster Tea – Vanilla",
    slug: "asi-booster-tea-vanilla",
    basePrice: 65000,
    stock: 33,
    avgRating: 4.7,
    ratingCount: 142,
    categoryId: "cat-1",
    weight: 150,
    images: [{ id: "img-7", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-8",
    name: "Kookie Bites – Classic",
    slug: "kookie-bites-classic",
    basePrice: 42000,
    stock: 40,
    avgRating: 4.3,
    ratingCount: 67,
    categoryId: "cat-3",
    weight: 200,
    images: [{ id: "img-8", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-9",
    name: "ASI Booster Tea – Caramel",
    slug: "asi-booster-tea-caramel",
    basePrice: 68000,
    stock: 22,
    avgRating: 4.6,
    ratingCount: 110,
    categoryId: "cat-1",
    weight: 150,
    images: [{ id: "img-9", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-10",
    name: "ASI Booster Capsules – Trial Pack",
    slug: "asi-booster-capsules-trial",
    basePrice: 75000,
    stock: 8,
    badge: "new",
    avgRating: 4.2,
    ratingCount: 45,
    categoryId: "cat-2",
    weight: 40,
    images: [{ id: "img-10", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-11",
    name: "Kookie Bites – Strawberry",
    slug: "kookie-bites-strawberry",
    basePrice: 47000,
    stock: 50,
    avgRating: 4.5,
    ratingCount: 93,
    categoryId: "cat-3",
    weight: 200,
    images: [{ id: "img-11", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-12",
    name: "ASI Booster Tea – Bundle 3x",
    slug: "asi-booster-tea-bundle",
    basePrice: 175000,
    discountPrice: 165000,
    stock: 15,
    avgRating: 4.9,
    ratingCount: 38,
    categoryId: "cat-1",
    weight: 450,
    images: [{ id: "img-12", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
  {
    id: "p-draft",
    name: "Internal Draft Product",
    slug: "internal-draft",
    basePrice: 99000,
    stock: 10,
    status: "draft",
    categoryId: "cat-4",
    images: [{ id: "img-draft", imageUrl: PLACEHOLDER_IMAGE, isFeatured: true }],
  },
];

let mockProductsStore = [...INITIAL_MOCK_PRODUCTS];

/**
 * Mock data toggle (development).
 * Backend live: set NEXT_PUBLIC_API_URL and MOCK_PRODUCTS=false (see .env.example).
 */
export function isMockProductsEnabled(): boolean {
  if (
    process.env.MOCK_PRODUCTS === "false" ||
    process.env.NEXT_PUBLIC_MOCK_PRODUCTS === "false"
  ) {
    return false;
  }
  if (
    process.env.MOCK_PRODUCTS === "true" ||
    process.env.NEXT_PUBLIC_MOCK_PRODUCTS === "true"
  ) {
    return process.env.NODE_ENV === "development";
  }
  return false;
}

export function getMockProductBySlug(slug: string): Product | null {
  const item = mockProductsStore.find((p) => p.slug === slug);
  return item ? toFullProduct(item) : null;
}

export function resetMockProductsStore() {
  mockProductsStore = [...INITIAL_MOCK_PRODUCTS];
}

export function getMockProductsStore(): ProductListItem[] {
  return mockProductsStore;
}

export function deleteMockProduct(id: string): boolean {
  const before = mockProductsStore.length;
  mockProductsStore = mockProductsStore.filter((p) => p.id !== id);
  return mockProductsStore.length < before;
}

function toFullProduct(item: ProductListItem): Product {
  return {
    ...item,
    sku: (item as Product).sku ?? `SKU-${item.id.toUpperCase()}`,
    description: (item as Product).description ?? "",
    status: item.status ?? "active",
    weight: item.weight ?? 1,
  };
}

export function getMockProductById(id: string): Product | null {
  const item = mockProductsStore.find((p) => p.id === id);
  return item ? toFullProduct(item) : null;
}

export function isMockSlugTaken(slug: string, excludeId?: string): boolean {
  return mockProductsStore.some((p) => p.slug === slug && p.id !== excludeId);
}

export function createMockProduct(payload: ProductPayload): Product {
  if (isMockSlugTaken(payload.slug)) {
    const err = new Error("Slug already exists") as Error & { code?: string };
    err.code = "CONFLICT";
    throw err;
  }

  const product: Product = {
    id: `p-${Date.now()}`,
    ...payload,
    avgRating: 0,
    ratingCount: 0,
    images: [],
  };
  mockProductsStore = [product, ...mockProductsStore];
  return product;
}

export function updateMockProduct(id: string, payload: ProductPayload): Product {
  const index = mockProductsStore.findIndex((p) => p.id === id);
  if (index === -1) {
    const err = new Error("Product not found") as Error & { code?: string };
    err.code = "NOT_FOUND";
    throw err;
  }
  if (isMockSlugTaken(payload.slug, id)) {
    const err = new Error("Slug already exists") as Error & { code?: string };
    err.code = "CONFLICT";
    throw err;
  }

  const updated: Product = {
    ...mockProductsStore[index],
    ...payload,
    id,
  };
  mockProductsStore[index] = updated;
  return updated;
}