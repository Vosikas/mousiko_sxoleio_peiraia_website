import type { NextConfig } from "next";

/**
 * Επιτρέπουμε στο next/image να φέρνει εικόνες από το WordPress του σχολείου
 * (το hostname προκύπτει από το WORDPRESS_API_URL) και από τα thumbnails του YouTube.
 */
function wordpressHost(): string | null {
  try {
    return process.env.WORDPRESS_API_URL ? new URL(process.env.WORDPRESS_API_URL).hostname : null;
  } catch {
    return null;
  }
}

const host = wordpressHost();

const nextConfig: NextConfig = {
  // Ο φάκελος του project είναι η ρίζα του Turbopack (αγνοεί lockfiles γονικών φακέλων).
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
      { protocol: "https", hostname: "gym-mous-peiraia.att.sch.gr" },
      ...(host
        ? ([
            { protocol: "https", hostname: host },
            { protocol: "http", hostname: host },
            { protocol: "https", hostname: "*." + host },
          ] as const)
        : []),
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
