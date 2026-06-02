import VariantFormComponent from "@/components/admin/VariantFormComponent";
import { variantApi } from "@/lib/api/variants";

export default async function CreateVariantPage() {
  const { data: productOptions } = await variantApi.getAllProductNameAndId();

  return (
    <VariantFormComponent
      isEdit={false}
      productOptions={productOptions?.data}
    />
  );
}
