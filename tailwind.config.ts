import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Design System Colors
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
          glow: "hsl(var(--primary-glow))",
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
        // Gelato Pastel Colors
        gelato: {
          pink: "hsl(var(--gelato-pink))",
          green: "hsl(var(--gelato-green))",
          yellow: "hsl(var(--gelato-yellow))",
          blue: "hsl(var(--gelato-blue))",
          lavender: "hsl(var(--gelato-lavender))",
          peach: "hsl(var(--gelato-peach))",
          "pink-dark": "hsl(var(--gelato-pink-dark))",
          "green-dark": "hsl(var(--gelato-green-dark))",
          "yellow-dark": "hsl(var(--gelato-yellow-dark))",
          "blue-dark": "hsl(var(--gelato-blue-dark))",
          "lavender-dark": "hsl(var(--gelato-lavender-dark))",
          "peach-dark": "hsl(var(--gelato-peach-dark))",
        },
        // Legacy Pastel Colors (mapped to gelato)
        pastel: {
          mint: "hsl(var(--gelato-green))",
          sage: "hsl(var(--gelato-green))",
          sky: "hsl(var(--gelato-blue))",
          lavender: "hsl(var(--gelato-lavender))",
          rose: "hsl(var(--gelato-pink))",
          peach: "hsl(var(--gelato-peach))",
          butter: "hsl(var(--gelato-yellow))",
          sand: "hsl(var(--gelato-peach))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          soft: "hsl(var(--gold-soft))",
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
        'card': 'var(--radius-xl)',
        'button': 'var(--radius-lg)',
        'pill': 'var(--radius-full)',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'soft': 'var(--shadow-sm)',
        'medium': 'var(--shadow-md)',
        'large': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'glow-pink': 'var(--shadow-glow-pink)',
        'glow-blue': 'var(--shadow-glow-blue)',
        'elevation-1': 'var(--shadow-sm)',
        'elevation-2': 'var(--shadow-md)',
        'elevation-3': 'var(--shadow-lg)',
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
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        'display': ['var(--font-display)', { lineHeight: '1.1', fontWeight: '700' }],
        'title-1': ['var(--font-title-1)', { lineHeight: '1.15', fontWeight: '700' }],
        'title-2': ['var(--font-title-2)', { lineHeight: '1.2', fontWeight: '700' }],
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
        'bounce': 'var(--ease-bounce)',
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
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 12px hsl(var(--gelato-pink) / 0.3)" },
          "50%": { boxShadow: "0 0 24px hsl(var(--gelato-pink) / 0.5)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "confetti": {
          "0%": { transform: "translateY(-100vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        "checkmark": {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
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
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
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
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "confetti": "confetti 3s linear forwards",
        "checkmark": "checkmark 0.3s ease-out forwards",
        "progress-fill": "progress-fill 0.5s ease-out forwards",
        "ring-fill": "ring-fill 1s ease-out forwards",
        "bar-grow": "bar-grow 0.5s ease-out forwards",
        "slide-up": "slide-up 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
