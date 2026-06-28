import { updateOrder } from "@/lib/api/orders";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("xendit webhook:", body);

  if (body.status === "SUCCEEDED") {
    try {
      await updateOrder(body.reference_id, { status: "PAID" });
    } catch (err) {
      console.error("failed to update order from xendit webhook", err);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}