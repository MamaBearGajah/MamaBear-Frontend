import AdminPageHeader from "@/components/layout/AdminPageHeader";
import VariantForm from "./VariantForm";

export default async function VariantFormComponent({
  productId,
  variantId,
  isEdit,
  variant,
  productOptions,
}: {
  productId?: string;
  variantId?: string;
  isEdit: boolean;
  variant?: any;
  productOptions?: any;
}) {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader
        title={isEdit ? "Edit Variant" : "Add Variant"}
        userName={"Admin"}
        showGlobalSearch={false}
      />
      <VariantForm
        mode={isEdit ? "edit" : "create"}
        variant={variant}
        productId={productId}
        variantId={variantId}
        productOptions={productOptions}
      />
    </div>
  );
}
