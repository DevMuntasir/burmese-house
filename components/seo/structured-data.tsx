import React from "react";
import type { Category, Product, StoreSettings } from "@/lib/types";
import { getAbsoluteUrl, getBaseUrl } from "@/lib/site-url";

/**
 * Organization, Store & WebSite JSON-LD Schema
 */
export function StoreJsonLd({ settings }: { settings: StoreSettings }) {
  const baseUrl = getBaseUrl();

  const socialLinks = [
    settings.facebook,
    settings.instagram,
    settings.tiktok,
    settings.youtube,
    settings.twitter,
    settings.linkedin,
  ].filter((link): link is string => Boolean(link && link.trim().length > 0));

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${baseUrl}/#store`,
    name: settings.storeName || "Burmese House",
    url: baseUrl,
    logo: settings.logo ? (settings.logo.startsWith("http") ? settings.logo : `${baseUrl}${settings.logo}`) : `${baseUrl}/logo.png`,
    image: `${baseUrl}/images/hero-chutney.png`,
    description: settings.footerText || "Burmese House offers homemade Burmese achar and chutney with nationwide delivery in Bangladesh.",
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || "Banani, Dhaka",
      addressCountry: "BD",
    },
    currenciesAccepted: "BDT",
    paymentAccepted: "Cash on Delivery, bKash",
    priceRange: "৳৳",
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: settings.storeName || "Burmese House",
    description: "ঘরে তৈরি আসল বার্মিজ আচারের স্বাদ — আম, তেঁতুল ও চিলি গার্লিক চাটনি",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

/**
 * Product JSON-LD Schema
 */
export function ProductJsonLd({ product }: { product: Product }) {
  const baseUrl = getBaseUrl();
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const price = product.salePrice ?? product.regularPrice;
  const inStock = product.stockQuantity > 0 || !product.stockQuantity;

  const images = (product.images && product.images.length > 0)
    ? product.images.map((img) => (img.startsWith("http") ? img : `${baseUrl}${img}`))
    : [`${baseUrl}/images/hero-chutney.png`];

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.title,
    description: product.shortDescription || product.description || product.title,
    image: images,
    sku: product.sku || product._id,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: "Burmese House",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "BDT",
      price: price,
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Burmese House",
      },
    },
  };

  if (product.rating && product.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      bestRating: "5",
      worstRating: "1",
      reviewCount: Math.max(product.soldCount || 12, 5),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumbs JSON-LD Schema
 */
export function BreadcrumbsJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const baseUrl = getBaseUrl();

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
    />
  );
}
