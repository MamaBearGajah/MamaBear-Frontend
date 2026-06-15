export async function POST(req: Request) {
  const body = await req.json();

  console.log(body);

  if (body.status === "SUCCEEDED") {

    await updateOrder(
      body.reference_id,
      "PAID"
    );
  }

  return Response.json({
    success: true,
  });
}q