import VariantFormComponent from "@/components/admin/VariantFormComponent";
import { variantApi } from "@/lib/api/variants";

export default async function CreateVariantPage() {
  let productOptions: any = undefined;
  try {
    const res = await variantApi.getAllProductNameAndId();
    productOptions = res.data;
  } catch (err) {
    // If backend is not available during build, fallback to empty list
    productOptions = { data: [] };
  }

  return (
    <VariantFormComponent isEdit={false} productOptions={productOptions?.data} />
  );
}
