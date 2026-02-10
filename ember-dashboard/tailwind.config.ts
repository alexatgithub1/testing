import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        card: '#121212',
        'text-primary': '#FFFFFF',
        'text-secondary': '#808080',
        'accent-green': '#10B981',
        'accent-green-light': '#6EE7B7',
        'warning-yellow': '#F59E0B',
        'danger-red': '#EF4444',
        'grid': '#1F1F1F',
      },
    },
  },
  plugins: [],
}
export default config
