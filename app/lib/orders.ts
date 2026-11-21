import { put, get, list, del } from "@vercel/blob";
import { randomBytes } from "crypto";
import type { CheckoutInput, OrderStatus } from "./validation";
import { ORDER_STATUS } from "./validation";

export type OrderItem = {
  productId: string;
  variantId: string;
  quantity: number;
  unitPriceCents: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: CheckoutInput["customer"];
  shippingAddress: CheckoutInput["shippingAddress"];
  items: OrderItem[];
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  createdAt: string;
  updatedAt: string;
  idempotencyKey?: string;
};

export type CreateOrderInput = CheckoutInput & {
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  idempotencyKey?: string;
};

const ORDERS_PREFIX = "orders/";

function generateOrderId(): string {
  const prefix = "SS";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${date}-${random}`;
}

function generateOrderNumber(orderId: string): string {
  return `SNIF-${orderId.slice(-8).toUpperCase()}`;
}

function orderPath(orderId: string): string {
  return `${ORDERS_PREFIX}${orderId}.json`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const id = generateOrderId();
  const now = new Date().toISOString();
  const order: Order = {
    id,
    orderNumber: generateOrderNumber(id),
    status: ORDER_STATUS.PENDING,
    customer: input.customer,
    shippingAddress: input.shippingAddress,
    items: input.items,
    subtotalCents: input.subtotalCents,
    taxCents: input.taxCents,
    shippingCents: input.shippingCents,
    totalCents: input.totalCents,
    createdAt: now,
    updatedAt: now,
    idempotencyKey: input.idempotencyKey,
  };

  await put(orderPath(id), JSON.stringify(order, null, 2), {
    access: "private",
    contentType: "application/json",
  });

  return order;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const result = await get(orderPath(orderId), { access: "private" });
    if (!result) return null;
    const response = new Response(result.stream as any, {
      headers: result.headers as any,
    });
    const json = (await response.json()) as Order;
    return json;
  } catch {
    return null;
  }
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | null> {
  try {
    const orders = await listOrders();
    return orders.find((o) => o.orderNumber === orderNumber) || null;
  } catch {
    return null;
  }
}

export async function getOrderByIdempotencyKey(
  key: string
): Promise<Order | null> {
  try {
    const orders = await listOrders();
    return orders.find((o) => o.idempotencyKey === key) || null;
  } catch {
    return null;
  }
}

export async function listOrders(): Promise<Order[]> {
  const { blobs } = await list({ prefix: ORDERS_PREFIX });
  const orders: Order[] = [];
  for (const blob of blobs) {
    const res = await get(blob.url, { access: "private" });
    if (!res) continue;
    const response = new Response(res.stream as any, {
      headers: res.headers as any,
    });
    const json = (await response.json()) as Order;
    orders.push(json);
  }
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order | null> {
  const existing = await getOrder(orderId);
  if (!existing) return null;
  const updated: Order = { ...existing, status, updatedAt: new Date().toISOString() };
  await put(orderPath(orderId), JSON.stringify(updated, null, 2), {
    access: "private",
    contentType: "application/json",
  });
  return updated;
}

export async function deleteOrder(orderId: string): Promise<void> {
  await del([orderPath(orderId)], {});
}
