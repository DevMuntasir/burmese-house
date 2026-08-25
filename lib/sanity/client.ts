import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "demo1234";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const hasSanityConfig = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-01-01",
  useCdn: true,
  perspective: "published",
});

export const writeClient = sanityClient.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
