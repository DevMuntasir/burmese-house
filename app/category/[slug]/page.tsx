import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbsJsonLd } from "@/components/seo/structured-data";
import { ProductGrid } from "@/components/product/product-grid";
import { PageHeading } from "@/components/shared/page-heading";
import { getCategories, getProducts } from "@/lib/sanity/data";
import { getAbsoluteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);

  if (!category) {
    return {
      title: "Category not found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `/category/${category.slug}`;
  const description =
    category.description ||
    `Shop the best ${category.name} collection from Burmese House. Traditional homemade pickles with home delivery across Bangladesh.`;
  const image = category.image ? (category.image.startsWith("http") ? category.image : getAbsoluteUrl(category.image)) : getAbsoluteUrl("/images/hero-chutney.png");

  return {
    title: `${category.name} — Burmese House`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} | Burmese House`,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: image,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | Burmese House`,
      description,
      images: [image],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const filtered = products.filter((item) => item.category?.slug === slug);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: category.name, url: `/category/${category.slug}` },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <PageHeading
        title={category.name}
        subtitle={
          category.description ??
          `${category.name} collection from Burmese House.`
        }
      />
      <div className="container-shell py-9">
        <p className="mb-6 text-sm text-stone-500">
          Showing {filtered.length} products
        </p>
        <ProductGrid products={filtered} />
      </div>
    </>
  );
}

