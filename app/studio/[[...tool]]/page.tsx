"use client";
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return <main style={{ padding: 40, fontFamily: "sans-serif" }}><h1>Sanity Studio is not configured</h1><p>Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET, then restart the app.</p></main>;
  return <NextStudio config={config} />;
}
