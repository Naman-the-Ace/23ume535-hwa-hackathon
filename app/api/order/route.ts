import { NextResponse } from "next/server";
import { createOrder } from "@/app/lib/orders";
import { checkoutSchema } from "@/app/lib/validation";
import { product } from "@/app/lib/product";

const TAX_RATE = 0.08;
const SHIPPING_CENTS = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated = checkoutSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { message: "Validation error", errors: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { customer, shippingAddress, items } = validated.data;

    // Server-side price calculation — never trust client totals
    let subtotalCents = 0;
    const validatedItems = items.map((item) => {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new Error(`Invalid variant: ${item.variantId}`);
      }
      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${variant.name}`);
      }
      const variantPrice = product.priceCents + variant.priceDelta;
      subtotalCents += variantPrice * item.quantity;
      return {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      };
    });

    const taxCents = Math.round(subtotalCents * TAX_RATE);
    const totalCents = subtotalCents + taxCents + SHIPPING_CENTS;

    const order = await createOrder({
      customer,
      shippingAddress,
      items: validatedItems,
      subtotalCents,
      taxCents,
      shippingCents: SHIPPING_CENTS,
      totalCents,
    });

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      totalCents: order.totalCents,
      status: order.status,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to create order" },
      { status: 400 }
    );
  }
}
