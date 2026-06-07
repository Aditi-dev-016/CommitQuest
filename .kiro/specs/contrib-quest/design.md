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

## 4. Component Library

### 4.1 Layout Components

#### `AppShell`
The master layout wrapper. Renders the fixed sidebar and top navigation bar, with a scrollable main content area.

```
┌─────────────────────────────────────────────┐
│  SideNavBar (260px fixed)  │  TopNavBar      │
│                            │─────────────────│
│  · Brand logo + name       │  <content>      │
│  · User level card         │                 │
│  · CTA button              │                 │
│  · Primary nav links       │                 │
│  · Footer nav links        │                 │
└─────────────────────────────────────────────┘
```

Props: `children: ReactNode`  
Behavior: Sidebar is fixed on desktop (≥1024px). Collapses to icon-only at 768–1023px. Hidden with hamburger drawer on mobile.

#### `SideNavBar`
Persistent left sidebar. 260px wide. Contains:
- Brand area: logo icon + "ContribQuest" wordmark (Geist 700, `#D0BCFF`)
- User card: avatar (48px), level title, rank label
- CTA: "Start New Quest" button (full-width, accent-purple-vivid)
- Primary navigation: 7 links with icon + label
- Divider
- Footer navigation: Settings, Support

Active nav item: `rgba(94, 106, 210, 0.05)` fill + 2px right border `#5E6AD2`  
Inactive: text `#8B93A1`, hover: text `#DFE2EB`

Navigation items:
1. Dashboard (map icon)
2. Quest Board (bookmark icon)
3. Repository Explorer (code-branch icon)
4. Learning Academy (graduation-cap icon)
5. Guild Hall (users icon)
6. Achievements (trophy icon)
7. Profile (user icon)

#### `TopNavBar`
64px tall, full-width minus sidebar. `rgba(16, 20, 26, 0.8)` background with `backdrop-filter: blur(12px)`. Bottom border `#30363D`.

Left: Search input (repo/quest search), 300px wide  
Right: XP balance display + notification bell + user avatar

---

### 4.2 Primitive Components

#### `Button`

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| `primary` | `#A078FF` | `#3C0091` | none | Main CTA |
| `secondary` | `rgba(208,188,255,0.1)` | `#D0BCFF` | `rgba(208,188,255,0.3)` | Secondary actions |
| `outline` | transparent | `#DFE2EB` | `#30363D` | Tertiary actions |
| `ghost` | transparent | `#8B93A1` | none | Low-emphasis |
| `danger` | `rgba(239,68,68,0.1)` | `#EF4444` | `rgba(239,68,68,0.2)` | Destructive |

Sizes: `sm` (6px 12px padding), `md` (8px 16px), `lg` (10px 24px)  
Border radius: `8px` for all sizes  
Font: Inter 700, uppercase tracking for `sm`

#### `Badge` — Difficulty

| Value | Background | Border | Text |
|-------|-----------|--------|------|
| `EASY` | `rgba(78,222,163,0.1)` | `rgba(78,222,163,0.2)` | `#4EDEA3` |
| `MEDIUM` | `rgba(245,158,11,0.1)` | `rgba(245,158,11,0.2)` | `#F59E0B` |
| `HARD` | `rgba(239,68,68,0.1)` | `rgba(239,68,68,0.2)` | `#EF4444` |
| `GOOD FIRST ISSUE` | same as EASY | | |
| `HELP WANTED` | same as MEDIUM | | |
| `DOCUMENTATION` | `rgba(208,188,255,0.1)` | `rgba(208,188,255,0.2)` | `#D0BCFF` |

Font: JetBrains Mono 400, 10px, uppercase, letter-spacing 2.5%  
Padding: 2px 8px, border-radius 4px

#### `TagChip`
Background: `#31353C`  Border-radius: 4px  Padding: 4px 8px  
Font: JetBrains Mono 400 11px  Text: `#8B93A1`

#### `ProgressBar`
Track: `#31353C`, 1px border `#30363D`, border-radius 9999px, height 8px–16px  
Fill: XP bars use `linear-gradient(90deg, #5E6AD2, #4EDEA3)`  
Score bars use appropriate accent color  
Glow effect: `box-shadow: 0px 0px 8px rgba(94,106,210,0.6)` on fill

#### `StatCard`
Background: `#10141A`  Border: `#30363D`  Border-radius: 8px  Padding: 16px  
Label: JetBrains Mono 10px uppercase, `#8B93A1`  
Value: JetBrains Mono 700 24px, colored per metric

#### `AvatarBadge`
Circular avatar with a level pill overlay  
Avatar sizes: 32px, 48px, 64px, 128px  
Border: 2px solid `#30363D` (default) or `#5E6AD2` (active)  
Level pill: 4px 12px padding, `#31353C` background

#### `AchievementBadge`
Circular, 64px diameter  
4px colored border (gradient per achievement tier)  
Center icon: 24px SVG  
Label below: JetBrains Mono 700 10px uppercase  
Tiers: Gold (`--gradient-gold`), Silver (`--gradient-silver`), Bronze (`--gradient-bronze`), Blue (`--gradient-purple`)

#### `XPDisplay`
Inline component: star/gem icon + JetBrains Mono 700 14px value  
Color: `#D0BCFF` (purple accent)  
Used in quest cards, nav, profile

#### `NotificationToast`
Top-right fixed position  
Background: `#1C2026`  Border: `#30363D`  Border-radius: 12px  
Animated entrance: slide-in-right + fade  
Contains: achievement icon, title, XP gained  
Auto-dismiss: 4 seconds

---

### 4.3 Card Components

#### `QuestCard`
Used in Dashboard Active Quests and Mission Board.

```
┌────────────────────────────────────────┐
│ [EASY]                      30m est.   │
│                                        │
│ Fix Documentation Issue                │
│ Correct the outdated installation...  │
│                                        │
│ ⚡ 50 XP              [START QUEST]   │
└────────────────────────────────────────┘
```

Background: `#161B22`  Border: `#30363D`  Border-radius: 12px  Padding: 20px  
Difficulty badge top-left, time estimate top-right  
Title: Inter 700 16px `#DFE2EB`  
Description: Inter 400 16px `#8B93A1`, 2-line clamp  
Footer: XP badge left, CTA button right  
CTA: outline button, "START QUEST" — uppercase Inter 700 12px

#### `FeaturedQuestCard`
Larger card for bounties. Background: `linear-gradient(155deg, #161B22, #1A1525)`  
Border: `rgba(139, 92, 246, 0.3)`  
Rarity badge: bottom-left positioned, `rgba(202, 128, 30, 0.2)` background (Epic), `rgba(0, 165, 114, 0.2)` (Rare)  
Star rating: 5 icon stars, colored per difficulty  
XP reward: JetBrains Mono 700 18px `#D0BCFF`

#### `RepoCard`
Used in Dashboard Recommended Repositories.

```
┌────────────────────────────────────────┐
│ Header (darker bg, border-bottom)      │
│ Repository Name          3/5 Diff      │
├────────────────────────────────────────│
│ [React] [TypeScript]                   │
│                                        │
│ BEGINNER SCORE    ISSUES               │
│ 8.5/10            12 Active            │
│                                        │
│ [  Explore Codebase  ]                 │
└────────────────────────────────────────┘
```

Header bg: `#262A31`, border-bottom: `#30363D`  
Repo name: Inter 700 16px  
Difficulty: Inter 400 16px `#8B93A1`  
Tags: TagChip components  
Stats: two columns, JetBrains Mono  
CTA: outline button, full-width

#### `GuildCard`
Background: `#161B22`  Border-radius: 12px  
Guild icon: 40px with colored border  
Guild name: Inter 700 18px  
Tags: up to 3 TagChips  
Footer: member count + activity status badge

#### `StandardQuestCard` (Mission Board grid)
Compact card for the 4-column quest grid.  
Shows: repo name, XP reward, quest title, star difficulty, language/type tags, time estimate  
Bottom border separates footer from body

---

### 4.4 Feature-Specific Components

#### `WorldMapRegion`
Displayed in Dashboard and expanded in a World Map page.  
Each region is a circular icon node + title below + status text.

States:
- **Active** (explored): green border `rgba(78,222,163,0.4)`, green icon, "80% Explored"
- **In Progress**: purple border `rgba(94,106,210,0.4)`, purple icon, "60% Explored"
- **Locked**: neutral border `#30363D`, muted icon, opacity 0.5, "Locked - Level 45"
- **Warning locked**: amber text "Locked - Guild Member"

#### `ArchitectureMapNode`
Card rendered on the interactive canvas.  
Background: `#161B22`  Border: `#30363D`  Border-radius: 8px  Padding: 12px  
Icon + type badge (top-left, 40px)  
Node title: Geist 400 14px `#F0F6FC`  
Subtitle: JetBrains Mono 400 10px `#8B93A1`

Active state: border 2px `#D0BCFF`, glow `0px 0px 15px rgba(208,188,255,0.2)`  
Active indicator: 16px circle `#D0BCFF` positioned top-right

#### `NodePopup`
320px wide panel that appears near the active node.  
Background: `#10141A`  Border: `#30363D`  Border-radius: 8px  Shadow: elevated  
Contains: title, difficulty tag, description, KEY FILES list, CRITICAL FUNCTIONS tags, "Set as Next Quest" button

#### `LearningPathCard`
Collapsible card per learning path.  
Header: path title + status badge (Completed / In Progress / Locked)  
Expanded: list of LessonRow items

#### `LessonRow`
Row inside LearningPathCard.  
States: completed (green check icon), active (purple check, highlighted row), locked (lock icon, 50% opacity)  
Right: time estimate + XP reward  

#### `DailyChallenge`
Background: `#0D1117`  Border: `#30363D`  Border-radius: 8px  
Title + XP badge on one line  
Progress bar below (width % = completion)

#### `ChatMessage` (Guild Hall)
Discord-like message.  
Avatar (32px, circular) | username (Inter 700, colored) + level badge + timestamp  
Body text: Inter 400 14px  
Reactions: emoji + count chips

---

## 5. Page-by-Page UI/UX Design

### 5.1 Landing Page (Unauthenticated)

**Layout:** Centered single-column, full viewport height  
**Background:** `#10141A` with subtle grid pattern overlay (5% opacity)

**Content:**
- Logo + "ContribQuest" wordmark (Geist 700, 32px, `#D0BCFF`)
- Tagline: "Level Up Through Open Source" (Geist 700, 48px, `#F0F6FC`)
- Sub-copy: 2-line description (Inter 400 16px, `#8B93A1`)
- GitHub OAuth button: "Sign in with GitHub" (primary button, full-width 400px max, GitHub icon)
- Feature highlights: 3 icon+text cards in a row

**Interactions:**  
- GitHub OAuth button → redirect to GitHub authorization  
- On return with error → inline error message above button

---

### 5.2 Onboarding Wizard

**Layout:** Centered card, 640px wide, multi-step  
**Background:** `#10141A`

**Steps (5 steps, progress bar at top):**

**Step 1 — Welcome**  
GitHub avatar + "Welcome, {name}" heading  
ContribQuest explanation (3 bullet points)  
"Let's Get Started" button

**Step 2 — Experience Level**  
Single-select grid of 4 tiles: Absolute Beginner / Some Experience / Regular Contributor / Maintainer  
Each tile: icon + label + brief description

**Step 3 — Technology Interests**  
Multi-select tag grid: Python, JavaScript, TypeScript, Rust, Go, Java, CSS, React, Vue, etc.  
At least 3 selections required

**Step 4 — Contribution Goals**  
Multi-select: Get my first PR merged / Prepare for GSoC / Hacktoberfest / Learn Git & GitHub / Build portfolio / Help open source

**Step 5 — Review & Launch**  
Summary of selections  
"Start My Journey" button → Dashboard  
Awards initial quests based on selections

**Progress:** 5 dots at top, filled per completed step

---

### 5.3 Dashboard

**Layout:** AppShell. Main content has 32px padding. 96px top padding (below 64px TopNavBar).  
**Background:** `#10141A` with faint 3% opacity grid/dot pattern

**Section 1 — RPG Progression Hero Card**

Full-width card. Background: `#161B22`, border: `#30363D`, border-radius: 12px, padding: 32px.  
Internal layout: horizontal row.

Left sub-section (avatar area):
- 128×128px avatar frame with border-radius: 16px, border: 2px `#5E6AD2`
- "LVL 42" pill overlaid at bottom: `#31353C` bg, JetBrains Mono 700 12px

Center sub-section (main info):
- Name: Geist 900 16px `#DFE2EB` — "Architect Felix"
- Stats row: RANK | Legendary / STREAK | 124 Days (two columns)
- Description text: italic flavor text (Inter 400 16px `#8B93A1`)
- XP bar section: "XP PROGRESSION" label + "85% COMPLETE" percentage, then ProgressBar

Right sub-section (next achievement):
- Vertical divider (1px `#30363D`)
- "NEXT ACHIEVEMENT" label
- Achievement preview: icon box + "Code Oracle" name + "90% complete" progress

**Section 2 — Active Quests**

Section header: icon + "Active Quests" heading + "View Quest Board" link  
3-column grid of QuestCard components (gap: 24px)

**Section 3 — Recommended Repositories**

Section header: icon + "Recommended Repositories"  
3-column grid of RepoCard components

**Section 4 — Open Source World Map**

Section header: icon + "Open Source World Map"  
Full-width card with background map texture (5% opacity)  
Horizontal row of 5 WorldMapRegion nodes, scrollable on narrow screens:
1. Documentation Forest — 80% Explored (green)
2. Frontend Valley — 60% Explored (purple)
3. Backend Mountain — Locked Level 45 (grey, 50% opacity)
4. Testing Desert — 10% Explored (amber)
5. DevOps Citadel — Locked Guild Member (red text)

**Section 5 — Bottom Row (side by side)**

Left: **Achievement Showcase** (card)  
5 AchievementBadge components in a row: FIRST COMMIT, FIRST PR, FIRST MERGE, BUG HUNTER, DOC HERO

Right: **Contribution Analytics** (card)  
2×2 grid of StatCard:  
- REPOS EXPLORED: 24  
- ISSUES SOLVED: 89 (green)  
- PRS OPENED: 42 (purple)  
- CONTRIBUTION SCORE: 9,840 (amber)

---

### 5.4 Repository Intelligence (Analyzer)

**Layout:** AppShell. Two-column grid below the search bar.  
**Top Nav title:** "Repository Intelligence"

**Section 1 — Search Bar (full-width)**  
Background: `#161B22`, border: `#30363D`, border-radius: 12px  
Left: code/repo icon (`#D0BCFF`)  
Center: large input "Paste GitHub Repository URL (e.g., github.com/owner/repo)"  
Right: "Analyze" button (primary, `#D0BCFF` background)

**Section 2 — Two-Column Grid**

Left column (60% width):

**Repository Overview Card**  
Background: `#161B22`  
Header: GitHub icon + `facebook/react` name (Geist 700 32px) + "Active Project" status badge  
Stats row: 4 StatCards in a row — STARS: 220k+, FORKS: 45.2k, CONTRIBUTORS: 1,684, OPEN ISSUES: 1.2k  
Decorative top border: 4px gradient line (purple → green)

**Beginner Friendliness Card**  
Header: icon + "Beginner Friendliness" + "B+ Grade" badge  
4 ProgressBar items with labels and percentages:  
- Documentation Quality: 85%  
- Setup Difficulty (Lower is better): 40%  
- Code Complexity: 70%  
- Contribution Accessibility: 60%

Right column (40% width):

**Complexity Meter Card**  
"DOMAIN COMPLEXITY" label  
Description text  
Circular gauge SVG (half-circle arc, amber fill, "Advanced" label center)

**Technology Stack Card**  
Icon + "Technology Stack"  
Wrap grid of TagChips: Python, React, FastAPI, Docker, PostgreSQL

**Health Metrics Card**  
Icon + "Health Metrics"  
3 rows: Active Maintainers / PR Response Time / Community Activity  
Right-aligned values with color coding

**Section 3 — Contribution Opportunities (full-width)**  
Header: "Active Quests (Opportunities)" + "View All Issues →"  
3-column grid of QuestCard (with GOOD FIRST ISSUE / HELP WANTED / DOCUMENTATION badges)

---

### 5.5 Mission Board (Quest Board)

**Layout:** AppShell. Two-pane: left filter sidebar (240px) + main board area.

**Left Filter Sidebar**  
Background: `#161B22`, border-right: `#30363D`, padding: 24px  

Filter groups with checkboxes and counts:
- LANGUAGE REALM: Python (42), TypeScript (128) ✓, Rust (15)
- QUEST DIFFICULTY: Novice, Adept ✓, Master
- TIME EST.: buttons — `< 1 Hour` / `1 - 4 Hours` ✓ / `1+ Days`

**Main Board Area**  
Top bar: "Available Quests" heading + subtitle + grid/list view toggle buttons

**Featured Bounties subsection**  
Icon + "High-Value Bounties" label  
2-column grid of FeaturedQuestCard:  
- "Implement Streaming SSR Support for Edge Runtime" — Vercel/Next.js — Epic Rarity  
- "Resolve Memory Leak in Concurrent Mode Suspense" — Meta/React — Rare Bounty

**Standard Quests subsection + Side Panel**  
Two-column layout: quest grid (fills available width) + 300px side panel

Quest grid: 2-column card grid of StandardQuestCard  
- tailwindlabs/tailwindcss — +150 XP — "Fix responsive variant generation..."  
- tiangolo/fastapi — +300 XP — "Add support for Pydantic v2..."  
- etc.

Right side panel:
- **Daily Challenges** card: "Review 3 PRs" progress bar (2/3) + "Merge a Bugfix" completed
- **Recommended for You** card: 2 issue items with repo, title, language tag, XP

---

### 5.6 Repository Explorer

**Layout:** AppShell. Main area split: canvas (fills width) + right AI panel (340px).  
**Background:** `#1C2026` canvas with subtle grid pattern.

**Top Nav:** Search bar with `⌘K` shortcut + notification icon + Sync Repo button + avatar

**Canvas Area**  
Interactive node graph with:
- 5 draggable ArchitectureMapNode cards:
  - Repository Core (center-left)
  - Frontend Layer (top-right)
  - API Layer (center, ACTIVE — purple border + glow)
  - Database Layer (bottom-right, 70% opacity — locked)
  - Authentication (right)
- SVG lines connecting related nodes
- Particle animation layer (subtle floating dots)
- Floating controls bottom-left: zoom-in, zoom-out, reset-view (circular buttons, shadow)

**Right AI Guide Panel (340px)**  
Header: AI icon + "AI Repository Guide" title  
Scrollable content:
- **Exploration Progress** card: "12%" percentage + progress bar
- **Start Here** section: icon + description text + file link card (src/core/bootstrap.ts)
- **Recommended Path** section: numbered steps with connecting vertical line (1→2→3)
- **Suggested Quests** section: 2 quest items with difficulty badges

Panel footer: "Ask AI Assistant" button (full-width, outline)

**NodePopup** (appears near active node, positioned absolute):  
"API Gateway" title + "Lvl 3 Difficulty" badge  
Description paragraph  
KEY FILES + CRITICAL FUNCTIONS sections  
"Set as Next Quest" button

---

### 5.7 Learning Academy

**Layout:** Narrower sidebar (260px) specific to Academy. Main workspace takes remaining width.

**Academy Sidebar Navigation:**  
- User level display: Level 42 badge + "Legendary Architect" label  
- Nav links: Dashboard / Academy (active) / Quests / Inventory / Guilds  
- "Start Daily Goal" CTA (red/purple)  
- Footer: Documentation / Support

**Top App Bar:**  
"Learning Academy" title (Geist 700 20px, `#D0BCFF`)  
Tab navigation: Curriculum (active, underline) / Mentors / Library  
Right: notification bell + settings

**Main Canvas — Two Columns:**

Left column (fills width):

**Hero Progress Card**  
Background: `#161B22` with gradient pattern (5% opacity)  
"CURRENT STATUS" label (JetBrains Mono, `#D0BCFF`)  
"Level 12 Commit Squire" — large combined heading  
"XP to Next Level" label + "4,500 / 5,000" right-aligned  
Module progress bar: "Mastering the Pull Request — 90%"

**Progression Tracks** section:  
Two LearningPathCard components visible:

*Git Fundamentals* — 3/3 Completed (green badge)  
Expanded: Init & Config (✓ 15m +100 XP), Branching logic (✓ 20m +150 XP)

*GitHub Workflow* — In Progress (amber "In Progress" badge, purple glow border)  
Expanded: Forking & Cloning (✓ 25m +200 XP), PR Etiquette (→ active, 30m +250 XP), Action Workflows (🔒 45m +300 XP)  
Left accent border: 4px `#D0BCFF`

Right column (fixed ~360px):

**Daily Quests** card:  
"Complete 2 lessons" — checkbox (checked, purple) — +50 XP  
"Pass 1 quiz" — checkbox (unchecked) — +100 XP (highlighted with purple border)

**Hall of Fame** card (certificates):  
Two certificate badges: "Git Master" (gold) + "Community Pillar" (purple)  
Each: circular badge + label text

**Archives** card (completed courses):  
Simple list: Markdown Magic ✓ / Terminal Basics ✓

---

### 5.8 Guild Hall

**Layout:** AppShell (variant with different sidebar nav).

**Sidebar nav items:** Home / My Guilds / Discovery (active) / Active Quests / Armory  
Footer: "Start New Quest" button + divider + Support / Logout

**Top Nav:** "CommitQuest" brand + Explore (active) / Quests / Leaderboards nav + search + bell + settings + avatar

**Main Content (Discovery view):**

**Discovery Header**  
"Guild Discovery" h1 (Geist 700 32px)  
Subtitle paragraph  
Search bar + filter pills: Trending (active, `rgba(208,188,255,0.1)`) / New / Language

**Featured Factions Grid** (bento asymmetric layout):

Row 1 (grid):
- Web Weavers — TS badge — React, Next.js, CSS — 15.2k members — ACTIVE
- Neural Knights — AI icon — LLMs, Data Science — 8.4k members — HIGH ACTIVITY
- The Infrastructure — amber icon — CI/CD, Docker, K8s — 6.1k members — STEADY
- The Python Syndicate (large card, spans height): Python logo, "Backend Infrastructure & AI Research", RADIANT badge, 12,450 members, FastAPI + PyTorch focus tags, active quest, member avatar stack, "Inspect Guild" button

Row 2:
- The Open Vanguard — generic contribution icon — "General Contribution" — #1 Global, 20,192 members

**Right Detail Panel (340px):**  
Selected guild: The Python Syndicate  
Header: Python logo + close button  
Guild title + description  
"Join Guild" button (primary with glow)  

ARMORY VAULT section: 2 resource links (FastAPI Best Practices / PyTorch Starter Template)  
GUILD QUESTS section: events list (Monthly Hackathon, Workshop: Asyncio Deep Dive)  
TAVERN CHATTER section: 2 chat messages

---

### 5.9 Contributor Profile

**Layout:** AppShell with unique narrow sidebar.

**Sidebar:** "OS-QUEST" brand + avatar card + "Start New Quest" button  
Nav: Character Sheet (active) / Quest Log / Skill Tree / Arsenal / Leaderboards  
Footer: Settings / Support

**Main Content:**

**Profile Header Card**  
Background: `#161B22` with decorative blur glows  
Left: 128×128px avatar with border `#5E6AD2` glow, "42d streak" pill below  
Right: name heading (Geist 700 48px) "Alex 'The Architect' Rivera"  
LEVEL 42 badge + vertical divider + "Grandmaster Maintainer" rank text  
"Share Profile" button (outline)  
XP Bar card: "EXPERIENCE TO NEXT LEVEL" label + "12,450 / 15,000 XP" + progress bar

**Lifetime Stats section**  
Row header: "Lifetime Stats" heading  
5-column StatCard grid:
- Repositories: 124
- Issues Solved: 89
- PRs Opened: 156
- PRs Merged: 142
- Acceptance Rate: 91% (with purple accent blur behind)

---

## 6. Information Architecture

### 6.1 Site Map

```
ContribQuest
├── / (Landing)
│   └── /auth/callback (GitHub OAuth)
├── /onboarding
│   ├── /onboarding/experience
│   ├── /onboarding/technologies
│   ├── /onboarding/goals
│   └── /onboarding/review
├── /dashboard
├── /analyze
│   └── /analyze?url={repo_url}  → Repository Intelligence Report
├── /explore
│   └── /explore/{owner}/{repo}  → Repository Explorer
├── /quests
│   ├── /quests/{quest_id}       → Quest Detail
│   └── /quests/{quest_id}/assist → First PR Assistant
├── /issues
│   └── /issues/{issue_id}       → Issue Explainer
├── /academy
│   ├── /academy/{path_id}
│   └── /academy/{path_id}/lesson/{lesson_id}
├── /guilds
│   ├── /guilds/{guild_id}
│   └── /guilds/{guild_id}/discussion
├── /achievements
├── /profile
│   └── /profile/{username}
└── /settings
```

### 6.2 Navigation Priority

**Primary (always visible in sidebar):** Dashboard, Quest Board, Repository Explorer, Learning Academy, Guild Hall, Achievements, Profile  
**Secondary (contextual):** Issue Explainer (from Quest/Repo), First PR Assistant (from Issue), Repository Analyzer (from Dashboard/search)  
**Global:** TopNav search reaches Repository Analyzer and Issue Finder

---
