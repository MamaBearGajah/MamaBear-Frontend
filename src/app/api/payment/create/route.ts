import { NextRequest, NextResponse } from "next/server";
import { Xendit } from "xendit-node";

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId } = await req.json();

    const checkout = await (xenditClient as any).Checkout.createCheckoutSession({
      referenceId: orderId,
      amount,
      currency: "IDR",

      successReturnUrl:
        "http://localhost:3000/order-success",

      failureReturnUrl:
        "http://localhost:3000/payment",

      items: [
        {
          referenceId: orderId,
          name: "Shop Order",
          quantity: 1,
          price: amount,
          category: "Product",
        },
      ],
    });

    return NextResponse.json({
      checkoutUrl: checkout.url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create payment",
      },
      {
        status: 500,
      }
    );
  }
}