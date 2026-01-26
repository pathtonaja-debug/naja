import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "16px",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          muted: "hsl(var(--foreground-muted))",
        },
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warn: {
          DEFAULT: "hsl(var(--warn))",
          foreground: "hsl(var(--warn-foreground))",
        },
        // Semantic accent colors
        semantic: {
          lavender: "hsl(var(--color-lavender))",
          "lavender-soft": "hsl(var(--color-lavender-soft))",
          "lavender-dark": "hsl(var(--color-lavender-dark))",
          green: "hsl(var(--color-green))",
          "green-soft": "hsl(var(--color-green-soft))",
          "green-dark": "hsl(var(--color-green-dark))",
          blue: "hsl(var(--color-blue))",
          "blue-soft": "hsl(var(--color-blue-soft))",
          "blue-dark": "hsl(var(--color-blue-dark))",
          yellow: "hsl(var(--color-yellow))",
          "yellow-soft": "hsl(var(--color-yellow-soft))",
          "yellow-dark": "hsl(var(--color-yellow-dark))",
          teal: "hsl(var(--color-teal))",
          "teal-soft": "hsl(var(--color-teal-soft))",
          "teal-dark": "hsl(var(--color-teal-dark))",
        },
        // UI state colors
        inactive: "hsl(var(--color-inactive))",
        hover: "hsl(var(--color-hover))",
        divider: "hsl(var(--border-divider))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        'xs': 'var(--radius-xs)',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        'full': 'var(--radius-full)',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        'safe-bottom': 'var(--safe-bottom)',
      },
      fontFamily: {
        sans: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['var(--font-display)', { lineHeight: '1.1', fontWeight: '700' }],
        'title-1': ['var(--font-title-1)', { lineHeight: '1.15', fontWeight: '700' }],
        'title-2': ['var(--font-title-2)', { lineHeight: '1.2', fontWeight: '600' }],
        'title-3': ['var(--font-title-3)', { lineHeight: '1.25', fontWeight: '600' }],
        'headline': ['var(--font-headline)', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['var(--font-body)', { lineHeight: '1.5', fontWeight: '400' }],
        'callout': ['var(--font-callout)', { lineHeight: '1.4', fontWeight: '400' }],
        'subhead': ['var(--font-subhead)', { lineHeight: '1.35', fontWeight: '400' }],
        'footnote': ['var(--font-footnote)', { lineHeight: '1.4', fontWeight: '400' }],
        'caption-1': ['var(--font-caption-1)', { lineHeight: '1.3', fontWeight: '400' }],
        'caption-2': ['var(--font-caption-2)', { lineHeight: '1.25', fontWeight: '400' }],
      },
      transitionDuration: {
        'instant': 'var(--duration-instant)',
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
        'slower': 'var(--duration-slower)',
      },
      transitionTimingFunction: {
        'spring': 'var(--ease-spring)',
        'smooth': 'var(--ease-smooth)',
        'ios': 'var(--ease-ios)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pop": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-3px)" },
          "40%": { transform: "translateX(3px)" },
          "60%": { transform: "translateX(-2px)" },
          "80%": { transform: "translateX(2px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "check-pop": {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width, 100%)" },
        },
        "ring-fill": {
          "0%": { strokeDashoffset: "282.74" },
          "100%": { strokeDashoffset: "var(--ring-offset, 0)" },
        },
        "bar-grow": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "pop": "pop 0.3s var(--ease-spring)",
        "bounce-soft": "bounce-soft 0.4s var(--ease-spring)",
        "shake": "shake 0.4s ease-out",
        "float": "float 3s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "check-pop": "check-pop 0.4s var(--ease-spring)",
        "progress-fill": "progress-fill 0.5s ease-out forwards",
        "ring-fill": "ring-fill 1s ease-out forwards",
        "bar-grow": "bar-grow 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
