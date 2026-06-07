# Design Document

# ContribQuest — Design Document

**Project:** ContribQuest  
**Tagline:** Level Up Through Open Source  
**Version:** 1.0  
**Authors:** Senior Product Manager · Senior System Architect · Senior UI/UX Designer · Senior Engineering Lead

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Tokens](#2-design-tokens)
3. [Typography System](#3-typography-system)
4. [Component Library](#4-component-library)
5. [Page-by-Page UI/UX Design](#5-page-by-page-uiux-design)
6. [Information Architecture](#6-information-architecture)
7. [User Flows](#7-user-flows)
8. [State Management Plan](#8-state-management-plan)
9. [System Architecture](#9-system-architecture)
10. [Database Schema](#10-database-schema)
11. [API Specifications](#11-api-specifications)
12. [Backend Folder Structure](#12-backend-folder-structure)
13. [Frontend Folder Structure](#13-frontend-folder-structure)
14. [Security Design](#14-security-design)
15. [Testing Strategy](#15-testing-strategy)
16. [Deployment Architecture](#16-deployment-architecture)
17. [Correctness Properties](#17-correctness-properties)

---

## 1. Design Philosophy

### 1.1 Core Principles

ContribQuest inherits its visual DNA from the Figma design file (CommitQuest, file key `dPPoWbAGDFMeGcHmL5yD7y`). The design system is a **dark-first, RPG-inflected developer tool** — disciplined enough to feel like a professional IDE, expressive enough to feel like a game.

Four pillars guide every design decision:

**1. Developer Native** — The UI feels like a tool developers already use: GitHub, VS Code, Linear. Monospaced labels, syntax-like color coding, icon-forward navigation. No candy UI.

**2. Progressive Disclosure** — Beginners see simple surfaces. Power users discover depth. Each page reveals complexity on demand via expandable panels, hover states, and tooltips.

**3. Gamification Without Condescension** — XP bars and achievement badges are present but never childish. The RPG layer is a metaphor layer — contribution = quest, learning = leveling up — not a distraction from real work.

**4. Accessibility by Default** — WCAG 2.1 AA contrast throughout. Keyboard navigation. ARIA labels on icon-only controls. No color-only state signaling.

### 1.2 Visual Language

The design uses a **dark navy/charcoal base** with three accent layers:
- **Purple (`#5E6AD2`, `#D0BCFF`)** — primary actions, active states, XP
- **Green (`#4EDEA3`)** — success, EASY difficulty, completed states
- **Amber (`#F59E0B`)** — warning, MEDIUM difficulty, streaks

The surface stack follows GitHub's dark palette logic:
- `#10141A` — page background
- `#161B22` — primary card surface
- `#1C2026` — nested surfaces, inputs
- `#262A31` — elevated card headers
- `#31353C` — tags, overlays

---

## 2. Design Tokens

All tokens are defined as CSS custom properties and mapped to Tailwind configuration.

### 2.1 Color Tokens

```css
:root {
  /* Backgrounds */
  --color-bg-page:        #10141A;
  --color-bg-surface:     #161B22;
  --color-bg-nested:      #1C2026;
  --color-bg-muted:       #181C22;
  --color-bg-elevated:    #262A31;
  --color-bg-overlay:     #31353C;

  /* Borders */
  --color-border:         #30363D;
  --color-border-active:  rgba(94, 106, 210, 0.5);
  --color-border-success: rgba(78, 222, 163, 0.4);
  --color-border-warning: rgba(245, 158, 11, 0.4);
  --color-border-danger:  rgba(239, 68, 68, 0.2);

  /* Text */
  --color-text-primary:   #DFE2EB;
  --color-text-secondary: #8B93A1;
  --color-text-muted:     #6B7280;
  --color-text-inverse:   #FFFFFF;
  --color-text-canvas:    #F0F6FC;
  --color-text-soft:      #CBC3D7;
  --color-text-code:      #D0BCFF;

  /* Accents */
  --color-accent-purple:        #5E6AD2;
  --color-accent-purple-light:  #D0BCFF;
  --color-accent-purple-vivid:  #A078FF;
  --color-accent-purple-deep:   #8B5CF6;
  --color-accent-green:         #4EDEA3;
  --color-accent-amber:         #F59E0B;
  --color-accent-red:           #EF4444;
  --color-accent-orange:        #FFB869;

  /* Difficulty */
  --color-easy-bg:     rgba(78, 222, 163, 0.1);
  --color-easy-border: rgba(78, 222, 163, 0.2);
  --color-easy-text:   #4EDEA3;
  --color-medium-bg:   rgba(245, 158, 11, 0.1);
  --color-medium-border: rgba(245, 158, 11, 0.2);
  --color-medium-text: #F59E0B;
  --color-hard-bg:     rgba(239, 68, 68, 0.1);
  --color-hard-border: rgba(239, 68, 68, 0.2);
  --color-hard-text:   #EF4444;

  /* Gradients */
  --gradient-xp:      linear-gradient(90deg, #5E6AD2 0%, #4EDEA3 100%);
  --gradient-hero:    linear-gradient(155deg, #161B22 0%, #1A1525 100%);
  --gradient-purple:  linear-gradient(45deg, #7E22CE 0%, #C084FC 100%);
  --gradient-gold:    linear-gradient(45deg, #A16207 0%, #FACC15 100%);
  --gradient-silver:  linear-gradient(45deg, #475569 0%, #94A3B8 100%);
  --gradient-bronze:  linear-gradient(45deg, #C2410C 0%, #FB923C 100%);

  /* Shadows */
  --shadow-card:       0px 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-elevated:   0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-glow-purple: 0px 0px 15px rgba(94, 106, 210, 0.4);
  --shadow-glow-green:  0px 0px 8px rgba(78, 222, 163, 0.8);
  --shadow-glow-amber:  0px 0px 15px rgba(245, 158, 11, 0.3);
  --shadow-nav:         2px 0px 4px rgba(0, 0, 0, 0.5);

  /* Border Radius */
  --radius-sm:    4px;
  --radius-md:    8px;
  --radius-lg:    12px;
  --radius-xl:    16px;
  --radius-full:  9999px;

  /* Spacing (4px base) */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;

  /* Layout */
  --sidebar-width:    260px;
  --sidebar-width-lg: 280px;
  --topbar-height:    64px;
  --content-max:      1280px;
}
```

### 2.2 Tailwind Config Extension

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
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
          purple:       '#5E6AD2',
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
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        display: ['Geist', 'Inter', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
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
        card:         '0px 1px 2px rgba(0,0,0,0.05)',
        elevated:     '0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)',
        'glow-purple': '0px 0px 15px rgba(94,106,210,0.4)',
        'glow-green':  '0px 0px 8px rgba(78,222,163,0.8)',
        'glow-amber':  '0px 0px 15px rgba(245,158,11,0.3)',
      },
      backdropBlur: { nav: '12px' },
    },
  },
}

export default config
```

---

## 3. Typography System

### 3.1 Font Families

| Family | Usage | Weights |
|--------|-------|---------|
| **Geist** | Page titles, hero headings, section headings | 400, 600, 700, 900 |
| **Inter** | Body text, nav labels, descriptions, UI text | 400, 500, 600, 700 |
| **JetBrains Mono** | XP values, level badges, stat numbers, code, labels, tags | 400, 500, 700 |

### 3.2 Type Scale

| Token | Family | Size | Weight | Line Height | Usage |
|-------|--------|------|--------|-------------|-------|
| `display-hero` | Geist | 48px | 700 | 52.8px | Profile name, hero headings |
| `display-lg` | Geist | 32px | 700 | 38.4px | Page titles, section heroes |
| `display-md` | Geist | 24px | 700 | 28.8px | Guild names, major headings |
| `heading-xl` | Geist | 22px | 700 | 27.5px | Featured quest titles |
| `heading-lg` | Geist | 20px | 700 | 28px | Section titles, card headings |
| `heading-md` | Geist | 18px | 700 | 27px | Card titles, dialog headings |
| `heading-sm` | Inter | 16px | 700 | 24px | Card subtitles, nav labels |
| `body-lg` | Inter | 16px | 400 | 25.6px | Descriptions, body text |
| `body-md` | Inter | 14px | 400 | 21px | Standard body, nav items |
| `body-sm` | Inter | 13px | 400 | 21.1px | Secondary descriptions |
| `label-lg` | JetBrains Mono | 14px | 500 | 19.6px | XP values, stat numbers |
| `label-md` | JetBrains Mono | 12px | 500 | 14.4px | Badges, level indicators |
| `label-sm` | JetBrains Mono | 11px | 400 | 16.5px | Tags, timestamps |
| `caption` | JetBrains Mono | 10px | 400 | 15px | Microlabels, uppercase tags |
| `code` | JetBrains Mono | 12px | 400 | 18px | File paths, function names |

---
