import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/sanity/data";
import { getBaseUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const currentDate = new Date();

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    // 2. Fetch dynamic Categories and Products
    const [categories, products] = await Promise.all([
      getCategories(),
      getProducts(),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories
      .filter((cat) => cat.slug)
      .map((cat) => ({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.85,
      }));

    const productRoutes: MetadataRoute.Sitemap = products
      .filter((prod) => prod.slug)
      .map((prod) => ({
        url: `${baseUrl}/products/${prod.slug}`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.9,
      }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    return staticRoutes;
  }
}
