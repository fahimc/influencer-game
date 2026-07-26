import type { Metadata } from "next";
import { headers } from "next/headers";
import StarSparkGame from "./StarSparkGame";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    title: "StarSpark Live — Rhythm Combo Game",
    description:
      "Dance, pose, spin and wave your way to a sparkling high score in this kid-safe creator game.",
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: "StarSpark Live",
      description: "Build combos. Catch the beat. Light up the live!",
      images: [{ url: `${baseUrl}/og.png`, width: 1672, height: 941 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "StarSpark Live",
      description: "Build combos. Catch the beat. Light up the live!",
      images: [`${baseUrl}/og.png`],
    },
  };
}

export default function Home() {
  return <StarSparkGame />;
}
