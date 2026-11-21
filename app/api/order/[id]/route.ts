import { NextResponse } from "next/server";
import { getOrder } from "@/app/lib/orders";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrder(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Return order data without exposing sensitive internal fields
    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalCents: order.totalCents,
      createdAt: order.createdAt,
      items: order.items,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to retrieve order" },
      { status: 500 }
    );
  }
}
