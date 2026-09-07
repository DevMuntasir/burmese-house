import type { Category, Product, ProductVariant, StoreSettings } from "@/lib/types";
import { type DashboardOrder, type OrderItemDetail } from "@/lib/orders-data";
import { categories as fallbackCategories, products as fallbackProducts, storeSettings as fallbackSettings } from "@/lib/mock-data";
import { hasSanityConfig, sanityClient } from "./client";
import { categoriesQuery, settingsQuery } from "./queries";

function resolveText(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    return val
      .map((block: { children?: Array<{ text?: string }> }) =>
        block.children ? block.children.map((c) => c.text || "").join("") : ""
      )
      .join("\n");
  }
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    return String(obj.bn || obj.en || Object.values(obj)[0] || "");
  }
  return String(val);
}

function slugify(text: string): string {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const rawProductsQuery = `*[_type == "product" && (active == true || !defined(active))] | order(_createdAt desc){
  _id,
  _createdAt,
  title,
  name,
  slug,
  shortDescription,
  subtitle,
  description,
  regularPrice,
  salePrice,
  price,
  stockQuantity,
  stockManagement,
  isFeatured,
  isBestSeller,
  isNewArrival,
  sku,
  weight,
  badge,
  category->{name, "slug": slug.current},
  "images": coalesce(
    images[].asset->url,
    [image.asset->url],
    []
  ),
  variants[]{_key, title, sku, options, stock, priceAdjustment, active, "image": image.asset->url},
  specifications[]{label, value}
}`;

export function normalizeSanityProduct(p: {
  _id: string;
  title?: string;
  name?: unknown;
  slug?: { current?: string } | string;
  shortDescription?: string;
  subtitle?: unknown;
  description?: unknown;
  regularPrice?: number;
  salePrice?: number;
  price?: number;
  stockQuantity?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  sku?: string;
  weight?: string;
  badge?: unknown;
  category?: { name: string; slug?: string };
  images?: string[];
  variants?: Array<{
    _key?: string;
    title: string;
    sku?: string;
    options?: Record<string, string>;
    stock?: number;
    priceAdjustment?: number;
    image?: string;
    active?: boolean;
  }>;
  specifications?: Array<{ label: string; value: string }>;
}): Product {
  const title = p.title || resolveText(p.name) || "Burmese Special";
  let slug = (typeof p.slug === "object" ? p.slug?.current : p.slug);
  if (!slug) {
    if (p._id === "794d6693-66ab-490d-ba0f-8925ef5245fe") slug = "special-biriyani-chanachur";
    else if (p._id === "b94724c7-34f5-40d1-810d-64b9b5e21fc3") slug = "999-burmese-achar";
    else if (p._id === "c788b470-3b5d-4a6d-a3ee-a6511f245038") slug = "555-burmese-achar";
    else if (p._id === "e320115d-4e2a-43d5-b524-881a7762c03e") slug = "modhubon-chanachur";
    else slug = slugify(p.name ? resolveText(p.name) : title) || p._id;
  }

  const regularPrice = Number(p.regularPrice ?? p.price ?? 200);
  const salePrice = p.salePrice ? Number(p.salePrice) : undefined;
  const shortDescription =
    p.shortDescription ||
    resolveText(p.subtitle) ||
    resolveText(p.badge) ||
    "Authentic Burmese House handcrafted specialty.";
  const description =
    resolveText(p.description) ||
    shortDescription ||
    "Authentic traditional recipe prepared with premium natural spices and ingredients.";

  const images =
    p.images && p.images.length > 0 && p.images[0]
      ? p.images
      : ["/images/mango-chutney.png"];

  const isChanachur = title.includes("চানাচুর") || title.toLowerCase().includes("chanachur");
  const category = p.category
    ? { name: p.category.name, slug: p.category.slug || "achar" }
    : isChanachur
    ? { name: "Chanachur", slug: "chanachur" }
    : { name: "Burmese Achar", slug: "burmese-achar" };

  const variants: ProductVariant[] =
    Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants.map((v) => ({
          _key: v._key || crypto.randomUUID(),
          title: v.title,
          sku: v.sku || `${p.sku || "BH"}-${v.title}`,
          options: v.options || { Option: v.title },
          stock: v.stock ?? 30,
          priceAdjustment: v.priceAdjustment,
          image: v.image,
          active: v.active ?? true,
        }))
      : p.weight
      ? [
          {
            _key: "default-weight",
            title: String(p.weight),
            sku: p.sku || `BH-${p._id.slice(0, 5)}`,
            options: { Pack: String(p.weight) },
            stock: typeof p.stockQuantity === "number" ? p.stockQuantity : 40,
            active: true,
          },
        ]
      : [];

  return {
    _id: p._id,
    title,
    slug,
    shortDescription,
    description,
    images,
    category,
    sku: p.sku || `BH-${p._id.slice(0, 5).toUpperCase()}`,
    regularPrice,
    salePrice,
    isFeatured: Boolean(p.isFeatured ?? true),
    isBestSeller: Boolean(p.isBestSeller ?? true),
    isNewArrival: Boolean(p.isNewArrival),
    stockQuantity: typeof p.stockQuantity === "number" ? p.stockQuantity : 40,
    soldCount: 15,
    variants: variants.length > 0 ? variants : undefined,
    specifications:
      p.specifications || (p.weight ? [{ label: "Net Weight / Pack", value: String(p.weight) }] : undefined),
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!hasSanityConfig) return fallbackProducts;
  try {
    const raw = await sanityClient.fetch<Parameters<typeof normalizeSanityProduct>[0][]>(
      rawProductsQuery,
      {},
      { next: { revalidate: 30, tags: ["products"] } }
    );
    if (raw && raw.length > 0) {
      return raw.map(normalizeSanityProduct);
    }
    return fallbackProducts;
  } catch (err) {
    console.warn("Sanity fetch products error, falling back", err);
    return fallbackProducts;
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await getProducts();
  const found = all.find(
    (item) =>
      item.slug === slug ||
      item._id === slug ||
      slugify(item.title) === slugify(slug)
  );
  return found ?? null;
}

export async function getCategories(): Promise<Category[]> {
  if (!hasSanityConfig) return fallbackCategories;
  try {
    const data = await sanityClient.fetch<Category[]>(
      categoriesQuery,
      {},
      { next: { revalidate: 60, tags: ["categories"] } }
    );
    if (data && data.length > 0) {
      return data;
    }
    // If only 1 category in Sanity, include dynamic categories from products
    const prods = await getProducts();
    const categoriesMap = new Map<string, Category>();
    prods.forEach((p) => {
      if (p.category) {
        categoriesMap.set(p.category.slug, {
          _id: "cat-" + p.category.slug,
          name: p.category.name,
          slug: p.category.slug,
          image: p.images[0] || "/images/mango-chutney.png",
          featured: true,
        });
      }
    });
    return categoriesMap.size > 0 ? Array.from(categoriesMap.values()) : fallbackCategories;
  } catch {
    return fallbackCategories;
  }
}

export async function getStoreSettings(): Promise<StoreSettings> {
  if (!hasSanityConfig) return fallbackSettings;
  try {
    const data = await sanityClient.fetch<Record<string, Record<string, unknown> | null>>(
      settingsQuery,
      {},
      { next: { revalidate: 60, tags: ["settings"] } }
    );
    const store = data.store ?? {};
    const shipping = data.shipping ?? {};
    const payment = data.payment ?? {};
    return { ...fallbackSettings, ...store, ...shipping, ...payment } as StoreSettings;
  } catch {
    return fallbackSettings;
  }
}

export async function getAdminOrders(): Promise<DashboardOrder[]> {
  if (!hasSanityConfig) return [];
  try {
    const [sanityOrders, products] = await Promise.all([
      sanityClient.fetch<Array<{
        _id: string;
        _createdAt?: string;
        orderNumber?: string;
        customerName?: string;
        phone?: string;
        email?: string;
        address?: string;
        shippingAddress?: { district?: string; area?: string; address?: string; deliveryZone?: string };
        items?: Array<{
          name?: string;
          title?: string;
          weight?: string;
          variantTitle?: string;
          imageUrl?: string;
          productId?: string;
          product?: { _ref?: string };
          quantity?: number;
          price?: number;
          unitPrice?: number;
          lineTotal?: number;
          sku?: string;
        }>;
        subtotal?: number;
        shippingCharge?: number;
        delivery?: number;
        total?: number;
        paymentMethod?: string;
        paymentStatus?: "unpaid" | "submitted" | "paid" | "failed";
        orderStatus?: "placed" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
        status?: string;
        customerNote?: string;
        note?: string;
        createdAt?: string;
        placedAt?: string;
        payment?: { senderNumber?: string; transactionId?: string; submittedAt?: string };
      }>>(`*[_type == "order" && !(_id in path("drafts.**"))] | order(coalesce(createdAt, placedAt, _createdAt) desc)`),
      getProducts(),
    ]);

    const productMap = new Map<string, Product>();
    products.forEach((p) => productMap.set(p._id, p));

    if (!sanityOrders || sanityOrders.length === 0) {
      return [];
    }

    const mapped: DashboardOrder[] = sanityOrders.map((s, idx) => {
      const rawDate = s.createdAt || s.placedAt || s._createdAt;
      const date = rawDate ? new Date(rawDate) : new Date();
      const dateFormatted =
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
        " · " +
        date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      const seq = sanityOrders.length - idx;

      const items: OrderItemDetail[] = (s.items || []).map((i) => {
        const prodRef = i.product?._ref || i.productId;
        const matched = prodRef ? productMap.get(prodRef) : undefined;
        const title = i.title || i.name || matched?.title || "Burmese Special";
        const imageUrl = i.imageUrl || matched?.images?.[0] || "/images/mango-chutney.png";
        const unitPrice = Number(i.unitPrice ?? i.price ?? 0);
        const quantity = Number(i.quantity ?? 1);
        const lineTotal = Number(i.lineTotal ?? unitPrice * quantity);

        return {
          productId: prodRef || "sanity-item",
          title,
          variantTitle: i.variantTitle || i.weight || "",
          imageUrl,
          quantity,
          unitPrice,
          lineTotal,
          sku: i.sku,
        };
      });

      const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = Number(s.subtotal ?? s.total ?? 0);
      const shippingCharge = Number(s.shippingCharge ?? s.delivery ?? 80);
      const totalAmount = Number(s.total ?? subtotal + shippingCharge);

      let orderStatus: DashboardOrder["orderStatus"] = "placed";
      const rawStatus = s.orderStatus || s.status;
      if (rawStatus === "delivered") orderStatus = "delivered";
      else if (rawStatus === "shipped") orderStatus = "shipped";
      else if (rawStatus === "processing") orderStatus = "processing";
      else if (rawStatus === "confirmed") orderStatus = "confirmed";
      else if (rawStatus === "cancelled") orderStatus = "cancelled";

      const paymentMethod = s.paymentMethod === "bkash" ? "bkash" : "cod";
      let paymentStatus: DashboardOrder["paymentStatus"] = "unpaid";
      if (s.paymentStatus) paymentStatus = s.paymentStatus;
      else if (paymentMethod === "bkash") paymentStatus = "submitted";

      return {
        id: s._id,
        orderSeq: seq,
        orderNumber: s.orderNumber?.replace(/^BH-/, "") || String(seq),
        fullOrderCode: s.orderNumber || `BH-${seq}`,
        channel: "online",
        customerName: s.customerName || "Customer",
        phone: s.phone || "",
        email: s.email,
        district:
          s.shippingAddress?.district || (s.address?.toLowerCase().includes("dhaka") ? "Dhaka" : "Dhaka"),
        area: s.shippingAddress?.area || (s.address ? s.address.split("\n")[0] : "Dhaka"),
        address: s.shippingAddress?.address || s.address || "",
        deliveryZone: (s.shippingAddress?.deliveryZone as "inside-dhaka" | "outside-dhaka") || "inside-dhaka",
        itemsCount: items.length,
        totalQuantity: totalQty,
        subtotal,
        shippingCharge,
        totalAmount,
        paymentMethod,
        paymentStatus,
        orderStatus,
        dateFormatted,
        createdAt: date.toISOString(),
        customerNote: s.customerNote || s.note,
        items,
        payment: s.payment,
      };
    });

    return mapped;
  } catch (err) {
    console.warn("Failed to fetch admin orders from Sanity", err);
    return [];
  }
}

