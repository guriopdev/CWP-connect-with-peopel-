import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#7C3AED",
                    hover: "#6D28D9",
                },
                card: "var(--card)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.5)',
                'purple-glow': '0 0 30px rgba(168, 85, 247, 0.4)',
                'red-glow': '0 0 30px rgba(239, 68, 68, 0.3)',
            },
            backgroundImage: {
                'purple-gradient': 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
export default config;
