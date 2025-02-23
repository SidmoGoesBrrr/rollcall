import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        main: 'rgb(var(--main))',
        overlay: 'rgba(var(--overlay))',
        bg: 'rgb(var(--bg))',
        bw: 'rgb(var(--bw))',
        blank: 'rgb(var(--blank))',
        border: 'rgb(var(--border))',
        text: 'rgb(var(--text))',
        mtext: 'rgb(var(--mtext))',
        ring: 'rgb(var(--ring))',
        ringOffset: 'rgb(var(--ring-offset))',
      },
      borderRadius: {
        base: '4px',
      },
      boxShadow: {
        shadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)', // Directly using RGBA fallback
      },
      fontWeight: {
        base: '500',
        heading: '800',
      },
    },
  },
  plugins: [],
};

export default config;
