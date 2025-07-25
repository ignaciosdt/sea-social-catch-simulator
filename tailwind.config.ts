import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Ocean-specific colors
				ocean: {
					deep: 'hsl(var(--ocean-deep))',
					surface: 'hsl(var(--ocean-surface))',
					foam: 'hsl(var(--ocean-foam))',
					wave: 'hsl(var(--ocean-wave))'
				},
				boat: {
					wood: 'hsl(var(--boat-wood))',
					sail: 'hsl(var(--boat-sail))'
				},
				fish: {
					gold: 'hsl(var(--fish-gold))'
				},
				treasure: {
					gold: 'hsl(var(--treasure-gold))'
				}
			},
			backgroundImage: {
				'gradient-ocean': 'var(--gradient-ocean)',
				'gradient-wave': 'var(--gradient-wave)',
				'gradient-boat': 'var(--gradient-boat)'
			},
			boxShadow: {
				'boat': 'var(--shadow-boat)',
				'ui': 'var(--shadow-ui)',
				'glow': 'var(--shadow-glow)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// Ocean animations
				'wave': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)',
						opacity: '0.6'
					},
					'50%': {
						transform: 'translateY(-10px) rotate(2deg)',
						opacity: '0.8'
					}
				},
				'boat-bob': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-5px) rotate(1deg)'
					}
				},
				'fishing-line': {
					'0%': {
						transform: 'translateY(0px)',
						opacity: '1'
					},
					'50%': {
						transform: 'translateY(20px)',
						opacity: '0.7'
					},
					'100%': {
						transform: 'translateY(0px)',
						opacity: '1'
					}
				},
				'fish-caught': {
					'0%': {
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					},
					'50%': {
						transform: 'scale(1.2) rotate(180deg)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'scale(1) rotate(360deg)',
						opacity: '1'
					}
				},
				'ripple': {
					'0%': {
						transform: 'scale(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(4)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'wave': 'wave 3s ease-in-out infinite',
				'boat-bob': 'boat-bob 4s ease-in-out infinite',
				'fishing-line': 'fishing-line 2s ease-in-out infinite',
				'fish-caught': 'fish-caught 0.8s ease-out',
				'ripple': 'ripple 1s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
