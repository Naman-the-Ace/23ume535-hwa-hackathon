import { NextResponse } from "next/server";
import { createOrder, getOrderByIdempotencyKey } from "@/app/lib/orders";
import { checkoutSchema } from "@/app/lib/validation";
import { product } from "@/app/lib/product";

const TAX_RATE = 0.08;
const SHIPPING_CENTS = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Idempotency: check for duplicate order by idempotency key
    const idempotencyKey = req.headers.get("idempotency-key") || undefined;
    if (idempotencyKey) {
      const existing = await getOrderByIdempotencyKey(idempotencyKey);
      if (existing) {
        return NextResponse.json({
          id: existing.id,
          orderNumber: existing.orderNumber,
          totalCents: existing.totalCents,
          status: existing.status,
          duplicate: true,
        });
      }
    }

    const validated = checkoutSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: validated.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { customer, shippingAddress, items } = validated.data;

    // Validate product ID
    const invalidProductId = items.find(
      (i) => i.productId !== product.id
    );
    if (invalidProductId) {
      return NextResponse.json(
        { message: `Invalid product ID: ${invalidProductId.productId}` },
        { status: 400 }
      );
    }

    // Server-side price calculation — never trust client totals
    let subtotalCents = 0;
    const validatedItems = items.map((item) => {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new Error(`Invalid variant: ${item.variantId}`);
      }
      // Enforce quantity limit server-side (1-10)
      if (item.quantity < 1 || item.quantity > 10) {
        throw new Error(
          `Invalid quantity for ${variant.name}: must be between 1 and 10`
        );
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
        unitPriceCents: variantPrice,
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
      idempotencyKey,
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
