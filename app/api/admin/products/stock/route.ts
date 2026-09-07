import { NextRequest, NextResponse } from "next/server";
import { hasSanityConfig, writeClient } from "@/lib/sanity/client";

export async function PATCH(request: NextRequest) {
  try {
    const { productId, stockQuantity } = await request.json();

    if (!productId || typeof stockQuantity !== "number") {
      return NextResponse.json(
        { error: "productId and numeric stockQuantity are required" },
        { status: 400 }
      );
    }

    if (hasSanityConfig && process.env.SANITY_API_WRITE_TOKEN) {
      try {
        await writeClient
          .patch(productId)
          .set({
            stockQuantity,
            stockManagement: true,
          })
          .commit();
      } catch (err) {
        console.warn("Sanity stock update warning", err);
      }
    }

    return NextResponse.json({ success: true, productId, stockQuantity });
  } catch (error) {
    console.error("Failed to update stock", error);
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}
