import { NextRequest, NextResponse } from "next/server";
import { hasSanityConfig, writeClient } from "@/lib/sanity/client";
import { type DashboardOrder } from "@/lib/orders-data";
import { getAdminOrders } from "@/lib/sanity/data";
import {
  getAllStoredOrders,
  getNextOrderSequence,
  getStoredOrder,
  saveStoredOrder,
  updateStoredOrderStatus,
} from "@/lib/orders-store";

export async function GET() {
  try {
    let sanityOrders: DashboardOrder[] = [];
    if (hasSanityConfig) {
      try {
        sanityOrders = await getAdminOrders();
        // Sync into store
        sanityOrders.forEach((o) => {
          const existing = getStoredOrder(o.id);
          if (!existing) {
            saveStoredOrder(o);
          } else {
            // Keep status from existing store if more recently updated locally
            saveStoredOrder({ ...o, orderStatus: existing.orderStatus, paymentStatus: existing.paymentStatus });
          }
        });
      } catch (err) {
        console.warn("Sanity admin order fetch error", err);
      }
    }

    const stored = getAllStoredOrders();
    if (stored.length > 0) {
      return NextResponse.json(stored);
    }
    return NextResponse.json(sanityOrders);
  } catch (error) {
    console.error("Failed to load admin orders", error);
    return NextResponse.json(getAllStoredOrders());
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, orderStatus, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    // Update in Sanity if token configured
    if (hasSanityConfig && process.env.SANITY_API_WRITE_TOKEN) {
      try {
        const patchData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
        if (orderStatus) {
          patchData.orderStatus = orderStatus;
          patchData.status = orderStatus;
        }
        if (paymentStatus) {
          patchData.paymentStatus = paymentStatus;
        }
        await writeClient.patch(orderId).set(patchData).commit();
      } catch (err) {
        console.warn("Sanity patch failed", err);
      }
    }

    const updated = updateStoredOrderStatus(orderId, orderStatus, paymentStatus);
    if (updated) {
      return NextResponse.json({ success: true, order: updated });
    }

    return NextResponse.json({ success: true, updated: { orderId, orderStatus, paymentStatus } });
  } catch (error) {
    console.error("Order status update failed", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const seq = getNextOrderSequence();
    const now = new Date();
    const dateFormatted =
      now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " · " +
      now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const orderNumber = body.orderNumber || `${3000000 + Math.floor(Math.random() * 90000)}`;
    const fullOrderCode = `BH-${now.toISOString().slice(2, 10).replaceAll("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    let id = String(seq);

    // Save to Sanity if configured
    if (hasSanityConfig && process.env.SANITY_API_WRITE_TOKEN) {
      try {
        const sanityDoc = {
          _type: "order",
          orderNumber: fullOrderCode,
          customerName: body.customerName || "Walk-in Customer",
          phone: body.phone || "+8801700000000",
          email: body.email || "",
          address: body.address || "Store Walk-in Counter",
          shippingAddress: {
            district: body.district || "Dhaka",
            area: body.area || "Store Counter",
            address: body.address || "Store Walk-in Counter",
            deliveryZone: body.deliveryZone || "inside-dhaka",
          },
          subtotal: Number(body.subtotal || 0),
          shippingCharge: Number(body.shippingCharge || 0),
          total: Number(body.totalAmount || 0),
          paymentMethod: body.paymentMethod || "cod",
          paymentStatus: body.paymentStatus || "paid",
          orderStatus: body.orderStatus || "delivered",
          status: body.orderStatus || "delivered",
          customerNote: body.customerNote || "",
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          items: (body.items || []).map((i: {
            productId?: string;
            title?: string;
            variantTitle?: string;
            quantity?: number;
            unitPrice?: number;
            lineTotal?: number;
          }) => ({
            _key: crypto.randomUUID(),
            productId: i.productId,
            name: i.title,
            title: i.title,
            variantTitle: i.variantTitle,
            quantity: i.quantity,
            price: i.unitPrice,
            unitPrice: i.unitPrice,
            lineTotal: i.lineTotal,
          })),
        };
        const created = await writeClient.create(sanityDoc);
        if (created?._id) id = created._id;
      } catch (err) {
        console.warn("Could not persist manual order to Sanity", err);
      }
    }

    const newOrder: DashboardOrder = {
      id,
      orderSeq: seq,
      orderNumber,
      fullOrderCode,
      channel: body.channel || "in-shop",
      customerName: body.customerName || "Walk-in Customer",
      phone: body.phone || "+8801700000000",
      email: body.email,
      district: body.district || "Dhaka",
      area: body.area || "Store Counter",
      address: body.address || "Store Walk-in Counter",
      deliveryZone: body.deliveryZone || "inside-dhaka",
      itemsCount: body.items?.length || 1,
      totalQuantity: body.totalQuantity || 1,
      subtotal: body.subtotal || 0,
      shippingCharge: body.shippingCharge || 0,
      totalAmount: body.totalAmount || 0,
      paymentMethod: body.paymentMethod || "cod",
      paymentStatus: body.paymentStatus || "paid",
      orderStatus: body.orderStatus || "delivered",
      dateFormatted,
      createdAt: now.toISOString(),
      customerNote: body.customerNote,
      items: body.items || [],
      payment: body.payment,
    };

    saveStoredOrder(newOrder);
    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Manual order creation failed", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
