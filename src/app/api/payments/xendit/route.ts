import { NextResponse } from "next/server";
import { Xendit } from "xendit-node";

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
});

const { Invoice } = xenditClient;
const invoiceApi = new Invoice({});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const invoice = await invoiceApi.createInvoice({
      externalId: `ORDER-${Date.now()}`,
      amount: body.amount,
      payerEmail: body.email,
      description: "Order Payment",
      successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/order-success`,
      failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment`,
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create invoice" },
      { status: 500 },
    );
  }
}
