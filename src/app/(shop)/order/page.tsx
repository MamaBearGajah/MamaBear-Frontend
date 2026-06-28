import { redirect } from "next/navigation";

interface OrderRedirectPageProps {
  searchParams: Promise<{ id?: string }>;
}

/** Legacy route — redirects to /order-success per Frontend Guide v2. */
export default async function OrderRedirectPage({
  searchParams,
}: OrderRedirectPageProps) {
  const params = await searchParams;
  const orderId = params.id?.trim();

  if (orderId) {
    redirect(`/order-success?orderId=${encodeURIComponent(orderId)}`);
  }

  redirect("/account/orders");
}
