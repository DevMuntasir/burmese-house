import { NextResponse } from "next/server";
import { getProducts } from "@/lib/sanity/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch admin products", error);
    return NextResponse.json([], { status: 500 });
  }
}
