import { NextRequest, NextResponse } from "next/server";

// In-memory reviews storage for mock purposes
let reviews: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const productReviews = reviews.filter((r) => r.productId === productId);
    return NextResponse.json(productReviews, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.rating || !body.review) {
      return NextResponse.json(
        { error: "Rating and review text are required" },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = {
      id: `review-${Date.now()}`,
      productId,
      userId: body.userId || "anonymous",
      orderId: body.orderId,
      rating: Math.min(5, Math.max(1, body.rating)), // Ensure 1-5
      review: body.review,
      isVerifiedPurchase: true,
      helpfulCount: 0,
      user: {
        id: body.userId || "anonymous",
        name: body.userName || "Anonymous",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    reviews.push(newReview);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
