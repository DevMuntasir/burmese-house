import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^01[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number"),
  email: z.union([z.literal(""), z.string().email()]).optional(),
  district: z.string().trim().min(2).max(60),
  area: z.string().trim().min(2).max(80),
  address: z.string().trim().min(8).max(300),
  note: z.string().max(500).optional(),
  deliveryZone: z.enum(["inside-dhaka", "outside-dhaka"]),
  paymentMethod: z.enum(["cod", "bkash"]),
  senderBkashNumber: z.string().optional(),
  transactionId: z.string().trim().max(50).optional(),
  items: z.array(z.object({ productId: z.string(), variantKey: z.string().optional(), quantity: z.number().int().min(1).max(20) })).min(1),
}).superRefine((data, context) => {
  if (data.paymentMethod === "bkash") {
    if (!data.senderBkashNumber || !/^01[3-9]\d{8}$/.test(data.senderBkashNumber)) context.addIssue({ code: "custom", path: ["senderBkashNumber"], message: "Enter the bKash sender number" });
    if (!data.transactionId || data.transactionId.length < 5) context.addIssue({ code: "custom", path: ["transactionId"], message: "Enter a valid Transaction ID" });
  }
});

export type OrderInput = z.infer<typeof orderSchema>;
