import VariantFormComponent from "@/components/admin/VariantFormComponent";
import { variantApi } from "@/lib/api/variants";

interface VariantsIdPageProps {
  params: Promise<{ productId: string; variantId: string; isEdit: boolean }>;
}

export default async function VariantsPage({ params }: VariantsIdPageProps) {
  const { productId, variantId } = await params;
  const { data: variant } = await variantApi.getByProductAndVariantId(
    productId,
    variantId
  );
  return (
    <VariantFormComponent
      productId={productId}
      variantId={variantId}
      isEdit={false}
      variant={variant?.data}
    />
  );
}
