import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Burmese House — আসল বার্মিজ আচারের স্বাদ",
    short_name: "Burmese House",
    description: "ঘরে তৈরি আসল বার্মিজ আম, তেঁতুল ও চিলি গার্লিক আচার—সারাদেশে হোম ডেলিভারি।",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff464b",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
