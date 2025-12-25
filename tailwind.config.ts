import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
			sans: ['var(--font-outfit)', 'sans-serif'],
			heading: ['var(--font-outfit)', 'sans-serif'],
            jersey: ['var(--font-oswald)', 'sans-serif'],
		},
  		colors: {
        'bad-red': '#FF3B30',      // Apple Red Style
        'bad-dark': '#0D0D0D',     // Deep Black
        'bad-card': '#1C1C1E',     // Secondary Dark
        'bad-yellow': '#FFD60A',   // Vivid Yellow
        'bad-green': '#32D74B',    // Neon Green
        'bad-blue': '#0A84FF',
        'surface': '#F2F2F7',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
            sidebar: {
                DEFAULT: 'hsl(var(--sidebar-background))',
                foreground: 'hsl(var(--sidebar-foreground))',
                primary: 'hsl(var(--sidebar-primary))',
                'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                accent: 'hsl(var(--sidebar-accent))',
                'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                border: 'hsl(var(--sidebar-border))',
                ring: 'hsl(var(--sidebar-ring))',
            },
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
        animation: {
            marquee: "marquee 15s linear infinite",
            "marquee-reverse": "marquee-reverse 25s linear infinite",
            float: "float 6s ease-in-out infinite",
            'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'bounce': 'bounce 1s infinite',
        },
        keyframes: {
            marquee: {
                '0%': { transform: 'translateX(0%)' },
                '100%': { transform: 'translateX(-100%)' },
            },
            "marquee-reverse": {
                from: { transform: "translateX(calc(-100% - 2rem))" },
                to: { transform: "translateX(0)" },
            },
            float: {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-20px)" },
            },
            bounce: {
                '0%, 100%': {
                  transform: 'translateY(-25%)',
                  animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                },
                '50%': {
                  transform: 'translateY(0)',
                  animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                },
            },
        },
        boxShadow: {
          'glow-green': '0 0 20px rgba(50, 215, 75, 0.3)',
          'glow-red': '0 0 20px rgba(255, 59, 48, 0.3)',
        }
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
