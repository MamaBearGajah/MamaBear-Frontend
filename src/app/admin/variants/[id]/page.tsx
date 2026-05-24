import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import ProductForm from "@/components/admin/ProductForm";
import { getCategoryList } from "@/lib/api/categories";
import { getProductById } from "@/lib/api/products";
import { getServerSession } from "@/lib/auth/session";

interface VariantsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: VariantsPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: id === "new" ? "Add Variant" : "Edit Variant",
  };
}

export default async function VariantsPage({ params }: VariantsPageProps) {
  const { id } = await params;
  const isCreate = id === "new";
  const session = await getServerSession();

  const categoriesRes = await getCategoryList(session?.accessToken);

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
        title={isCreate ? "Add Variant" : "Edit Variant"}
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
