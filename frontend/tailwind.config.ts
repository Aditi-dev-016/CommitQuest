import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          page:     '#10141A',
          surface:  '#161B22',
          nested:   '#1C2026',
          muted:    '#181C22',
          elevated: '#262A31',
          overlay:  '#31353C',
        },
        border: { DEFAULT: '#30363D' },
        text: {
          primary:   '#DFE2EB',
          secondary: '#8B93A1',
          muted:     '#6B7280',
          inverse:   '#FFFFFF',
          canvas:    '#F0F6FC',
          soft:      '#CBC3D7',
          code:      '#D0BCFF',
        },
        accent: {
          purple:        '#5E6AD2',
          'purple-light': '#D0BCFF',
          'purple-vivid': '#A078FF',
          'purple-deep':  '#8B5CF6',
          green:  '#4EDEA3',
          amber:  '#F59E0B',
          red:    '#EF4444',
          orange: '#FFB869',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Geist', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '15px' }],
        xs:    ['11px', { lineHeight: '16.5px' }],
        sm:    ['12px', { lineHeight: '18px' }],
        base:  ['14px', { lineHeight: '21px' }],
        md:    ['16px', { lineHeight: '24px' }],
        lg:    ['18px', { lineHeight: '27px' }],
        xl:    ['20px', { lineHeight: '28px' }],
        '2xl': ['22px', { lineHeight: '27.5px' }],
        '3xl': ['24px', { lineHeight: '32px' }],
        '4xl': ['32px', { lineHeight: '38.4px' }],
        '5xl': ['48px', { lineHeight: '52.8px' }],
      },
      borderRadius: {
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        full: '9999px',
      },
      boxShadow: {
        card:          '0px 1px 2px rgba(0,0,0,0.05)',
        elevated:      '0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)',
        'glow-purple': '0px 0px 15px rgba(94,106,210,0.4)',
        'glow-green':  '0px 0px 8px rgba(78,222,163,0.8)',
        'glow-amber':  '0px 0px 15px rgba(245,158,11,0.3)',
        nav:           '2px 0px 4px rgba(0,0,0,0.5)',
      },
      backdropBlur: { nav: '12px' },
    },
  },
  plugins: [],
}

export default config
