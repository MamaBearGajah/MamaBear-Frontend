import {Category, Product, Review} from "../types";

const INITIAL_MOCK_PRODUCTS: Product[] = [];

export const mockCategories: Category[] = [
  {
    id: "cat-root",
    parentId: null,
    name: "Semua Produk",
    slug: "semua-produk",
    description: "Lihat semua produk MamaBear",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    isActive: true,
  },
  {
    id: "cat-1",
    parentId: "cat-root",
    name: "ASI Booster Tea",
    slug: "asi-booster-tea",
    description: "Lihat semua produk MamaBear",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    isActive: true,
  },
  {
    id: "cat-2",
    parentId: "cat-root",
    name: "ASI Booster Capsules",
    slug: "asi-booster-capsules",
    description: "Lihat semua produk MamaBear",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    isActive: true,
  },
  {
    id: "cat-3",
    parentId: "cat-root",
    name: "Kookie Bites",
    slug: "kookie-bites",
    description: "Lihat semua produk MamaBear",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    isActive: true,
  },
  {
    id: "cat-4",
    parentId: "cat-root",
    name: "Chocomalt",
    slug: "chocomalt",
    description: "Lihat semua produk MamaBear",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    isActive: true,
  },
  {
    id: "cat-5",
    parentId: "cat-root",
    name: "Sprinkles Cereal",
    slug: "sprinkles-cereal",
    description: "Lihat semua produk MamaBear",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    isActive: true,
  },
  {
    id: "cat-6",
    parentId: "cat-root",
    name: "Superfood Pancake Mix",
    slug: "superfood-pancake-mix",
    description: "Lihat semua produk MamaBear",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    isActive: true,
  },
  {
    id: "cat-7",
    parentId: "cat-root",
    name: "Protein Bites",
    slug: "protein-bites",
    description: "Lihat semua produk MamaBear",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    isActive: true,
  },
  {
    id: "cat-8",
    parentId: "cat-root",
    name: "Pregnancy Support",
    slug: "pregnancy-support",
    description: "Lihat semua produk MamaBear",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    isActive: true,
  },
  {
    id: "cat-9",
    parentId: "cat-root",
    name: "Postpartum Recovery",
    slug: "postpartum-recovery",
    description: "Lihat semua produk MamaBear",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    isActive: true,
  },
];


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
    soldCount: 5,
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
    soldCount: 15,
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
    soldCount: 7,
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
    soldCount: 20,
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
    soldCount: 8,
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


export const mockReviews:Review[] = [
      {
        id: "eec48093-7d89-4079-89dc-8000c7de777d",
        productId: "9f249e0a-3e92-447c-8e02-380d5b253f44",
        userId: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
        orderId: "4ee72628-9fc4-42bc-a489-6f56f4973e20",
        rating: 5,
        review: "Camilan favorit saya dan suami! Varian Choco Nut bebas susu, aman untuk lactose intolerant.",
        isVerifiedPurchase: true,
        helpfulCount: 14,
        createdAt: new Date("2026-05-25T11:15:48.405Z"),
        updatedAt: new Date("2026-05-25T11:15:48.405Z"),
        user: {
          id: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
          name: "Ayu Setiawati"
        }
      },
      {
        id: "8441aaa2-151c-4a4e-902d-3c97664f0950",
        productId: "9f249e0a-3e92-447c-8e02-380d5b253f44",
        userId: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
        orderId: "65f16196-a8df-4200-b4d3-b9f4ad12d358",
        rating: 5,
        review: "Camilan favorit saya dan suami! Varian Choco Nut bebas susu, aman untuk lactose intolerant.",
        isVerifiedPurchase: true,
        helpfulCount: 9,
        createdAt: new Date("2026-05-25T10:13:24.882Z"),
        updatedAt: new Date("2026-05-25T10:13:24.882Z"),
        user: {
          id: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
          "name": "Ayu Setiawati"
        }
      },
      {
        id: "3e7f6699-e146-4486-8e6c-e6ff1ea084a0",
        productId: "9f249e0a-3e92-447c-8e02-380d5b253f44",
        userId: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
        orderId: "8a765e1b-cc10-4ccb-81d9-625d05426944",
        rating: 5,
        review: "Camilan favorit saya dan suami! Varian Choco Nut bebas susu, aman untuk lactose intolerant.",
        isVerifiedPurchase: true,
        helpfulCount: 7,
        createdAt: new Date("2026-05-25T10:07:56.925Z"),
        updatedAt: new Date("2026-05-25T10:07:56.925Z"),
        user: {
          id: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
          name: "Ayu Setiawati"
        }
      },
      {
        id: "8cf4f98d-bd40-4c9e-8a31-8b573fe344f1",
        productId: "9f249e0a-3e92-447c-8e02-380d5b253f44",
        userId: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
        orderId: "8fa8a452-aa14-48bf-968f-411af06ae92d",
        rating: 5,
        review: "Camilan favorit saya dan suami! Varian Choco Nut bebas susu, aman untuk lactose intolerant.",
        isVerifiedPurchase: true,
        helpfulCount: 12,
        createdAt: new Date("2026-05-25T10:02:58.589Z"),
        updatedAt: new Date("2026-05-25T10:02:58.589Z"),
        user: {
          id: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
          name: "Ayu Setiawati"
        }
      },
      {
        id: "699cda04-f0c1-4a90-9916-fccd40ed0e2b",
        productId: "9f249e0a-3e92-447c-8e02-380d5b253f44",
        userId: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
        orderId: "ccaa71f3-886a-4dab-a5ab-2b6411f0ab10",
        rating: 5,
        review: "Camilan favorit saya dan suami! Varian Choco Nut bebas susu, aman untuk lactose intolerant.",
        isVerifiedPurchase: true,
        helpfulCount: 11,
        createdAt: new Date("2026-05-25T09:58:50.469Z"),
        updatedAt: new Date("2026-05-25T09:58:50.469Z"),
        user: {
          id: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
          name: "Ayu Setiawati"
        }
      },
      {
        id: "5c76e503-5e71-4635-8083-a657cde70643",
        productId: "9f249e0a-3e92-447c-8e02-380d5b253f44",
        userId: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
        orderId: "7c2251e5-ff3f-4990-9445-75c10a3341f1",
        rating: 5,
        review: "Camilan favorit saya dan suami! Varian Choco Nut bebas susu, aman untuk lactose intolerant.",
        isVerifiedPurchase: true,
        helpfulCount: 14,
        createdAt: new Date("2026-05-25T09:47:38.864Z"),
        updatedAt: new Date("2026-05-25T09:47:38.864Z"),
        user: {
          id: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
          name: "Ayu Setiawati"
        }
      },
      {
        id: "03b3acc4-f2a1-4db2-b408-1a60102d3dbb",
        productId: "9f249e0a-3e92-447c-8e02-380d5b253f44",
        userId: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
        orderId: "e2ed8a27-d0e6-476b-b2e9-69c279c4c1d9",
        rating: 5,
        review: "Camilan favorit saya dan suami! Varian Choco Nut bebas susu, aman untuk lactose intolerant.",
        isVerifiedPurchase: true,
        helpfulCount: 7,
        createdAt: new Date("2026-05-25T09:22:07.655Z"),
        updatedAt: new Date("2026-05-25T09:22:07.655Z"),
        user: {
          id: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
          name: "Ayu Setiawati"
        }
      },
      {
        id: "61f11755-686a-4f2e-8955-7c61eceea7c6",
        productId: "9f249e0a-3e92-447c-8e02-380d5b253f44",
        userId: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
        orderId: "9687b6d8-18f3-4599-9ce3-6eed85aaf7e0",
        rating: 5,
        review: "Camilan favorit saya dan suami! Varian Choco Nut bebas susu, aman untuk lactose intolerant.",
        isVerifiedPurchase: true,
        helpfulCount: 13,
        createdAt: new Date("2026-05-24T16:32:31.141Z"),
        updatedAt: new Date("2026-05-24T16:32:31.141Z"),
        user: {
          id: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
          name: "Ayu Setiawati"
        }
      },
      {
        id: "aef166c2-b4d4-489e-b349-ef5dfe9b021d",
        productId: "9f249e0a-3e92-447c-8e02-380d5b253f44",
        userId: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
        orderId: "1e2e82ba-7aba-4d7a-b2eb-f098403b5843",
        rating  : 5,
        review: "Camilan favorit saya dan suami! Varian Choco Nut bebas susu, aman untuk lactose intolerant.",
        isVerifiedPurchase: true,
        helpfulCount: 10,
        createdAt: new Date("2026-05-22T13:13:28.195Z"),
        updatedAt: new Date("2026-05-22T13:13:28.195Z"),
        user: {
          id: "5e7f4a51-6e8f-4474-bfee-ac34c16ff55f",
          name: "Ayu Setiawati"
        }
      },
      {
        id: "9363ecac-41b5-4f86-9ce3-e8fb12927b5c",
        productId: "9f249e0a-3e92-447c-8e02-380d5b253f44",
        userId: "9bb6fd04-2072-467b-bcf1-b1cf19d56978",
        orderId: "695f1479-6de9-4c62-a3b6-add1c1f25fc9",
        rating: 4,
        review: "Choco Chip renyah dan potongannya pas. Dikombinasikan dengan AlmonMix hasilnya signifikan.",
        isVerifiedPurchase: true,
        helpfulCount: 14,
        createdAt: new Date("2026-05-19T11:15:46.061Z"),
        updatedAt: new Date("2026-05-19T11:15:46.061Z"),
        user: {
          id: "9bb6fd04-2072-467b-bcf1-b1cf19d56978",
          name: "Yuni Astuti"
        }
      }
    ]

export function   ProductsEnabled(): boolean {
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

export function getMockAllProducts():Product[]{
  return mockProducts;
}


export function getMockAllReviews():Review[]{
  return mockReviews;
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


export function getMockCategories(): Category[] {
  return mockCategories;
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