export const productProjection = `{
  _id, title, "slug": slug.current, shortDescription,
  "description": coalesce(pt::text(description), shortDescription),
  "images": coalesce(images[].asset->url, []),
  "category": category->{name, "slug": slug.current},
  sku, regularPrice, salePrice, isFeatured, isBestSeller, isNewArrival,
  stockQuantity, soldCount, rating,
  variants[]{_key, title, sku, options, stock, priceAdjustment, active, "image": image.asset->url},
  specifications[]{label, value}
}`;

export const productsQuery = `*[_type == "product" && active == true] | order(coalesce(sortOrder, 999) asc, _createdAt desc) ${productProjection}`;
export const productBySlugQuery = `*[_type == "product" && slug.current == $slug && active == true][0] ${productProjection}`;
export const categoriesQuery = `*[_type == "category" && active == true] | order(sortOrder asc){_id, name, "slug": slug.current, "image": image.asset->url, description, featured}`;
export const settingsQuery = `{
  "store": *[_type == "storeSettings"][0]{
    ...,
    "logo": logo.asset->url,
    "favicon": favicon.asset->url
  },
  "shipping": *[_type == "shippingSettings"][0],
  "payment": *[_type == "paymentSettings"][0]
}`;

export const bannersQuery = `*[_type == "banner" && (active == true || !defined(active))] | order(coalesce(sortOrder, 999) asc, _createdAt desc){
  _id,
  title,
  subtitle,
  "image": coalesce(image.asset->url, ""),
  "mobileImage": mobileImage.asset->url,
  link,
  buttonText,
  active,
  sortOrder,
  startDate,
  endDate
}`;
