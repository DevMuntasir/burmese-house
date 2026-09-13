/**
 * Contact formatting and action link utility helpers
 */

export function formatPhoneForTel(phone?: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9+]/g, "");
  return `tel:${cleaned}`;
}

export function formatWhatsAppLink(whatsapp?: string, message?: string): string {
  if (!whatsapp) return "";
  const trimmed = whatsapp.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  let digits = trimmed.replace(/[^0-9]/g, "");
  if (digits.startsWith("01") && digits.length === 11) {
    digits = `880${digits.slice(1)}`;
  } else if (digits.startsWith("1") && digits.length === 10) {
    digits = `880${digits}`;
  }
  const baseUrl = `https://wa.me/${digits}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

export function formatEmailLink(email?: string, subject?: string): string {
  if (!email) return "";
  const trimmed = email.trim();
  return subject ? `mailto:${trimmed}?subject=${encodeURIComponent(subject)}` : `mailto:${trimmed}`;
}

export function formatMapLink(address?: string, customMapUrl?: string): string {
  if (customMapUrl && customMapUrl.trim()) return customMapUrl.trim();
  if (!address || !address.trim()) return "https://maps.google.com";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
}
