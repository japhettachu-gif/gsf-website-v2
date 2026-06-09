import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash (photos placeholder)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Supabase Storage — ton projet spécifique (pas de wildcard)
      {
        protocol: "https",
        hostname: "vwoazicozcusdplypbnc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "geniussoccerfoundation.org",
        "www.geniussoccerfoundation.org",
        // Ton sous-domaine CF Pages auto-généré (à adapter après le 1er déploiement)
        "gsf-academy-platform.pages.dev",
      ],
    },
  },
};

export default withNextIntl(nextConfig);