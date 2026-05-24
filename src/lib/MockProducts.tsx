import {Product} from "../types";

const INITIAL_MOCK_PRODUCTS: Product[] = [];

export const mockProducts = [
  {
    id: "p1",
    categoryId: "c1",
    name: "Minimal Wooden Chair",
    slug: "minimal-wooden-chair",
    description: "A simple and elegant wooden chair made from oak wood.",
    ingredients:"chocolate and vanilla",
    discountPrice: 120.5,
    basePrice:150,
    mainImage: "https://placehold.co/600x400",
    rating: 4.5,
    bestseller: true,
    weight: 8,
    sku: "CHAIR-001",
    stock: 25,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "c1",
      name: "Furniture",
    },
    images: [
      {
        id: "img1",
        productId: "p1",
        imageUrl: "https://placehold.co/600x400",
        altText: "Wooden chair",
        sortOrder: 1,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "img2",
        productId: "p2",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?font=lato&text=Lato",
        altText: "Metal chair",
        sortOrder: 2,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "img3",
        productId: "p3",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?font=raleway&text=Raleway",
        altText: "Stone chair",
        sortOrder: 3,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    variants: [
      {
        id: "v1",
        productId: "p1",
        name: "Color",
        value: "Brown",
        basePrice: 100,
        discountPrice: 90.5,
        priceAdjustment: 0,
        stock: 10,
        sku: "CHAIR-001-BRN",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "v2",
        productId: "p2",
        name: "Color",
        value: "Gray",
        basePrice: 100,
        discountPrice: 90.5,
        priceAdjustment: 0,
        stock: 10,
        sku: "CHAIR-002-BRN",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
        {
        id: "v3",
        productId: "p3",
        name: "Color",
        value: "Purple",
        basePrice: 100,
        discountPrice: 90.5,
        priceAdjustment: 0,
        stock: 10,
        sku: "CHAIR-003-BRN",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },

  {
    id: "p2",
    categoryId: "c2",
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    description: "Noise-cancelling over-ear wireless headphones.",
    ingredients:"Strawberry and Pandan",
    discountPrice: 90.5,
    basePrice:100,
    mainImage: "https://placehold.co/600x400",
    rating: 4.5,
    bestseller: true,
    weight: 1,
    sku: "HEAD-002",
    stock: 50,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "c2",
      name: "Electronics",
    },
    images: [
      {
        id: "img2",
        productId: "p2",
        imageUrl: "https://placehold.co/600x400",
        altText: "Headphones",
        sortOrder: 1,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    variants: [
      {
        id: "v2",
        productId: "p2",
        name: "Color",
        value: "Black",
        basePrice: 100,
        discountPrice: 90.5,
        priceAdjustment: 0,
        stock: 30,
        sku: "HEAD-002-BLK",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },

  {
    id: "p3",
    categoryId: "c1",
    name: "Modern Coffee Table",
    slug: "modern-coffee-table",
    description: "Stylish coffee table with tempered glass top.",
    ingredients:"Durian and Jackfruit",
    discountPrice: 210,
    basePrice:250,
    mainImage: "https://placehold.co/600x400",
    rating: 4.5,
    bestseller: true,
    weight: 15,
    sku: "TABLE-003",
    stock: 12,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "c1",
      name: "Furniture",
    },
    images: [
      {
        id: "img3",
        productId: "p3",
        imageUrl: "https://placehold.co/600x400",
        altText: "Coffee table",
        sortOrder: 1,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    variants: [],
  },

  {
    id: "p4",
    categoryId: "c3",
    name: "Running Shoes",
    slug: "running-shoes",
    description: "Lightweight running shoes for daily training.",
    ingredients:"Melon and Cabbage",
    discountPrice: 75,
    basePrice:90,
    mainImage: "https://placehold.co/600x400",
    rating: 4.5,
    bestseller: true,
    weight: 1,
    sku: "SHOE-004",
    stock: 40,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "c3",
      name: "Sports",
    },
    images: [
      {
        id: "img4",
        productId: "p4",
        imageUrl: "https://placehold.co/600x400",
        altText: "Running shoes",
        sortOrder: 1,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    variants: [
      {
        id: "v4",
        productId: "p4",
        name: "Size",
        value: "42",
        basePrice: 100,
        discountPrice: 90.5,
        priceAdjustment: 0,
        stock: 20,
        sku: "SHOE-004-42",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },

  {
    id: "p5",
    categoryId: "c4",
    name: "Smart Watch",
    slug: "smart-watch",
    description: "Fitness tracking smart watch with heart rate monitor.",
    ingredients:"Blueberry and mango",
    price: 199.99,
    fullprice:220,
    rating: 4.5,
    bestseller: true,
    weight: 0.5,
    sku: "WATCH-005",
    stock: 18,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: "c4",
      name: "Wearables",
    },
    images: [
      {
        id: "img5",
        productId: "p5",
        imageUrl: "https://placehold.co/600x400",
        altText: "Smart watch",
        sortOrder: 1,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    variants: [
      {
        id: "v5",
        productId: "p5",
        name: "Color",
        value: "Silver",
        basePrice: 100,
        discountPrice: 90.5,
        priceAdjustment: 10,
        stock: 8,
        sku: "WATCH-005-SLV",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
];


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

export function getMockProductBySlug2(slug: string): Product | null {

  const item = mockProducts.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase()
  );

  return item ?? null;
}

export function getMockProductVariantById(id: string): Product | null {

  const item = mockProducts.find(
    (p) => p.id.toLowerCase() === id.toLowerCase()
  );

  return item.variants ?? null;
}
// export function resetMockProductsStore() {
//   mockProductsStore = [...INITIAL_MOCK_PRODUCTS];
// }

// export function getMockProductsStore(): ProductListItem[] {
//   return mockProductsStore;
// }

// export function deleteMockProduct(id: string): boolean {
//   const before = mockProductsStore.length;
//   mockProductsStore = mockProductsStore.filter((p) => p.id !== id);
//   return mockProductsStore.length < before;
// }

// function toFullProduct(item: ProductListItem): Product {
//   return {
//     ...item,
//     sku: (item as Product).sku ?? `SKU-${item.id.toUpperCase()}`,
//     description: (item as Product).description ?? "",
//     status: item.status ?? "active",
//     weight: item.weight ?? 1,
//   };
// }

// export function getMockProductById(id: string): Product | null {
//   const item = mockProductsStore.find((p) => p.id === id);
//   return item ? toFullProduct(item) : null;
// }

// export function isMockSlugTaken(slug: string, excludeId?: string): boolean {
//   return mockProductsStore.some((p) => p.slug === slug && p.id !== excludeId);
// }

// export function createMockProduct(payload: ProductPayload): Product {
//   if (isMockSlugTaken(payload.slug)) {
//     const err = new Error("Slug already exists") as Error & { code?: string };
//     err.code = "CONFLICT";
//     throw err;
//   }

//   const product: Product = {
//     id: `p-${Date.now()}`,
//     ...payload,
//     avgRating: 0,
//     ratingCount: 0,
//     images: [],
//   };
//   mockProductsStore = [product, ...mockProductsStore];
//   return product;
// }

// export function updateMockProduct(id: string, payload: ProductPayload): Product {
//   const index = mockProductsStore.findIndex((p) => p.id === id);
//   if (index === -1) {
//     const err = new Error("Product not found") as Error & { code?: string };
//     err.code = "NOT_FOUND";
//     throw err;
//   }
//   if (isMockSlugTaken(payload.slug, id)) {
//     const err = new Error("Slug already exists") as Error & { code?: string };
//     err.code = "CONFLICT";
//     throw err;
//   }

//   const updated: Product = {
//     ...mockProductsStore[index],
//     ...payload,
//     id,
//   };
//   mockProductsStore[index] = updated;
//   return updated;
// }