import { createClient } from "next-sanity";

/**
 * Normalizes and validates a Sanity project ID.
 * Sanity project IDs must only contain lowercase characters (a-z), numbers (0-9), and dashes (-).
 */
export function normalizeProjectId(rawId?: string | null): string {
  if (!rawId) return "demo1234";
  const sanitized = rawId
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return sanitized && /^[a-z0-9-]+$/.test(sanitized) ? sanitized : "demo1234";
}

/**
 * Normalizes and validates a Sanity dataset name.
 */
export function normalizeDataset(rawDataset?: string | null): string {
  if (!rawDataset) return "production";
  const sanitized = rawDataset
    .toLowerCase()
    .trim()
    .replace(/[^~a-z0-9_-]/g, "-")
    .slice(0, 64);
  return sanitized && /^[~a-z0-9][~a-z0-9_-]*$/.test(sanitized) ? sanitized : "production";
}

const envProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
// Default to the user verified Sanity project ("yxrzflv0") if empty or placeholder
const resolvedProjectId =
  envProjectId &&
  !envProjectId.toLowerCase().startsWith("screen_") &&
  envProjectId !== "demo1234"
    ? envProjectId
    : "yxrzflv0";

export const projectId = normalizeProjectId(resolvedProjectId);
export const dataset = normalizeDataset(process.env.NEXT_PUBLIC_SANITY_DATASET);
export const hasSanityConfig = Boolean(
  projectId && projectId !== "demo1234"
);

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "published",
});

export const writeClient = sanityClient.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
