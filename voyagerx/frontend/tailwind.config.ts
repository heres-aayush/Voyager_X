import type { Config } from "tailwindcss";
import formsPlugin from "@tailwindcss/forms";
import animatePlugin from "tailwindcss-animate";
import type { PluginAPI } from "tailwindcss/types/config";

// Helper type for recursive color objects
type ColorValue = string | Record<string, string>;
type ColorObject = Record<string, ColorValue>;

function flattenColors(obj: ColorObject, prefix = ''): Record<string, string> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[prefix + key] = value;
    } else {
      Object.assign(acc, flattenColors(value, `${prefix}${key}-`));
    }
    return acc;
  }, {} as Record<string, string>);
}

function addVariablesForColors({ addBase, theme }: PluginAPI): void {
  const colors = theme('colors') as ColorObject;
  const flatColors = flattenColors(colors);
  
  addBase({
    ':root': flatColors,
  });
}

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addFlattenedVariablesForColors({ addBase, theme }: PluginAPI): void {
  // Since we can't import the module properly with TypeScript,
  // we'll implement a simple flattening function directly
  function manualFlattenColorPalette(colors: Record<string, unknown>): Record<string, string> {
    const result: Record<string, string> = {};
    
    function flattenObject(obj: Record<string, unknown>, prefix = ''): void {
      Object.entries(obj).forEach(([key, value]) => {
        const newKey = prefix ? `${prefix}-${key}` : key;
        
        if (typeof value === 'string') {
          result[newKey] = value;
        } else if (typeof value === 'object' && value !== null) {
          flattenObject(value as Record<string, unknown>, newKey);
        }
      });
    }
    
    flattenObject(colors);
    return result;
  }
  
  const allColors = manualFlattenColorPalette(theme("colors") as Record<string, unknown>);
  const cssVarsObject = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
  
  addBase({
    ":root": cssVarsObject,
  });
}

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        "deep-blue": "#0A1929",
        "cyber-purple": "#6B46C1",
        "neon-cyan": "#00FFFF",
        "neon-pink": "#FF00FF",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    formsPlugin,
    animatePlugin,
    addVariablesForColors,
    addFlattenedVariablesForColors,
  ],
} satisfies Config;