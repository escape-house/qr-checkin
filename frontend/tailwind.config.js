import plugin from "tailwindcss/plugin"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: "#c9242f",
          hover: "#292929",
          disabled: "#6d6464",
        },

        // Base — resolved from CSS variables so .admin-light can override them
        bg: "var(--color-bg)",
        surface: {
          DEFAULT: "var(--color-surface)",
          raised:  "var(--color-surface-raised)",
        },
        border: "var(--color-border)",
        muted:  "var(--color-muted)",
        text: {
          DEFAULT:   "var(--color-text)",
          secondary: "var(--color-text-secondary)",
        },

        // Status
        success: "#22c55e",
        error: "#ef4444",

        // Slot status colors — CSS-variable-driven for light theme support
        future: {
          bg:     "var(--color-future-bg)",
          border: "var(--color-future-border)",
          text:   "var(--color-future-text)",
          accent: "var(--color-future-accent)",
        },
        checkin: {
          bg:     "var(--color-checkin-bg)",
          border: "var(--color-checkin-border)",
          text:   "var(--color-checkin-text)",
          accent: "var(--color-checkin-accent)",
        },
        active: {
          bg:     "var(--color-active-bg)",
          border: "var(--color-active-border)",
          text:   "var(--color-active-text)",
          accent: "var(--color-active-accent)",
        },
        past: {
          bg:     "var(--color-past-bg)",
          border: "var(--color-past-border)",
          text:   "var(--color-past-text)",
          accent: "var(--color-past-accent)",
        },
        blocked: {
          bg:     "var(--color-blocked-bg)",
          border: "var(--color-blocked-border)",
          text:   "var(--color-blocked-text)",
          accent: "var(--color-blocked-accent)",
        },
      },

      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },

      fontFamily: {
        heading: ["PT Serif", "Palatino Linotype", "serif"],
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      boxShadow: {
        card: "",
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        "*, *::before, *::after": { boxSizing: "border-box" },
        body: {
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif",
          margin: "0",
        },
        "h1, h2, h3": {
          fontFamily: "PT Serif, 'Palatino Linotype', serif",
          letterSpacing: "0.03em",
        },
      })
    }),
  ],
}
