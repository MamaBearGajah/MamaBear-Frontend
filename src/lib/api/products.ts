import {
  Product,
  ProductListResponse,
  ProductSort,
} from "@/types/product";

type GetProductListParams = {
  search?: string;
  categories?: string;
  sort?: ProductSort;
  page?: number;
  price?: string;
  stock?: string;
};

const products: Product[] = [
  {
    id: "1",
    slug: "zoya-mix-cokelat",
    name: "Zoya Mix – Cokelat",
    category: {
      id: "cat-5",
      name: "Zoya Mix",
      slug: "zoya-mix",
    },
    images: [
      {
        id: "img-1",
        url: "/images/products/zoya-mix.jpg",
        alt: "Zoya Mix Cokelat",
        isFeatured: true,
      },
    ],
    flavors: [
      { id: "flv-1", name: "Cokelat" },
      { id: "flv-2", name: "Vanilla" },
      { id: "flv-3", name: "Original" },
    ],
    price: 80000,
    discountPrice: 65000,
    stock: 10,
    averageRating: 4.8,
    reviewCount: 284,
    isBestSeller: true,
    createdAt: "2025-03-09",
  },
  {
    id: "2",
    slug: "mamabear-lactation-tea",
    name: "Mamabear Lactation Tea",
    category: {
      id: "cat-1",
      name: "ASI Booster Tea",
      slug: "asi-booster-tea",
    },
    images: [
      {
        id: "img-2",
        url: "/images/products/lactation-tea.jpg",
        alt: "Mamabear Lactation Tea",
        isFeatured: true,
      },
    ],
    flavors: [
      { id: "flv-4", name: "Lychee" },
      { id: "flv-5", name: "Peach" },
      { id: "flv-6", name: "Original" },
    ],
    price: 65000,
    discountPrice: null,
    stock: 16,
    averageRating: 4.7,
    reviewCount: 156,
    isNew: true,
    createdAt: "2025-03-08",
  },
  {
    id: "3",
    slug: "mamabear-lactation-capsules",
    name: "Mamabear Lactation Capsules",
    category: {
      id: "cat-2",
      name: "ASI Booster Capsules",
      slug: "asi-booster-capsules",
    },
    images: [
      {
        id: "img-3",
        url: "/images/products/lactation-capsules.jpg",
        alt: "Mamabear Lactation Capsules",
        isFeatured: true,
      },
    ],
    flavors: [],
    price: 75000,
    discountPrice: 65000,
    stock: 4,
    averageRating: 4.9,
    reviewCount: 312,
    isPopular: true,
    createdAt: "2025-03-07",
  },
  {
    id: "4",
    slug: "almond-oat-cookies-cream",
    name: "Almond Oat Cookies & Cream",
    category: {
      id: "cat-4",
      name: "Almond Oat Cookies",
      slug: "almond-oat-cookies",
    },
    images: [
      {
        id: "img-4",
        url: "/images/products/almond-oat-cookies.jpg",
        alt: "Almond Oat Cookies and Cream",
        isFeatured: true,
      },
    ],
    flavors: [
      { id: "flv-7", name: "Cookies" },
      { id: "flv-8", name: "Cream" },
      { id: "flv-9", name: "Almond" },
    ],
    price: 120000,
    discountPrice: null,
    stock: 11,
    averageRating: 4.6,
    reviewCount: 423,
    badgeLabel: "Most Popular",
    isPopular: true,
    createdAt: "2025-03-06",
  },
  {
    id: "5",
    slug: "kookie-bites-less-sugar-coconut",
    name: "Kookie Bites Less Sugar - Coconut",
    category: {
      id: "cat-3",
      name: "Kookie Bites",
      slug: "kookie-bites",
    },
    images: [
      {
        id: "img-5",
        url: "/images/products/kookie-bites-coconut.jpg",
        alt: "Kookie Bites Less Sugar Coconut",
        isFeatured: true,
      },
    ],
    flavors: [
      { id: "flv-10", name: "Choco Nut" },
      { id: "flv-11", name: "Coconut" },
      { id: "flv-12", name: "Less Sugar" },
    ],
    price: 180000,
    discountPrice: null,
    stock: 8,
    averageRating: 4.9,
    reviewCount: 189,
    badgeLabel: "Premium",
    createdAt: "2025-03-05",
  },
  {
    id: "6",
    slug: "almonmix-all-variants",
    name: "AlmonMix - All Variants",
    category: {
      id: "cat-6",
      name: "Almon Mix",
      slug: "almon-mix",
    },
    images: [
      {
        id: "img-6",
        url: "/images/products/almonmix.jpg",
        alt: "AlmonMix All Variants",
        isFeatured: true,
      },
    ],
    flavors: [
      { id: "flv-13", name: "Original" },
      { id: "flv-14", name: "Chocolate" },
      { id: "flv-15", name: "Matcha" },
      { id: "flv-16", name: "Vanilla" },
    ],
    price: 55000,
    discountPrice: null,
    stock: 20,
    averageRating: 4.8,
    reviewCount: 367,
    badgeLabel: "Fan Favorite",
    createdAt: "2025-03-04",
  },
  {
    id: "7",
    slug: "kukis-almond-oat",
    name: "Kukis Almond Oat",
    category: {
      id: "cat-4",
      name: "Almond Oat Cookies",
      slug: "almond-oat-cookies",
    },
    images: [
      {
        id: "img-7",
        url: "/images/products/kukis-almond-oat.jpg",
        alt: "Kukis Almond Oat",
        isFeatured: true,
      },
    ],
    flavors: [
      { id: "flv-17", name: "Almond" },
      { id: "flv-18", name: "Oat" },
    ],
    price: 55000,
    discountPrice: null,
    stock: 7,
    averageRating: 4.7,
    reviewCount: 201,
    createdAt: "2025-03-03",
  },
  {
    id: "8",
    slug: "mamabear-asi-booster-capsules",
    name: "Mamabear ASI Booster Capsules",
    category: {
      id: "cat-2",
      name: "ASI Booster Capsules",
      slug: "asi-booster-capsules",
    },
    images: [
      {
        id: "img-8",
        url: "/images/products/asi-booster-capsules.jpg",
        alt: "Mamabear ASI Booster Capsules",
        isFeatured: true,
      },
    ],
    flavors: [],
    price: 90000,
    discountPrice: 75000,
    stock: 13,
    averageRating: 4.7,
    reviewCount: 298,
    badgeLabel: "Sale",
    createdAt: "2025-03-02",
  },
  {
    id: "9",
    slug: "kookie-bites-less-sugar",
    name: "Kookie Bites - Less Sugar",
    category: {
      id: "cat-3",
      name: "Kookie Bites",
      slug: "kookie-bites",
    },
    images: [
      {
        id: "img-9",
        url: "/images/products/kookie-bites.jpg",
        alt: "Kookie Bites Less Sugar",
        isFeatured: true,
      },
    ],
    flavors: [
      { id: "flv-19", name: "Choco Nut" },
      { id: "flv-20", name: "Less Sugar" },
    ],
    price: 85000,
    discountPrice: null,
    stock: 15,
    averageRating: 4.8,
    reviewCount: 145,
    isNew: true,
    createdAt: "2025-03-01",
  },
];

function getEffectivePrice(product: Product) {
  return product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;
}

function filterBySearch(items: Product[], search?: string) {
  if (!search) return items;

  const normalizedSearch = search.toLowerCase().trim();

  return items.filter((product) => {
    const searchableText = [
      product.name,
      product.category.name,
      product.category.slug,
      ...(product.flavors?.map((flavor) => flavor.name) ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });
}

function filterByCategories(items: Product[], categories?: string) {
  if (!categories) return items;

  const selectedCategories = categories.split(",").filter(Boolean);

  if (selectedCategories.length === 0) return items;

  return items.filter((product) =>
    selectedCategories.includes(product.category.slug)
  );
}

function filterByPrice(items: Product[], price?: string) {
  if (!price) return items;

  return items.filter((product) => {
    const effectivePrice = getEffectivePrice(product);

    if (price === "under-70000") {
      return effectivePrice < 70000;
    }

    if (price === "70000-100000") {
      return effectivePrice >= 70000 && effectivePrice <= 100000;
    }

    if (price === "100000-150000") {
      return effectivePrice >= 100000 && effectivePrice <= 150000;
    }

    if (price === "above-150000") {
      return effectivePrice > 150000;
    }

    return true;
  });
}

function filterByStock(items: Product[], stock?: string) {
  if (stock !== "in-stock") return items;

  return items.filter((product) => product.stock > 0);
}

function sortProducts(items: Product[], sort: ProductSort = "newest") {
  return [...items].sort((a, b) => {
    const priceA = getEffectivePrice(a);
    const priceB = getEffectivePrice(b);

    if (sort === "price-asc") {
      return priceA - priceB;
    }

    if (sort === "price-desc") {
      return priceB - priceA;
    }

    if (sort === "rating") {
      return (b.averageRating ?? 0) - (a.averageRating ?? 0);
    }

    if (sort === "popular") {
      return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    }

    return (
      new Date(b.createdAt ?? "").getTime() -
      new Date(a.createdAt ?? "").getTime()
    );
  });
}

export const productsApi = {
  async getList(params: GetProductListParams): Promise<ProductListResponse> {
    const page = Math.max(Number(params.page ?? 1), 1);
    const limit = 8;

    let result = [...products];

    result = filterBySearch(result, params.search);
    result = filterByCategories(result, params.categories);
    result = filterByPrice(result, params.price);
    result = filterByStock(result, params.stock);
    result = sortProducts(result, params.sort);

    const total = result.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(page, totalPages);

    const start = (safePage - 1) * limit;
    const paginatedProducts = result.slice(start, start + limit);

    return {
      products: paginatedProducts,
      total,
      totalPages,
      currentPage: safePage,
    };
  },
};