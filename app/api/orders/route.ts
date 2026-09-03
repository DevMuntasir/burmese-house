import { NextRequest, NextResponse } from "next/server";
import { getProducts, getStoreSettings } from "@/lib/sanity/data";
import { hasSanityConfig, sanityClient, writeClient } from "@/lib/sanity/client";
import { orderSchema } from "@/lib/validations/order";

export async function POST(request: NextRequest) {
  try {
    const parsed = orderSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid order details" }, { status: 400 });
    const input = parsed.data;
    const [products, settings] = await Promise.all([getProducts(), getStoreSettings()]);
    const orderItems = [];
    for (const item of input.items) {
      const product = products.find((entry) => entry._id === item.productId);
      if (!product) return NextResponse.json({ error: "A product in your cart is no longer available" }, { status: 409 });
      const variant = item.variantKey ? product.variants?.find((entry) => entry._key === item.variantKey && entry.active) : undefined;
      if (item.variantKey && !variant) return NextResponse.json({ error: `The selected option for ${product.title} is unavailable` }, { status: 409 });
      const stock = variant?.stock ?? product.stockQuantity;
      if (stock < item.quantity) return NextResponse.json({ error: `Only ${stock} of ${product.title} are available` }, { status: 409 });
      const unitPrice = (product.salePrice && product.salePrice < product.regularPrice ? product.salePrice : product.regularPrice) + (variant?.priceAdjustment ?? 0);
      orderItems.push({ _key: crypto.randomUUID(), productId: product._id, product: { _type: "reference", _ref: product._id }, title: product.title, sku: variant?.sku ?? product.sku, variantTitle: variant?.title, imageUrl: variant?.image ?? product.images?.[0], quantity: item.quantity, unitPrice, lineTotal: unitPrice * item.quantity });
    }
    if (input.paymentMethod === "bkash" && hasSanityConfig && input.transactionId) {
      const exists = await sanityClient.fetch<string | null>(`*[_type == "order" && payment.transactionId == $transactionId][0]._id`, { transactionId: input.transactionId });
      if (exists) return NextResponse.json({ error: "This Transaction ID has already been used" }, { status: 409 });
    }
    const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingCharge = input.deliveryZone === "inside-dhaka" ? settings.insideDhakaCharge : settings.outsideDhakaCharge;
    const total = subtotal + shippingCharge;
    const orderNumber = `BH-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`;
    const order = { _type: "order", orderNumber, customerName: input.customerName, phone: input.phone, email: input.email, shippingAddress: { district: input.district, area: input.area, address: input.address, deliveryZone: input.deliveryZone }, items: orderItems, subtotal, shippingCharge, discount: 0, total, paymentMethod: input.paymentMethod, payment: input.paymentMethod === "bkash" ? { senderNumber: input.senderBkashNumber, transactionId: input.transactionId, submittedAt: new Date().toISOString() } : undefined, paymentStatus: input.paymentMethod === "bkash" ? "submitted" : "unpaid", orderStatus: "placed", customerNote: input.note, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    let id = orderNumber;
    if (hasSanityConfig && process.env.SANITY_API_WRITE_TOKEN) id = (await writeClient.create(order))._id;
    return NextResponse.json({ orderId: id, orderNumber, total, status: "placed", paymentStatus: order.paymentStatus });
  } catch (error) {
    console.error("Order creation failed", error);
    return NextResponse.json({ error: "We could not place your order. Please try again." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("orderNumber")?.trim();
  const phone = request.nextUrl.searchParams.get("phone")?.trim();
  if (!orderNumber || !phone || !/^01[3-9]\d{8}$/.test(phone)) return NextResponse.json({ error: "Order number and valid phone number are required" }, { status: 400 });
  if (!hasSanityConfig) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const order = await sanityClient.fetch(`*[_type == "order" && orderNumber == $orderNumber && phone == $phone][0]{orderNumber, customerName, phone, items[]{title, quantity, unitPrice, lineTotal, variantTitle}, subtotal, shippingCharge, total, paymentMethod, paymentStatus, orderStatus, createdAt}`, { orderNumber, phone });
  return order ? NextResponse.json(order) : NextResponse.json({ error: "No matching order found" }, { status: 404 });
}
