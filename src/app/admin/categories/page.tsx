import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import CategoriesPageClient from "@/components/admin/CategoriesPageClient";
import { getCategoryById, getCategoryList } from "@/lib/api/categories";
import { ALL_PRODUCTS_CATEGORY } from "@/lib/categories/flattenCategories";
import {
  buildCategoryTree,
  flattenCategoryTree,
  syncCategoryTreeActiveStates,
} from "@/lib/categories/buildCategoryTree";
import { getServerSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Categories",
};

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  noStore();
  const session = await getServerSession();
  const categoriesRes = await getCategoryList();
  const flat = categoriesRes.data.filter((c) => c.id !== ALL_PRODUCTS_CATEGORY.id);
  const tree = await syncCategoryTreeActiveStates(
    buildCategoryTree(flat, { includeInactive: true }),
    getCategoryById,
  );
  const flatCategories = flattenCategoryTree(tree);

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader
        title="Categories"
        userName={session?.user.name ?? "Admin"}
        showGlobalSearch={false}
      />

      <CategoriesPageClient tree={tree} flatCategories={flatCategories} />
    </div>
  );
}
