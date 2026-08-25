export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("BDT", "৳");

export const discountPercent = (regular: number, sale?: number) =>
  sale && sale < regular ? Math.round(((regular - sale) / regular) * 100) : 0;

export const productPrice = (regular: number, sale?: number) =>
  sale && sale < regular ? sale : regular;

export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");
