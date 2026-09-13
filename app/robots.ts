import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/products",
          "/products/",
          "/category/",
          "/contact",
          "/images/",
          "/logo.png",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/dashboard",
          "/dashboard/*",
          "/studio",
          "/studio/*",
          "/account",
          "/account/*",
          "/cart",
          "/cart/*",
          "/checkout",
          "/checkout/*",
          "/order-success",
          "/order-success/*",
          "/track-order",
          "/track-order/*",
          "/search",
          "/search/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
