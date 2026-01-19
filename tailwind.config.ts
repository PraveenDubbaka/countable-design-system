import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ["'Google Sans'", 'Roboto', 'system-ui', 'sans-serif'],
        display: ["'Google Sans'", 'Roboto', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // M3 Typography Scale
        'display-lg': ['3.5625rem', { lineHeight: '4rem', fontWeight: '400', letterSpacing: '-0.25px' }],
        'display-md': ['2.8125rem', { lineHeight: '3.25rem', fontWeight: '400' }],
        'display-sm': ['2.25rem', { lineHeight: '2.75rem', fontWeight: '400' }],
        'headline-lg': ['2rem', { lineHeight: '2.5rem', fontWeight: '400' }],
        'headline-md': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '400' }],
        'headline-sm': ['1.5rem', { lineHeight: '2rem', fontWeight: '400' }],
        'title-lg': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        'title-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '500', letterSpacing: '0.15px' }],
        'title-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500', letterSpacing: '0.1px' }],
        'body-lg': ['1rem', { lineHeight: '1.5rem', fontWeight: '400', letterSpacing: '0.5px' }],
        'body-md': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400', letterSpacing: '0.25px' }],
        'body-sm': ['0.75rem', { lineHeight: '1rem', fontWeight: '400', letterSpacing: '0.4px' }],
        'label-lg': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500', letterSpacing: '0.1px' }],
        'label-md': ['0.75rem', { lineHeight: '1rem', fontWeight: '500', letterSpacing: '0.5px' }],
        'label-sm': ['0.6875rem', { lineHeight: '1rem', fontWeight: '500', letterSpacing: '0.5px' }],
      },
      colors: {
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
        // M3 Color tokens
        surface: {
          DEFAULT: "hsl(var(--m3-surface))",
          variant: "hsl(var(--m3-surface-variant))",
          container: {
            lowest: "hsl(var(--m3-surface-container-lowest))",
            low: "hsl(var(--m3-surface-container-low))",
            DEFAULT: "hsl(var(--m3-surface-container))",
            high: "hsl(var(--m3-surface-container-high))",
            highest: "hsl(var(--m3-surface-container-highest))",
          },
        },
        "on-surface": {
          DEFAULT: "hsl(var(--m3-on-surface))",
          variant: "hsl(var(--m3-on-surface-variant))",
        },
        "primary-container": {
          DEFAULT: "hsl(var(--m3-primary-container))",
        },
        "on-primary-container": {
          DEFAULT: "hsl(var(--m3-on-primary-container))",
        },
        "secondary-container": {
          DEFAULT: "hsl(var(--m3-secondary-container))",
        },
        "on-secondary-container": {
          DEFAULT: "hsl(var(--m3-on-secondary-container))",
        },
        "tertiary-container": {
          DEFAULT: "hsl(var(--m3-tertiary-container))",
        },
        "on-tertiary-container": {
          DEFAULT: "hsl(var(--m3-on-tertiary-container))",
        },
        error: {
          DEFAULT: "hsl(var(--m3-error))",
          container: "hsl(var(--m3-error-container))",
        },
        "on-error": {
          DEFAULT: "hsl(var(--m3-on-error))",
          container: "hsl(var(--m3-on-error-container))",
        },
        outline: {
          DEFAULT: "hsl(var(--m3-outline))",
          variant: "hsl(var(--m3-outline-variant))",
        },
        inverse: {
          surface: "hsl(var(--m3-inverse-surface))",
          "on-surface": "hsl(var(--m3-inverse-on-surface))",
          primary: "hsl(var(--m3-inverse-primary))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          bg: "hsl(var(--sidebar-bg))",
          muted: "hsl(var(--sidebar-muted))",
        },
        dropzone: {
          bg: "hsl(var(--dropzone-bg))",
          border: "hsl(var(--dropzone-border))",
          hover: "hsl(var(--dropzone-hover))",
        },
        countable: {
          blue: "hsl(var(--countable-blue))",
          "blue-light": "hsl(var(--countable-blue-light))",
          "blue-dark": "hsl(var(--countable-blue-dark))",
          teal: "hsl(var(--countable-teal))",
          navy: "hsl(var(--countable-navy))",
        },
      },
      borderRadius: {
        // M3 Shape scale - Squared with 8px for lg
        'none': '0',
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        'full': '9999px',
      },
      boxShadow: {
        // M3 Elevation
        'elevation-1': 'var(--elevation-1)',
        'elevation-2': 'var(--elevation-2)',
        'elevation-3': 'var(--elevation-3)',
        'elevation-4': 'var(--elevation-4)',
        'elevation-5': 'var(--elevation-5)',
      },
      transitionTimingFunction: {
        // M3 Motion easing
        'emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
        'emphasized-decelerate': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
        'emphasized-accelerate': 'cubic-bezier(0.3, 0, 0.8, 0.15)',
        'standard': 'cubic-bezier(0.2, 0, 0, 1)',
        'standard-decelerate': 'cubic-bezier(0, 0, 0, 1)',
        'standard-accelerate': 'cubic-bezier(0.3, 0, 1, 1)',
      },
      transitionDuration: {
        // M3 Motion durations
        'short1': '50ms',
        'short2': '100ms',
        'short3': '150ms',
        'short4': '200ms',
        'medium1': '250ms',
        'medium2': '300ms',
        'medium3': '350ms',
        'medium4': '400ms',
        'long1': '450ms',
        'long2': '500ms',
        'long3': '550ms',
        'long4': '600ms',
        'extra-long1': '700ms',
        'extra-long2': '800ms',
        'extra-long3': '900ms',
        'extra-long4': '1000ms',
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px hsl(207 71% 38% / 0.3)" },
          "50%": { boxShadow: "0 0 20px hsl(207 71% 38% / 0.5)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-emphasized",
        "accordion-up": "accordion-up 0.2s ease-emphasized",
        "fade-in": "fade-in 0.2s ease-emphasized",
        "slide-up": "slide-up 0.3s ease-emphasized",
        "scale-in": "scale-in 0.2s ease-emphasized",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;