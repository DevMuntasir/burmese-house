import type { Banner, Category, Product, StoreSettings } from "./types";

export const storeSettings: StoreSettings = {
  storeName: "Burmese House",
  logo: "/logo.png",
  announcement: "ঘরে তৈরি আসল বার্মিজ আচারের স্বাদ • সারাদেশে হোম ডেলিভারি",
  phone: "09613-008008",
  email: "hello@burmesehouse.com",
  whatsapp: "8801711002200",
  address: "Banani, Dhaka 1213, Bangladesh",
  googleMapsUrl: "https://maps.google.com/?q=Banani,Dhaka",
  businessHours: "Everyday: 9:00 AM - 10:00 PM",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  youtube: "",
  twitter: "",
  linkedin: "",
  footerText: "Traditional Burmese achar, handmade in small batches with carefully selected ingredients and lots of love.",
  currency: "BDT",
  insideDhakaCharge: 80,
  outsideDhakaCharge: 130,
  deliveryZones: [
    { _key: "zone-inside", name: "Inside Dhaka", charge: 80, estimatedTime: "1–2 days", isDefault: true },
    { _key: "zone-outside", name: "Outside Dhaka", charge: 130, estimatedTime: "3–5 days", isDefault: false },
  ],
  cashOnDeliveryEnabled: true,
  bkashEnabled: true,
  bkashNumber: "01XXXXXXXXX",
  bkashAccountType: "Personal",
  bkashInstructions: "bKash app থেকে Send Money করুন। Reference-এ আপনার নাম লিখুন এবং নিচে Transaction ID দিন।",
};

export const categories: Category[] = [
  { _id: "cat-mango", name: "Mango Chutney", slug: "mango-chutney", image: "/images/mango-chutney.png", description: "কাঁচা আম, সরিষা ও আমাদের নিজস্ব মসলার মিষ্টি-টক মিশেল।", featured: true },
  { _id: "cat-tamarind", name: "Tamarind Chutney", slug: "tamarind-chutney", image: "/images/tamarind-chutney.png", description: "ঘন তেঁতুল, খেজুর ও মসলার ভারসাম্যপূর্ণ টক-মিষ্টি স্বাদ।", featured: true },
  { _id: "cat-chili", name: "Chili Chutney", slug: "chili-chutney", image: "/images/chili-chutney.png", description: "শুকনা মরিচ ও রসুনের ঝাল, সুগন্ধি বার্মিজ চাটনি।", featured: true },
  { _id: "cat-combo", name: "Combo & Gift Box", slug: "combo-gift-box", image: "/images/hero-chutney.png", description: "একসাথে একাধিক স্বাদ উপভোগ বা প্রিয়জনকে উপহার দেওয়ার প্যাক।", featured: true },
];

const product = (data: Partial<Product> & Pick<Product, "_id" | "title" | "slug" | "images" | "category" | "regularPrice">): Product => ({
  shortDescription: "ঘরে তৈরি আসল বার্মিজ রেসিপি, বাছাই করা উপকরণ এবং কোনো কৃত্রিম রং ছাড়া।",
  description: "বাছাই করা তাজা উপকরণ, খাঁটি সরিষার তেল এবং Burmese House-এর নিজস্ব মসলার মিশ্রণে ছোট ব্যাচে তৈরি। ভাত, খিচুড়ি, পরোটা, স্ন্যাকস বা যেকোনো খাবারের সঙ্গে উপভোগ করুন। পরিষ্কার কাচের জারে যত্নসহকারে প্যাক করে সারাদেশে পৌঁছে দেওয়া হয়।",
  sku: data._id.toUpperCase(),
  stockQuantity: 18,
  soldCount: 0,
  rating: 4.8,
  specifications: [
    { label: "Made in", value: "Bangladesh" },
    { label: "Storage", value: "ঠান্ডা ও শুষ্ক স্থানে রাখুন" },
    { label: "After opening", value: "পরিষ্কার শুকনা চামচ ব্যবহার করুন" },
  ],
  ...data,
});

export const products: Product[] = [
  product({ _id: "bh-101", title: "Burmese Mango Chutney", slug: "burmese-mango-chutney", regularPrice: 380, salePrice: 340, category: { name: "Mango Chutney", slug: "mango-chutney" }, images: ["/images/mango-chutney.png"], isFeatured: true, isBestSeller: true, soldCount: 187, rating: 4.9, variants: [
    { _key: "mango-250", title: "250g Jar", sku: "BH-MNG-250", options: { Weight: "250g" }, stock: 24, active: true },
    { _key: "mango-500", title: "500g Jar", sku: "BH-MNG-500", options: { Weight: "500g" }, stock: 12, priceAdjustment: 280, active: true },
  ] }),
  product({ _id: "bh-102", title: "Burmese Tamarind Chutney", slug: "burmese-tamarind-chutney", regularPrice: 360, salePrice: 320, category: { name: "Tamarind Chutney", slug: "tamarind-chutney" }, images: ["/images/tamarind-chutney.png"], isFeatured: true, isBestSeller: true, soldCount: 154, rating: 4.8, variants: [
    { _key: "tamarind-250", title: "250g Jar", sku: "BH-TMR-250", options: { Weight: "250g" }, stock: 20, active: true },
    { _key: "tamarind-500", title: "500g Jar", sku: "BH-TMR-500", options: { Weight: "500g" }, stock: 9, priceAdjustment: 260, active: true },
  ] }),
  product({ _id: "bh-103", title: "Burmese Chili Garlic Chutney", slug: "burmese-chili-garlic-chutney", regularPrice: 420, salePrice: 370, category: { name: "Chili Chutney", slug: "chili-chutney" }, images: ["/images/chili-chutney.png"], isFeatured: true, isBestSeller: true, soldCount: 226, rating: 5.0, variants: [
    { _key: "chili-250", title: "250g Jar", sku: "BH-CHL-250", options: { Weight: "250g" }, stock: 28, active: true },
    { _key: "chili-500", title: "500g Jar", sku: "BH-CHL-500", options: { Weight: "500g" }, stock: 10, priceAdjustment: 310, active: true },
  ] }),
  product({ _id: "bh-104", title: "Burmese Chutney Tasting Trio", slug: "burmese-chutney-tasting-trio", regularPrice: 1140, salePrice: 999, category: { name: "Combo & Gift Box", slug: "combo-gift-box" }, images: ["/images/hero-chutney.png"], isFeatured: true, isBestSeller: true, soldCount: 96, rating: 4.9, shortDescription: "আম, তেঁতুল ও চিলি গার্লিক—তিনটি জনপ্রিয় ২৫০ গ্রাম জার একসাথে।" }),
  product({ _id: "bh-105", title: "Mango Chutney Family Jar", slug: "mango-chutney-family-jar", regularPrice: 690, salePrice: 620, category: { name: "Mango Chutney", slug: "mango-chutney" }, images: ["/images/mango-chutney.png"], isNewArrival: true, stockQuantity: 14, soldCount: 43, rating: 4.7, shortDescription: "পরিবারের জন্য ৫০০ গ্রাম বড় জার—মিষ্টি, টক আর হালকা ঝালের পরিচিত স্বাদ।" }),
  product({ _id: "bh-106", title: "Tamarind Chutney Family Jar", slug: "tamarind-chutney-family-jar", regularPrice: 660, salePrice: 590, category: { name: "Tamarind Chutney", slug: "tamarind-chutney" }, images: ["/images/tamarind-chutney.png"], isNewArrival: true, stockQuantity: 11, soldCount: 38, rating: 4.8 }),
  product({ _id: "bh-107", title: "Chili Garlic Twin Pack", slug: "chili-garlic-twin-pack", regularPrice: 840, salePrice: 740, category: { name: "Combo & Gift Box", slug: "combo-gift-box" }, images: ["/images/chili-chutney.png"], isNewArrival: true, stockQuantity: 16, soldCount: 61, rating: 4.9, shortDescription: "ঝালপ্রেমীদের জন্য চিলি গার্লিক চাটনির দুইটি ২৫০ গ্রাম জারের সাশ্রয়ী প্যাক।" }),
  product({ _id: "bh-108", title: "Burmese House Gift Box", slug: "burmese-house-gift-box", regularPrice: 1350, salePrice: 1190, category: { name: "Combo & Gift Box", slug: "combo-gift-box" }, images: ["/images/hero-chutney.png"], isFeatured: true, stockQuantity: 8, soldCount: 29, rating: 5.0, shortDescription: "তিন স্বাদের চাটনি, সুন্দর gift-ready packaging—উৎসব ও বিশেষ দিনের জন্য।" }),
];

export const banners: Banner[] = [
  {
    _id: "banner-1",
    title: "আসল বার্মিজ আচারের ঐতিহ্যবাহী স্বাদ",
    subtitle: "বাছাই করা তাজা উপকরণ ও নিজস্ব মসলায় তৈরি আম, তেঁতুল আর চিলি গার্লিক চাটনি—প্রতিদিনের খাবারে আনবে দারুণ তৃপ্তি।",
    image: "/images/hero-chutney.png",
    mobileImage: "/images/hero-chutney.png",
    link: "/products",
    buttonText: "সব আচার দেখুন",
    active: true,
    sortOrder: 1,
  },
  {
    _id: "banner-2",
    title: "বার্মিজ চাটনি স্পেশাল কম্বো প্যাক",
    subtitle: "আম, তেঁতুল ও চিলি গার্লিক—একসাথে তিনটি জনপ্রিয় সেরা স্বাদ উপভোগ করুন আকর্ষণীয় অফারে।",
    image: "/images/hero-chutney.png",
    mobileImage: "/images/hero-chutney.png",
    link: "/category/combo-gift-box",
    buttonText: "কম্বো অফার দেখুন",
    active: true,
    sortOrder: 2,
  },
  {
    _id: "banner-3",
    title: "ঘরে তৈরি ১০০% খাঁটি ও তৃপ্তিদায়ক চাটনি",
    subtitle: "কোনো কৃত্রিম রঙ বা প্রিজারভেটিভ ছাড়া নিখুঁত পরিচ্ছন্নতায় তৈরি ঘরোয়া রেসিপির আচার।",
    image: "/images/hero-chutney.png",
    mobileImage: "/images/hero-chutney.png",
    link: "/products",
    buttonText: "এখনই অর্ডার করুন",
    active: true,
    sortOrder: 3,
  },
];
