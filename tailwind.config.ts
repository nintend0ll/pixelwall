import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--color-primary) / <alpha-value>)",
        "primary-foreground":
          "hsl(var(--color-primary-foreground) / <alpha-value>)",
        secondary: "hsl(var(--color-secondary) / <alpha-value>)",
        "secondary-foreground":
          "hsl(var(--color-secondary-foreground) / <alpha-value>)",
        accent: "#b4befe",
        "accent-foreground":
          "hsl(var(--color-accent-foreground) / <alpha-value>)",
        destructive: "hsl(var(--color-destructive) / <alpha-value>)",
        "destructive-foreground":
          "hsl(var(--color-destructive-foreground) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
        background: "hsl(var(--color-background) / <alpha-value>)",
        foreground: "hsl(var(--color-foreground) / <alpha-value>)",
        card: "hsl(var(--color-card) / <alpha-value>)",
        input: "hsl(var(--color-input) / <alpha-value>)",
        "muted-foreground":
          "hsl(var(--color-muted-foreground) / <alpha-value>)",
      },
      fontFamily: {
        mono: ["ui-monospace", "Consolas", "monospace"],
      },
      animation: {
        "blink-caret": "blink-caret 1s steps(1) infinite",
      },
      keyframes: {
        "blink-caret": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
