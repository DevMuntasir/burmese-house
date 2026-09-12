import { defineField, defineType } from "sanity";

export const seo = defineType({ name: "seo", title: "SEO", type: "object", fields: [
  defineField({ name: "metaTitle", type: "string", validation: (rule) => rule.max(60) }),
  defineField({ name: "metaDescription", type: "text", rows: 3, validation: (rule) => rule.max(160) }),
  defineField({ name: "openGraphImage", type: "image", options: { hotspot: true } }),
] });

export const deliveryOption = defineType({
  name: "deliveryOption",
  title: "Delivery Zone / Option",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Zone / Location Name",
      description: "e.g. Inside Dhaka, Inside Feni, Outside Dhaka, Chittagong City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "charge",
      title: "Delivery Charge (৳)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "estimatedTime",
      title: "Estimated Delivery Time (Optional)",
      description: "e.g. 1–2 days, 2–4 days",
      type: "string",
    }),
    defineField({
      name: "isDefault",
      title: "Default Selected Option",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      charge: "charge",
      time: "estimatedTime",
      isDefault: "isDefault",
    },
    prepare: ({ title, charge, time, isDefault }) => ({
      title: `${title || "Delivery Zone"}${isDefault ? " ★ (Default)" : ""}`,
      subtitle: `৳${charge ?? 0}${time ? ` · ${time}` : ""}`,
    }),
  },
});

export const address = defineType({
  name: "address",
  title: "Address",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "district", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "area", title: "Area / Thana", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "address", title: "Full address", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "deliveryZone", title: "Delivery Zone", type: "string" }),
  ],
});

export const productVariant = defineType({ name: "productVariant", title: "Product variant", type: "object", fields: [
  defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
  defineField({ name: "sku", title: "SKU", type: "string", validation: (rule) => rule.required() }),
  defineField({ name: "options", type: "object", options: { columns: 2 }, fields: [defineField({ name: "color", type: "string" }), defineField({ name: "size", type: "string" }), defineField({ name: "other", type: "string" })] }),
  defineField({ name: "stock", type: "number", initialValue: 0, validation: (rule) => rule.required().integer().min(0) }),
  defineField({ name: "priceAdjustment", type: "number", initialValue: 0 }),
  defineField({ name: "image", type: "image", options: { hotspot: true } }),
  defineField({ name: "active", type: "boolean", initialValue: true }),
], preview: { select: { title: "title", sku: "sku", stock: "stock", media: "image" }, prepare: ({ title, sku, stock, media }) => ({ title, subtitle: `${sku} · ${stock} in stock`, media }) } });

export const orderItem = defineType({ name: "orderItem", title: "Order item", type: "object", fields: [
  defineField({ name: "product", type: "reference", to: [{ type: "product" }], weak: true }), defineField({ name: "productId", type: "string", readOnly: true }),
  defineField({ name: "title", type: "string", readOnly: true }), defineField({ name: "sku", title: "SKU", type: "string", readOnly: true }), defineField({ name: "variantTitle", type: "string", readOnly: true }),
  defineField({ name: "imageUrl", type: "url", readOnly: true }), defineField({ name: "quantity", type: "number", readOnly: true }), defineField({ name: "unitPrice", type: "number", readOnly: true }), defineField({ name: "lineTotal", type: "number", readOnly: true }),
], preview: { select: { title: "title", variant: "variantTitle", quantity: "quantity", total: "lineTotal" }, prepare: ({ title, variant, quantity, total }) => ({ title, subtitle: `${variant ? `${variant} · ` : ""}${quantity} × · ৳${total}` }) } });

export const paymentDetails = defineType({ name: "paymentDetails", title: "Payment details", type: "object", fields: [
  defineField({ name: "senderNumber", title: "Sender bKash number", type: "string", readOnly: true }),
  defineField({ name: "transactionId", title: "Transaction ID", type: "string", readOnly: true }),
  defineField({ name: "submittedAt", type: "datetime", readOnly: true }),
  defineField({ name: "verifiedAt", type: "datetime", readOnly: true }),
  defineField({ name: "verifiedBy", type: "string", readOnly: true }),
] });

export const specification = defineType({ name: "specification", title: "Specification", type: "object", fields: [defineField({ name: "label", type: "string", validation: (rule) => rule.required() }), defineField({ name: "value", type: "string", validation: (rule) => rule.required() })] });
export const homeSection = defineType({ name: "homeSection", title: "Homepage section", type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "sectionType", type: "string", options: { list: ["featuredProducts", "bestSellers", "newArrivals", "categories", "promotionalBanners", "categoryProducts"] }, validation: (rule) => rule.required() }), defineField({ name: "category", type: "reference", to: [{ type: "category" }] }), defineField({ name: "enabled", type: "boolean", initialValue: true })] });
