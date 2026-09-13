import { defineArrayMember, defineField, defineType } from "sanity";

export const category = defineType({
  name: "category", title: "Categories", type: "document", fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }), defineField({ name: "slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }), defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "active", type: "boolean", initialValue: true }), defineField({ name: "sortOrder", type: "number", initialValue: 10, validation: (rule) => rule.integer().min(0) }), defineField({ name: "featured", type: "boolean", initialValue: false }),
  ], orderings: [{ title: "Manual order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }], preview: { select: { title: "name", media: "image", active: "active" }, prepare: ({ title, media, active }) => ({ title, subtitle: active ? "Active" : "Hidden", media }) }
});

export const product = defineType({
  name: "product", title: "Products", type: "document", groups: [{ name: "content", title: "Content", default: true }, { name: "commerce", title: "Price & stock" }, { name: "marketing", title: "Marketing" }, { name: "search", title: "SEO" }], fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (rule) => rule.required() }), defineField({ name: "slug", type: "slug", group: "content", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "shortDescription", type: "text", rows: 2, group: "content", validation: (rule) => rule.required().max(220) }), defineField({ name: "description", type: "array", group: "content", of: [defineArrayMember({ type: "block" })] }),
    defineField({ name: "images", type: "array", group: "content", of: [defineArrayMember({ type: "image", options: { hotspot: true } })], validation: (rule) => rule.required().min(1) }), defineField({ name: "category", type: "reference", group: "content", to: [{ type: "category" }], validation: (rule) => rule.required() }),
    defineField({ name: "sku", title: "SKU", type: "string", group: "commerce", validation: (rule) => rule.required() }), defineField({ name: "regularPrice", type: "number", group: "commerce", validation: (rule) => rule.required().positive() }), defineField({ name: "salePrice", type: "number", group: "commerce", validation: (rule) => rule.positive().custom((value, context) => !value || !context.document?.regularPrice || value <= Number(context.document.regularPrice) ? true : "Sale price must not exceed regular price") }),
    defineField({ name: "stockManagement", type: "boolean", group: "commerce", initialValue: true }), defineField({ name: "stockQuantity", type: "number", group: "commerce", initialValue: 0, validation: (rule) => rule.integer().min(0) }), defineField({ name: "variants", type: "array", group: "commerce", of: [defineArrayMember({ type: "productVariant" })] }), defineField({ name: "soldCount", type: "number", group: "commerce", initialValue: 0, readOnly: true }),
    defineField({ name: "rating", title: "Rating (1 - 5)", description: "Product rating out of 5 (e.g., 4.5, 4.8, 5.0)", type: "number", group: "marketing", initialValue: 4.8, validation: (rule) => rule.min(1).max(5).precision(1) }),
    defineField({ name: "active", type: "boolean", group: "marketing", initialValue: true }), defineField({ name: "isFeatured", type: "boolean", group: "marketing", initialValue: false }), defineField({ name: "isBestSeller", type: "boolean", group: "marketing", initialValue: false }), defineField({ name: "isNewArrival", type: "boolean", group: "marketing", initialValue: false }), defineField({ name: "sortOrder", type: "number", group: "marketing", initialValue: 10 }), defineField({ name: "specifications", type: "array", group: "content", of: [defineArrayMember({ type: "specification" })] }), defineField({ name: "seo", type: "seo", group: "search" }), defineField({ name: "createdAt", type: "datetime", readOnly: true, initialValue: () => new Date().toISOString() }),
  ], preview: { select: { title: "title", media: "images.0", price: "salePrice", regular: "regularPrice", stock: "stockQuantity", active: "active", rating: "rating" }, prepare: ({ title, media, price, regular, stock, active, rating }) => ({ title, subtitle: `${active ? "" : "HIDDEN · "}৳${price || regular} · ${stock ?? 0} in stock${rating ? ` · ★ ${rating}` : ""}`, media }) }
});

export const order = defineType({
  name: "order", title: "Orders", type: "document", groups: [{ name: "overview", title: "Overview", default: true }, { name: "customer", title: "Customer" }, { name: "payment", title: "Payment" }, { name: "notes", title: "Notes" }], fields: [
    defineField({ name: "orderNumber", type: "string", group: "overview", readOnly: true }), defineField({ name: "customerReference", type: "reference", group: "customer", to: [{ type: "customer" }] }), defineField({ name: "customerName", type: "string", group: "customer", readOnly: true }), defineField({ name: "phone", type: "string", group: "customer", readOnly: true }), defineField({ name: "email", type: "string", group: "customer", readOnly: true }), defineField({ name: "shippingAddress", type: "address", group: "customer", readOnly: true }),
    defineField({ name: "items", type: "array", group: "overview", readOnly: true, of: [defineArrayMember({ type: "orderItem" })] }), defineField({ name: "subtotal", type: "number", group: "overview", readOnly: true }), defineField({ name: "shippingCharge", type: "number", group: "overview", readOnly: true }), defineField({ name: "discount", type: "number", group: "overview", readOnly: true }), defineField({ name: "total", type: "number", group: "overview", readOnly: true }),
    defineField({ name: "paymentMethod", type: "string", group: "payment", readOnly: true, options: { list: [{ title: "Cash on Delivery", value: "cod" }, { title: "Manual bKash", value: "bkash" }] } }), defineField({ name: "payment", type: "paymentDetails", group: "payment" }), defineField({ name: "paymentStatus", type: "string", group: "payment", options: { list: [{ title: "Unpaid", value: "unpaid" }, { title: "Submitted", value: "submitted" }, { title: "Verified", value: "verified" }, { title: "Rejected", value: "rejected" }, { title: "Refunded", value: "refunded" }] }, validation: (rule) => rule.required() }), defineField({ name: "orderStatus", type: "string", group: "overview", options: { list: [{ title: "Placed", value: "placed" }, { title: "Confirmed", value: "confirmed" }, { title: "Processing", value: "processing" }, { title: "Shipped", value: "shipped" }, { title: "Delivered", value: "delivered" }, { title: "Cancelled", value: "cancelled" }] }, validation: (rule) => rule.required() }), defineField({ name: "customerNote", type: "text", group: "notes", readOnly: true }), defineField({ name: "adminNote", type: "text", group: "notes" }), defineField({ name: "createdAt", type: "datetime", readOnly: true }), defineField({ name: "updatedAt", type: "datetime", readOnly: true }),
  ], orderings: [{ title: "Newest first", name: "createdAtDesc", by: [{ field: "createdAt", direction: "desc" }] }], preview: { select: { title: "orderNumber", customer: "customerName", total: "total", status: "orderStatus", payment: "paymentStatus" }, prepare: ({ title, customer, total, status, payment }) => ({ title: `${title} · ৳${total}`, subtitle: `${customer} · ${status} · payment ${payment}` }) }
});

export const customer = defineType({ name: "customer", title: "Customers", type: "document", fields: [defineField({ name: "authUserId", type: "string", readOnly: true }), defineField({ name: "name", type: "string", validation: (rule) => rule.required() }), defineField({ name: "email", type: "string" }), defineField({ name: "phone", type: "string" }), defineField({ name: "addresses", type: "array", of: [defineArrayMember({ type: "address" })] }), defineField({ name: "active", type: "boolean", initialValue: true }), defineField({ name: "createdAt", type: "datetime", readOnly: true })], preview: { select: { title: "name", email: "email", phone: "phone" }, prepare: ({ title, email, phone }) => ({ title, subtitle: email || phone }) } });

export const banner = defineType(
  {
    name: "banner",
    title: "Banners",
    type: "document",
    fields: [defineField(
      {
        name: "title",
        type: "string"
      }), defineField({ name: "subtitle", type: "string" }), defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }), defineField({ name: "mobileImage", type: "image", options: { hotspot: true } }), defineField({ name: "link", type: "string" }), defineField({ name: "buttonText", type: "string" }), defineField({ name: "active", type: "boolean", initialValue: true }), defineField({ name: "sortOrder", type: "number", initialValue: 10 }), defineField({ name: "startDate", type: "datetime" }), defineField({ name: "endDate", type: "datetime" })], preview: { select: { title: "title", subtitle: "subtitle", media: "image" } }
  });

export const storeSettings = defineType({
  name: "storeSettings",
  title: "Store settings",
  type: "document",
  groups: [
    { name: "general", title: "General & Branding", default: true },
    { name: "contact", title: "Contact & Location" },
    { name: "social", title: "Social Media" },
  ],
  fields: [
    defineField({ name: "storeName", title: "Store Name", type: "string", group: "general", validation: (rule) => rule.required() }),
    defineField({ name: "logo", title: "Store Logo", type: "image", options: { hotspot: true }, group: "general" }),
    defineField({ name: "favicon", title: "Favicon", type: "image", group: "general" }),
    defineField({ name: "announcement", title: "Top Announcement Bar Text", type: "string", group: "general" }),
    defineField({ name: "footerText", title: "Footer About / Description", type: "text", rows: 3, group: "general" }),
    defineField({ name: "currency", title: "Currency Symbol / Code", type: "string", group: "general", initialValue: "BDT" }),
    defineField({ name: "phone", title: "Helpline / Phone Number", description: "e.g. 09613-008008 or 017XXXXXXXX", type: "string", group: "contact" }),
    defineField({ name: "whatsapp", title: "WhatsApp Number / Link", description: "e.g. 01711002200 or +8801711002200", type: "string", group: "contact" }),
    defineField({ name: "email", title: "Support Email", description: "e.g. hello@burmesehouse.com", type: "string", group: "contact" }),
    defineField({ name: "address", title: "Store / Office Address", description: "e.g. Banani, Dhaka 1213, Bangladesh", type: "text", rows: 2, group: "contact" }),
    defineField({ name: "googleMapsUrl", title: "Google Maps Location Link (Optional)", description: "Direct Google Maps link for the store", type: "url", group: "contact" }),
    defineField({ name: "businessHours", title: "Business / Support Hours", description: "e.g. Everyday: 9:00 AM - 10:00 PM", type: "string", group: "contact" }),
    defineField({ name: "facebook", title: "Facebook Page URL", type: "url", group: "social" }),
    defineField({ name: "instagram", title: "Instagram Profile URL", type: "url", group: "social" }),
    defineField({ name: "tiktok", title: "TikTok Profile URL", type: "url", group: "social" }),
    defineField({ name: "youtube", title: "YouTube Channel URL", type: "url", group: "social" }),
    defineField({ name: "twitter", title: "Twitter / X Profile URL", type: "url", group: "social" }),
    defineField({ name: "linkedin", title: "LinkedIn Profile URL", type: "url", group: "social" }),
  ],
  preview: {
    select: {
      title: "storeName",
      phone: "phone",
      email: "email",
      media: "logo",
    },
    prepare: ({ title, phone, email, media }) => ({
      title: title || "Store Settings",
      subtitle: [phone, email].filter(Boolean).join(" · ") || "Configured",
      media,
    }),
  },
});
export const shippingSettings = defineType({
  name: "shippingSettings",
  title: "Shipping settings",
  type: "document",
  fields: [
    defineField({
      name: "deliveryZones",
      title: "Delivery Zones / Locations",
      description: "Define delivery locations, charges, and timelines (e.g. Inside Dhaka, Inside Feni, Outside Dhaka)",
      type: "array",
      of: [defineArrayMember({ type: "deliveryOption" })],
    }),
    defineField({
      name: "freeShippingEnabled",
      title: "Enable Free Shipping Threshold",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "freeShippingMinimum",
      title: "Minimum Order Amount for Free Shipping (৳)",
      type: "number",
      hidden: ({ document }) => !document?.freeShippingEnabled,
    }),
    defineField({
      name: "deliveryInformation",
      title: "Delivery Information & Policies",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "insideDhakaCharge",
      title: "Legacy Fallback: Inside Dhaka Charge",
      type: "number",
      description: "Fallback if no delivery zones are listed above",
    }),
    defineField({
      name: "outsideDhakaCharge",
      title: "Legacy Fallback: Outside Dhaka Charge",
      type: "number",
      description: "Fallback if no delivery zones are listed above",
    }),
  ],
  preview: {
    select: {
      zones: "deliveryZones",
    },
    prepare: ({ zones }) => ({
      title: "Shipping Settings",
      subtitle: `${Array.isArray(zones) ? zones.length : 0} delivery zones configured`,
    }),
  },
});
export const paymentSettings = defineType({ name: "paymentSettings", title: "Payment settings", type: "document", fields: [defineField({ name: "cashOnDeliveryEnabled", type: "boolean", initialValue: true }), defineField({ name: "bkashEnabled", type: "boolean", initialValue: true }), defineField({ name: "bkashNumber", type: "string", hidden: ({ document }) => !document?.bkashEnabled }), defineField({ name: "bkashAccountType", type: "string", options: { list: ["Personal", "Merchant"] }, hidden: ({ document }) => !document?.bkashEnabled }), defineField({ name: "bkashInstructions", type: "text", rows: 4, hidden: ({ document }) => !document?.bkashEnabled })] });
export const homepageSettings = defineType({ name: "homepageSettings", title: "Homepage settings", type: "document", fields: [defineField({ name: "heroBanners", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "banner" }] })] }), defineField({ name: "featuredCategories", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })] }), defineField({ name: "sections", type: "array", of: [defineArrayMember({ type: "homeSection" })] })] });
