import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // BonkBurn theme colors based on letsbonk.fun
        primary: {
          white: "#ffffff",
          red: "#ff0000",
          orange: "#ff5c01",
          yellow: "#ffd302",
          "yellow-secondary": "#e89607",
        },
        neutral: {
          gray: "#bfbfbf",
          "light-gray": "#e5e7eb",
          "medium-gray": "#9ca3af",
          "background-gray": "#f6f6f6",
        },
        dark: {
          blue: "#2b3649",
          "very-dark": "#000205",
        },
        // Keep original shadcn colors for components that need them
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        "sf-pro": ['"SF Pro Display"', "system-ui", "sans-serif"],
      },
      fontSize: {
        brand: "24px",
        heading: "30px",
        button: "14px",
        footer: "14px",
      },
      spacing: {
        "container-x": "96px",
        "container-y": "20px",
        "section-x": "32px",
        "section-y": "8px",
        card: "12px",
        "button-x": "16px",
        "button-y": "8px",
        element: "16px",
        small: "8px",
      },
      borderRadius: {
        small: "4px",
        medium: "6px",
        large: "12px",
        "extra-large": "16px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #ffd302 0%, #e89607 100%)",
        "footer-gradient": "linear-gradient(135deg, #2b3649 0%, #000205 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
