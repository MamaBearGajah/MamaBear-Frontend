import { ProductCategory } from "@/types/product";

const categories: ProductCategory[] = [
  {
    id: "cat-1",
    name: "ASI Booster Tea",
    slug: "asi-booster-tea",
    productCount: 3,
  },
  {
    id: "cat-2",
    name: "ASI Booster Capsules",
    slug: "asi-booster-capsules",
    productCount: 2,
  },
  {
    id: "cat-3",
    name: "Kookie Bites",
    slug: "kookie-bites",
    productCount: 2,
  },
  {
    id: "cat-4",
    name: "Almond Oat Cookies",
    slug: "almond-oat-cookies",
    productCount: 1,
  },
  {
    id: "cat-5",
    name: "Zoya Mix",
    slug: "zoya-mix",
    productCount: 1,
  },
  {
    id: "cat-6",
    name: "Almon Mix",
    slug: "almon-mix",
    productCount: 0,
  },
];

export const categoriesApi = {
  async getList() {
    return categories;
  },
};