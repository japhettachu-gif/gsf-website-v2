import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // GSF Brand
        primary: {
          DEFAULT: "#1A7C4F",
          dark: "#0F4E31",
          light: "#2AAD70",
          foreground: "#FFFFFF",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E4C878",
          dark: "#A07A2A",
          foreground: "#0D0D0D",
        },
        // Shadcn compatibility
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Evaluation ratings
        rating: {
          developing: "#EF4444",
          satisfactory: "#EAB308",
          good: "#22C55E",
          excellent: "#C9A84C",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-barlow)", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        elegant: "0 10px 30px -10px rgba(26, 124, 79, 0.25)",
        gold: "0 10px 30px -10px rgba(201, 168, 76, 0.35)",
        admin: "0 2px 8px -2px rgba(0,0,0,0.12)",
      },
      maxWidth: {
        gsf: "1200px",
      },
      backgroundImage: {
        "gsf-hero": "linear-gradient(135deg, #0D0D0D 0%, #1A2E1E 100%)",
        "gsf-gradient": "linear-gradient(135deg, #1A7C4F, #C9A84C)",
        "admin-sidebar": "linear-gradient(180deg, #0F4E31 0%, #0D0D0D 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
        "fade-in": "fadeIn 0.5s ease-out both",
        "slide-in": "slideIn 0.3s ease-out both",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
