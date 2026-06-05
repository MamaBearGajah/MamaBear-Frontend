import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import ProductForm from "@/components/admin/ProductForm";
import { getCategoryList } from "@/lib/api/categories";
import { getProductById } from "@/lib/api/products";
import { getServerSession } from "@/lib/auth/session";

interface ProductFormPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductFormPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: id === "new" ? "Add Product" : "Edit Product",
  };
}

export default async function ProductFormPage({ params }: ProductFormPageProps) {
  const { id } = await params;
  const isCreate = id === "new";
  const session = await getServerSession();

  const categoriesRes = await getCategoryList();

  let product = undefined;
  if (!isCreate) {
    try {
      product = await getProductById(id, session?.accessToken);
    } catch {
      notFound();
    }
  }

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader
        title={isCreate ? "Add Product" : "Edit Product"}
        userName={session?.user.name ?? "Admin"}
        showGlobalSearch={false}
      />
      <ProductForm
        mode={isCreate ? "create" : "edit"}
        product={product}
        categories={categoriesRes.data}
      />
    </div>
  );
}