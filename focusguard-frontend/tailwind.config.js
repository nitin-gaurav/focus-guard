/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        card: 'var(--card)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        input: 'var(--input-bg)'
      }
    },
  },
  plugins: [],
}
