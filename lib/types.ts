export type ProductVariant = {
  _key: string;
  title: string;
  sku: string;
  options: Record<string, string>;
  stock: number;
  priceAdjustment?: number;
  image?: string;
  active: boolean;
};

export type Product = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: string[];
  category: { name: string; slug: string };
  sku: string;
  regularPrice: number;
  salePrice?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  stockQuantity: number;
  soldCount?: number;
  variants?: ProductVariant[];
  specifications?: { label: string; value: string }[];
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  featured?: boolean;
};

export type StoreSettings = {
  storeName: string;
  announcement: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  currency: string;
  insideDhakaCharge: number;
  outsideDhakaCharge: number;
  cashOnDeliveryEnabled: boolean;
  bkashEnabled: boolean;
  bkashNumber: string;
  bkashAccountType: string;
  bkashInstructions: string;
};

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  variantKey?: string;
  variantTitle?: string;
  sku: string;
  maxStock: number;
};

export type OrderStatus = "placed" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
