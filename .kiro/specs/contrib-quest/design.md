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

## 7. User Flows

### 7.1 New User Onboarding Flow

```
[Visit /] 
  → Click "Sign in with GitHub"
  → GitHub OAuth (authorize)
  → Callback → JWT created → new user?
      YES → /onboarding/experience
          → /onboarding/technologies
          → /onboarding/goals
          → /onboarding/review → "Start My Journey"
          → /dashboard (first-time state: welcome modal)
      NO  → /dashboard (returning state)
```

### 7.2 Repository Analysis Flow

```
[Dashboard or search] 
  → Paste GitHub URL in analyzer input
  → Click "Analyze"
  → Validation check
      INVALID → inline error, no API call
      VALID →
          Check cache (Redis)
              HIT  → serve cached report (< 200ms)
              MISS → call AI Service → stream progress indicator
                   → analysis complete → store in cache (24h)
  → Repository Intelligence Report renders
  → Award 10 XP (if first time viewing)
  → Click "Contribution Opportunity" → Issue Explainer
```

### 7.3 Quest Completion Flow

```
[Mission Board or Dashboard]
  → Click "START QUEST" on QuestCard
  → Quest state: Active
  → User completes quest objectives (varies by quest type):
      • Explore repo → Repository Explorer opened
      • Read lesson  → Learning Academy lesson completed
      • Submit PR    → PR URL submitted and validated
  → System detects completion
  → Quest marked Complete
  → XP awarded (animated)
  → Achievement check triggered
      → New achievement? → Toast notification + badge glow
  → Daily challenge streak check
      → All daily challenges done? → Streak +1
```

### 7.4 Issue Discovery → PR Submission Flow

```
[Issue Finder / Repository Intelligence]
  → Select issue → Issue Explainer
  → AI generates plain-English explanation
  → Click "Start Contributing"
      → Quest created & added to Active Quests
      → First PR Assistant opened
  → Step 1: Fork & Clone (with repo-specific git commands)
  → Step 2: Create Branch
  → Step 3: Make Changes
  → Step 4: Commit
  → Step 5: Push
  → Step 6: Open PR → Paste PR URL → Validate
      → +150 XP awarded
      → Quest status: "Submitted"
  → (async) GitHub webhook / polling checks PR merge
      → PR Merged → +300 XP → "Merged PR" achievement check
      → PR Closed (no merge) → notification + option to retry
```

### 7.5 Guild Discovery → Join Flow

```
[Sidebar: Guild Hall]
  → Guild Discovery page
  → Browse featured guilds
  → Click guild card → right detail panel opens
  → Click "Join Guild"
      → Confirmation (if first guild: welcome message)
      → Added to guild member list
      → Guild appears in sidebar
  → Access guild discussion board
  → Post message → +community XP on helpful replies
```

### 7.6 Learning Path Completion Flow

```
[Learning Academy]
  → Choose Learning Path (e.g., GitHub Workflow)
  → Click active lesson
  → Read article / watch video / take quiz
      → Quiz: answer questions
          WRONG → show correct answer + explanation → retry
          RIGHT → proceed to next question
  → Lesson complete → +20 XP
  → Progress bar updates
  → All lessons in path complete?
      YES → Path Certificate awarded → region unlocked on World Map
            → Certificate downloadable/shareable
      NO  → Next lesson unlocked
```

---

## 8. State Management Plan

### 8.1 Technology

**React Query (TanStack Query)** for all server state (API data, caching, background refetch)  
**Zustand** for client state (UI state, session, toast queue, map interactions)  
**React Context** for theming only

### 8.2 Server State (React Query)

```typescript
// Query keys
const queryKeys = {
  user:           ['user'],
  dashboard:      ['dashboard'],
  repos:          ['repos'],
  repoAnalysis:   (url: string) => ['repos', 'analysis', url],
  repoExplorer:   (owner: string, repo: string) => ['repos', 'explorer', owner, repo],
  issues:         (filters: IssueFilters) => ['issues', filters],
  issue:          (id: string) => ['issues', id],
  issueExplain:   (id: string) => ['issues', id, 'explain'],
  quests:         ['quests'],
  quest:          (id: string) => ['quests', id],
  achievements:   ['achievements'],
  guilds:         ['guilds'],
  guild:          (id: string) => ['guilds', id],
  learningPaths:  ['academy', 'paths'],
  lessons:        (pathId: string) => ['academy', 'paths', pathId, 'lessons'],
  profile:        (username: string) => ['profile', username],
}

// Cache times
const cacheConfig = {
  repoAnalysis:    24 * 60 * 60 * 1000,  // 24h (mirrors Redis TTL)
  issueExplain:    60 * 60 * 1000,        // 1h
  guilds:          5 * 60 * 1000,         // 5m
  dashboard:       2 * 60 * 1000,         // 2m (XP/streak need freshness)
  issues:          10 * 60 * 1000,        // 10m
}
```

### 8.3 Client State (Zustand)

```typescript
interface AppStore {
  // Session
  user: Contributor | null;
  setUser: (user: Contributor | null) => void;

  // XP animation
  pendingXP: number;
  addPendingXP: (xp: number) => void;
  clearPendingXP: () => void;

  // Toast queue
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;

  // Map interactions (Repository Explorer)
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
  mapViewport: { x: number; y: number; scale: number };
  setMapViewport: (viewport: MapViewport) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Active quest context
  activeQuestIssue: Issue | null;
  setActiveQuestIssue: (issue: Issue | null) => void;
}
```

### 8.4 Optimistic Updates

Applied to:
- Quest start/complete (quest status update before server confirmation)
- Achievement unlock display (show toast immediately on client trigger)
- XP balance (increment locally, reconcile on next dashboard fetch)
- Guild join (add user to member list immediately)

---

## 9. System Architecture

### 9.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
│   Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion│
│   React Query · Zustand · ShadCN UI                              │
└─────────────────────────┬────────────────────────────────────────┘
                          │ HTTPS / WebSocket
┌─────────────────────────▼────────────────────────────────────────┐
│                        API GATEWAY                                │
│              (FastAPI + Nginx reverse proxy)                       │
│         Rate limiting · JWT validation · Request routing          │
└──┬─────────────┬──────────────┬──────────────┬───────────────────┘
   │             │              │              │
┌──▼──┐    ┌────▼───┐    ┌─────▼────┐   ┌────▼──────┐
│Auth │    │ User   │    │  GitHub  │   │    AI     │
│Svc  │    │  Svc   │    │  Int Svc │   │   Svc     │
└──┬──┘    └────┬───┘    └─────┬────┘   └────┬──────┘
   │            │              │             │
┌──▼────────────▼──────────────▼─────────────▼──────┐
│              PostgreSQL (primary database)          │
│              Redis (cache + job queue)              │
│              Celery Workers (background tasks)      │
└────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────────┐
│                     EXTERNAL SERVICES                              │
│   GitHub API  ·  GitHub OAuth  ·  Gemini API  ·  AWS S3           │
└──────────────────────────────────────────────────────────────────┘
```

### 9.2 Microservices Breakdown

| Service | Responsibility | Tech |
|---------|---------------|------|
| **Auth Service** | GitHub OAuth, JWT issue/refresh/revoke | FastAPI |
| **User Service** | Profile CRUD, XP/level updates, achievement checks | FastAPI |
| **GitHub Integration Service** | Repository metadata, issues, webhooks, PR status | FastAPI + httpx |
| **AI Service** | Gemini API calls, prompt engineering, response streaming | FastAPI + asyncio |
| **Repository Analysis Service** | Orchestrates GitHub + AI calls, caches results | FastAPI + Celery |
| **Issue Analysis Service** | Issue explanation generation, context gathering | FastAPI + Celery |
| **Gamification Service** | Quest tracking, XP calculation, streak management | FastAPI |
| **Learning Service** | Lesson delivery, progress tracking, certificate generation | FastAPI |
| **Guild Service** | Guild CRUD, discussions, events | FastAPI |
| **Notification Service** | In-app toasts, email, WebSocket push | FastAPI + Redis Pub/Sub |

### 9.3 Data Flow — Repository Analysis

```
1. Client POST /api/analyze { url }
2. API Gateway → Repository Analysis Service
3. Check Redis cache (key: repo_analysis:{owner}:{repo})
   HIT  → return cached JSON (200ms)
   MISS → enqueue Celery task
4. Celery Worker:
   a. Fetch repo metadata (GitHub API)
   b. Fetch open issues (GitHub API, paginated)
   c. Build AI prompt with repo data
   d. Call Gemini API (streaming)
   e. Parse AI response → structured JSON
   f. Compute composite Beginner Friendliness Score
   g. Store in PostgreSQL (RepositoryAnalysis table)
   h. Store in Redis with 24h TTL
5. Return via polling or SSE stream to client
6. Gamification Service: award 10 XP to user
```

---

## 10. Database Schema

### 10.1 Core Tables

```sql
-- Users / Contributors
CREATE TABLE contributors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id     BIGINT UNIQUE NOT NULL,
  username      VARCHAR(64) UNIQUE NOT NULL,
  display_name  VARCHAR(128),
  email         VARCHAR(255),
  avatar_url    VARCHAR(512),
  bio           TEXT,
  github_url    VARCHAR(512),
  experience_level VARCHAR(32) CHECK (experience_level IN ('beginner','intermediate','advanced','maintainer')),
  total_xp      INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  streak_count  INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Skills
CREATE TABLE skills (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  VARCHAR(64) UNIQUE NOT NULL,
  category VARCHAR(32) -- 'language','framework','tool','concept'
);

CREATE TABLE contributor_skills (
  contributor_id UUID REFERENCES contributors(id) ON DELETE CASCADE,
  skill_id       UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency    SMALLINT CHECK (proficiency BETWEEN 1 AND 5),
  PRIMARY KEY (contributor_id, skill_id)
);

-- Contribution Goals
CREATE TABLE contributor_goals (
  contributor_id UUID REFERENCES contributors(id) ON DELETE CASCADE,
  goal           VARCHAR(64) NOT NULL,
  PRIMARY KEY (contributor_id, goal)
);

-- Repositories
CREATE TABLE repositories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id    BIGINT UNIQUE NOT NULL,
  owner        VARCHAR(128) NOT NULL,
  name         VARCHAR(128) NOT NULL,
  full_name    VARCHAR(256) UNIQUE NOT NULL,
  description  TEXT,
  html_url     VARCHAR(512),
  primary_language VARCHAR(64),
  star_count   INTEGER DEFAULT 0,
  fork_count   INTEGER DEFAULT 0,
  open_issue_count INTEGER DEFAULT 0,
  is_archived  BOOLEAN DEFAULT FALSE,
  last_pushed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Repository Analysis (AI output)
CREATE TABLE repository_analyses (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id          UUID REFERENCES repositories(id) ON DELETE CASCADE,
  beginner_score         SMALLINT CHECK (beginner_score BETWEEN 0 AND 100),
  documentation_score    SMALLINT CHECK (documentation_score BETWEEN 0 AND 100),
  complexity_score       SMALLINT CHECK (complexity_score BETWEEN 0 AND 100),
  setup_difficulty_score SMALLINT CHECK (setup_difficulty_score BETWEEN 0 AND 100),
  community_score        SMALLINT CHECK (community_score BETWEEN 0 AND 100),
  summary_text           TEXT,
  architecture_json      JSONB,  -- node graph data
  tech_stack             VARCHAR(64)[],
  good_first_issue_count INTEGER DEFAULT 0,
  help_wanted_count      INTEGER DEFAULT 0,
  analysis_version       SMALLINT NOT NULL DEFAULT 1,
  expires_at             TIMESTAMPTZ NOT NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Issues
CREATE TABLE issues (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  github_number INTEGER NOT NULL,
  title         VARCHAR(512) NOT NULL,
  body          TEXT,
  html_url      VARCHAR(512),
  state         VARCHAR(16) CHECK (state IN ('open','closed')),
  labels        VARCHAR(64)[],
  difficulty    VARCHAR(16) CHECK (difficulty IN ('easy','medium','hard','unknown')),
  is_good_first_issue BOOLEAN DEFAULT FALSE,
  is_help_wanted BOOLEAN DEFAULT FALSE,
  author        VARCHAR(128),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (repository_id, github_number)
);

-- Issue Analysis (AI explanations)
CREATE TABLE issue_analyses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id        UUID REFERENCES issues(id) ON DELETE CASCADE,
  plain_english   TEXT,
  required_concepts TEXT[],
  skills_needed   VARCHAR(64)[],
  files_involved  VARCHAR(512)[],
  suggested_steps TEXT,
  resources       JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quests
CREATE TABLE quests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            VARCHAR(32) CHECK (type IN ('daily','standard','featured','milestone')),
  category        VARCHAR(32) CHECK (category IN ('explore','read','code','review','community')),
  title           VARCHAR(256) NOT NULL,
  description     TEXT,
  difficulty      VARCHAR(16) CHECK (difficulty IN ('easy','medium','hard')),
  xp_reward       INTEGER NOT NULL DEFAULT 0,
  prerequisite_id UUID REFERENCES quests(id),
  issue_id        UUID REFERENCES issues(id),
  repository_id   UUID REFERENCES repositories(id),
  active_from     TIMESTAMPTZ,
  active_until    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quest Progress (per contributor)
CREATE TABLE quest_progress (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID REFERENCES contributors(id) ON DELETE CASCADE,
  quest_id       UUID REFERENCES quests(id) ON DELETE CASCADE,
  status         VARCHAR(32) CHECK (status IN ('locked','available','active','submitted','complete','failed')),
  pr_url         VARCHAR(512),
  completed_at   TIMESTAMPTZ,
  xp_awarded     INTEGER,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (contributor_id, quest_id)
);

-- Achievements
CREATE TABLE achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(64) UNIQUE NOT NULL,
  name            VARCHAR(128) NOT NULL,
  description     TEXT,
  icon_url        VARCHAR(512),
  tier            VARCHAR(16) CHECK (tier IN ('bronze','silver','gold','legendary')),
  xp_reward       INTEGER DEFAULT 0,
  unlock_condition JSONB NOT NULL  -- e.g., {"type": "pr_merged_count", "threshold": 1}
);

CREATE TABLE contributor_achievements (
  contributor_id UUID REFERENCES contributors(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (contributor_id, achievement_id)
);

-- Guilds
CREATE TABLE guilds (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR(64) UNIQUE NOT NULL,
  name        VARCHAR(128) NOT NULL,
  description TEXT,
  specialty   VARCHAR(64),
  tags        VARCHAR(64)[],
  icon_url    VARCHAR(512),
  tier        VARCHAR(16) CHECK (tier IN ('active','high_activity','steady','new')),
  member_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE guild_members (
  guild_id       UUID REFERENCES guilds(id) ON DELETE CASCADE,
  contributor_id UUID REFERENCES contributors(id) ON DELETE CASCADE,
  role           VARCHAR(32) CHECK (role IN ('member','moderator','leader')),
  joined_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (guild_id, contributor_id)
);

CREATE TABLE guild_messages (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id       UUID REFERENCES guilds(id) ON DELETE CASCADE,
  contributor_id UUID REFERENCES contributors(id) ON DELETE SET NULL,
  body           TEXT NOT NULL,
  reactions      JSONB DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Learning Paths & Lessons
CREATE TABLE learning_paths (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR(64) UNIQUE NOT NULL,
  title       VARCHAR(128) NOT NULL,
  description TEXT,
  region      VARCHAR(64), -- maps to world map region
  order_index SMALLINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lessons (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id        UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  title          VARCHAR(256) NOT NULL,
  type           VARCHAR(16) CHECK (type IN ('article','video','quiz')),
  content        TEXT,       -- HTML or markdown for article/video embed
  quiz_data      JSONB,      -- array of {question, options, correct_index, explanation}
  xp_reward      INTEGER NOT NULL DEFAULT 20,
  order_index    SMALLINT NOT NULL,
  duration_mins  SMALLINT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lesson_progress (
  contributor_id UUID REFERENCES contributors(id) ON DELETE CASCADE,
  lesson_id      UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at   TIMESTAMPTZ,
  quiz_score     SMALLINT,
  xp_awarded     INTEGER,
  PRIMARY KEY (contributor_id, lesson_id)
);

-- Contribution History
CREATE TABLE contribution_history (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID REFERENCES contributors(id) ON DELETE CASCADE,
  event_type     VARCHAR(64) NOT NULL, -- 'pr_submitted','pr_merged','issue_solved','lesson_complete',etc.
  xp_earned      INTEGER DEFAULT 0,
  metadata       JSONB,
  occurred_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Repository Bookmarks
CREATE TABLE repository_bookmarks (
  contributor_id UUID REFERENCES contributors(id) ON DELETE CASCADE,
  repository_id  UUID REFERENCES repositories(id) ON DELETE CASCADE,
  bookmarked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (contributor_id, repository_id)
);

-- Notifications
CREATE TABLE notifications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID REFERENCES contributors(id) ON DELETE CASCADE,
  type           VARCHAR(64) NOT NULL,
  title          VARCHAR(256),
  body           TEXT,
  metadata       JSONB,
  read_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity Logs (audit)
CREATE TABLE activity_logs (
  id             BIGSERIAL PRIMARY KEY,
  contributor_id UUID REFERENCES contributors(id) ON DELETE SET NULL,
  action         VARCHAR(128) NOT NULL,
  resource_type  VARCHAR(64),
  resource_id    UUID,
  ip_address     INET,
  user_agent     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_quest_progress_contributor ON quest_progress (contributor_id);
CREATE INDEX idx_quest_progress_status ON quest_progress (status);
CREATE INDEX idx_issues_repo ON issues (repository_id);
CREATE INDEX idx_issues_difficulty ON issues (difficulty);
CREATE INDEX idx_issues_labels ON issues USING GIN (labels);
CREATE INDEX idx_contribution_history_contributor ON contribution_history (contributor_id);
CREATE INDEX idx_notifications_contributor_unread ON notifications (contributor_id) WHERE read_at IS NULL;
CREATE INDEX idx_activity_logs_created ON activity_logs (created_at DESC);
```

---

## 11. API Specifications

### 11.1 Base URL

```
https://api.contribquest.io/v1
```

All endpoints require `Authorization: Bearer {jwt}` except auth endpoints.  
Response format: `{ data: T, meta?: PaginationMeta, error?: ApiError }`

### 11.2 Authentication

```
POST /auth/github/callback
Body: { code: string, state: string }
Response: { data: { token: string, contributor: Contributor } }

POST /auth/refresh
Response: { data: { token: string } }

POST /auth/logout
Response: 204 No Content
```

### 11.3 Contributor

```
GET  /contributors/me
Response: { data: Contributor }

PATCH /contributors/me
Body: { display_name?, bio?, goals? }
Response: { data: Contributor }

GET  /contributors/{username}
Response: { data: PublicContributor }

GET  /contributors/me/achievements
Response: { data: Achievement[], meta: { total, unlocked } }

GET  /contributors/me/stats
Response: { data: ContributorStats }
```

### 11.4 Dashboard

```
GET /dashboard
Response: {
  data: {
    contributor: HeroCard,
    active_quests: Quest[],        // max 3
    recommended_repos: Repo[],     // max 4
    recent_achievements: Achievement[], // max 3
    world_map: WorldRegion[]
  }
}
```

### 11.5 Repository Analysis

```
POST /analyze
Body: { url: string }
Response: {
  data: {
    job_id: string,
    cached: boolean
  }
}

GET /analyze/{job_id}
Response: {
  data: {
    status: 'pending' | 'processing' | 'complete' | 'error',
    result?: RepositoryIntelligenceReport
  }
}

GET /analyze/report/{owner}/{repo}
Response: { data: RepositoryIntelligenceReport }
// Serves cached report if available
```

### 11.6 Issues

```
GET /issues?language=&difficulty=&label=&repo=&page=&per_page=
Response: { data: Issue[], meta: PaginationMeta }

GET /issues/{id}
Response: { data: IssueDetail }

GET /issues/{id}/explain
Response: { data: IssueExplanation }
// Streams via SSE: text/event-stream
```

### 11.7 Quests

```
GET /quests?type=&status=&page=
Response: { data: Quest[], meta: PaginationMeta }

GET /quests/{id}
Response: { data: QuestDetail }

POST /quests/{id}/start
Response: { data: QuestProgress }

POST /quests/{id}/submit
Body: { pr_url?: string }
Response: { data: QuestProgress, xp_awarded: number, achievements_unlocked: Achievement[] }
```

### 11.8 Learning Academy

```
GET /academy/paths
Response: { data: LearningPath[] }

GET /academy/paths/{path_id}
Response: { data: LearningPathDetail }

GET /academy/paths/{path_id}/lessons
Response: { data: Lesson[] }

POST /academy/lessons/{lesson_id}/complete
Body: { quiz_answers?: number[] }
Response: { data: LessonProgress, xp_awarded: number }
```

### 11.9 Guilds

```
GET /guilds?q=&tag=&sort=trending|new|activity
Response: { data: Guild[], meta: PaginationMeta }

GET /guilds/{id}
Response: { data: GuildDetail }

POST /guilds/{id}/join
Response: { data: GuildMember }

GET /guilds/{id}/messages?page=
Response: { data: GuildMessage[], meta: PaginationMeta }

POST /guilds/{id}/messages
Body: { body: string }
Response: { data: GuildMessage }
```

### 11.10 XP & Gamification

```
GET /gamification/xp-log?page=
Response: { data: XPEntry[], meta: PaginationMeta }

GET /gamification/leaderboard?scope=global|guild&guild_id=
Response: { data: LeaderboardEntry[] }
```

---

## 12. Backend Folder Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI app factory
│   ├── config.py                  # Settings (pydantic BaseSettings)
│   ├── database.py                # SQLAlchemy async engine + session
│   ├── redis_client.py            # Redis connection pool
│   ├── celery_app.py              # Celery configuration
│   │
│   ├── services/
│   │   ├── auth/
│   │   │   ├── router.py
│   │   │   ├── service.py         # OAuth flow, JWT sign/verify
│   │   │   ├── schemas.py
│   │   │   └── dependencies.py    # get_current_contributor
│   │   │
│   │   ├── contributor/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── schemas.py
│   │   │   └── models.py
│   │   │
│   │   ├── repository/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── analyzer.py        # orchestrates GitHub + AI
│   │   │   ├── schemas.py
│   │   │   └── models.py
│   │   │
│   │   ├── explorer/
│   │   │   ├── router.py
│   │   │   ├── service.py         # architecture map generation
│   │   │   ├── schemas.py
│   │   │   └── models.py
│   │   │
│   │   ├── issues/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── explainer.py       # AI issue explanation
│   │   │   ├── schemas.py
│   │   │   └── models.py
│   │   │
│   │   ├── quests/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── daily_refresh.py   # Celery beat task
│   │   │   ├── schemas.py
│   │   │   └── models.py
│   │   │
│   │   ├── gamification/
│   │   │   ├── router.py
│   │   │   ├── service.py         # XP calc, level-up, streak
│   │   │   ├── achievement_engine.py
│   │   │   ├── schemas.py
│   │   │   └── models.py
│   │   │
│   │   ├── academy/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── certificate.py
│   │   │   ├── schemas.py
│   │   │   └── models.py
│   │   │
│   │   ├── guilds/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── websocket.py       # real-time discussion
│   │   │   ├── schemas.py
│   │   │   └── models.py
│   │   │
│   │   └── notifications/
│   │       ├── router.py
│   │       ├── service.py
│   │       ├── email.py
│   │       └── schemas.py
│   │
│   ├── integrations/
│   │   ├── github/
│   │   │   ├── client.py          # httpx async GitHub API client
│   │   │   ├── oauth.py
│   │   │   ├── webhooks.py        # HMAC-SHA256 validation
│   │   │   └── schemas.py
│   │   │
│   │   └── ai/
│   │       ├── gemini_client.py
│   │       ├── prompts/
│   │       │   ├── repo_analysis.py
│   │       │   ├── issue_explain.py
│   │       │   ├── architecture.py
│   │       │   └── learning_path.py
│   │       └── schemas.py
│   │
│   ├── workers/
│   │   ├── tasks.py               # Celery task registry
│   │   ├── repo_analysis_task.py
│   │   ├── issue_analysis_task.py
│   │   ├── pr_check_task.py       # polls GitHub PR status
│   │   └── daily_quest_task.py
│   │
│   ├── middleware/
│   │   ├── rate_limit.py
│   │   ├── audit_log.py
│   │   └── cors.py
│   │
│   └── utils/
│       ├── cache.py               # Redis cache helpers
│       ├── pagination.py
│       ├── security.py            # HMAC, JWT helpers
│       └── xp_calculator.py
│
├── alembic/                       # Database migrations
│   ├── versions/
│   └── env.py
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py
├── pyproject.toml
├── Dockerfile
└── docker-compose.yml
```

---

## 13. Frontend Folder Structure

```
frontend/
├── public/
│   ├── fonts/                     # Geist, Inter, JetBrains Mono
│   └── icons/                     # Custom RPG SVG icons
│
├── src/
│   ├── app/                       # Next.js 14 App Router
│   │   ├── layout.tsx             # Root layout (AppShell wrapper)
│   │   ├── page.tsx               # Landing page (/)
│   │   ├── (auth)/
│   │   │   ├── callback/page.tsx  # GitHub OAuth callback
│   │   │   └── error/page.tsx
│   │   ├── onboarding/
│   │   │   ├── layout.tsx
│   │   │   ├── experience/page.tsx
│   │   │   ├── technologies/page.tsx
│   │   │   ├── goals/page.tsx
│   │   │   └── review/page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── analyze/
│   │   │   └── page.tsx
│   │   ├── explore/
│   │   │   └── [owner]/[repo]/page.tsx
│   │   ├── quests/
│   │   │   ├── page.tsx           # Mission Board
│   │   │   ├── [id]/page.tsx
│   │   │   └── [id]/assist/page.tsx
│   │   ├── issues/
│   │   │   └── [id]/page.tsx
│   │   ├── academy/
│   │   │   ├── page.tsx
│   │   │   ├── [pathId]/page.tsx
│   │   │   └── [pathId]/lesson/[lessonId]/page.tsx
│   │   ├── guilds/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── achievements/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       ├── page.tsx           # own profile
│   │       └── [username]/page.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── SideNavBar.tsx
│   │   │   ├── TopNavBar.tsx
│   │   │   ├── NavLink.tsx
│   │   │   └── MobileDrawer.tsx
│   │   │
│   │   ├── ui/                    # Primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── TagChip.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── AvatarBadge.tsx
│   │   │   ├── AchievementBadge.tsx
│   │   │   ├── XPDisplay.tsx
│   │   │   ├── NotificationToast.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorCard.tsx
│   │   │
│   │   ├── cards/
│   │   │   ├── QuestCard.tsx
│   │   │   ├── FeaturedQuestCard.tsx
│   │   │   ├── StandardQuestCard.tsx
│   │   │   ├── RepoCard.tsx
│   │   │   └── GuildCard.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── HeroCard.tsx
│   │   │   ├── WorldMap.tsx
│   │   │   ├── WorldMapRegion.tsx
│   │   │   ├── AchievementShowcase.tsx
│   │   │   └── AnalyticsGrid.tsx
│   │   │
│   │   ├── analyze/
│   │   │   ├── RepoSearchBar.tsx
│   │   │   ├── RepoOverviewCard.tsx
│   │   │   ├── BeginnerScoreCard.tsx
│   │   │   ├── TechStackCard.tsx
│   │   │   ├── HealthMetricsCard.tsx
│   │   │   ├── ComplexityMeter.tsx
│   │   │   └── ContributionOpportunities.tsx
│   │   │
│   │   ├── explorer/
│   │   │   ├── ArchitectureCanvas.tsx
│   │   │   ├── ArchitectureNode.tsx
│   │   │   ├── NodeConnection.tsx
│   │   │   ├── NodePopup.tsx
│   │   │   ├── AIGuidePanel.tsx
│   │   │   ├── FloatingControls.tsx
│   │   │   └── RecommendedPath.tsx
│   │   │
│   │   ├── quests/
│   │   │   ├── MissionBoardFilters.tsx
│   │   │   ├── FeaturedBounties.tsx
│   │   │   ├── StandardQuestGrid.tsx
│   │   │   ├── DailyChallenges.tsx
│   │   │   ├── QuestCompletionModal.tsx
│   │   │   └── PRAssistantStepper.tsx
│   │   │
│   │   ├── issues/
│   │   │   ├── IssueHeader.tsx
│   │   │   ├── IssueExplanation.tsx
│   │   │   └── StreamingSkeleton.tsx
│   │   │
│   │   ├── academy/
│   │   │   ├── LearningPathCard.tsx
│   │   │   ├── LessonRow.tsx
│   │   │   ├── LessonViewer.tsx
│   │   │   ├── QuizQuestion.tsx
│   │   │   ├── DailyGoals.tsx
│   │   │   └── CertificateCard.tsx
│   │   │
│   │   ├── guilds/
│   │   │   ├── GuildGrid.tsx
│   │   │   ├── GuildDetailPanel.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── DiscussionBoard.tsx
│   │   │   └── GuildEvents.tsx
│   │   │
│   │   └── profile/
│   │       ├── ProfileHeader.tsx
│   │       ├── StatGrid.tsx
│   │       ├── AchievementGrid.tsx
│   │       └── ContributionTimeline.tsx
│   │
│   ├── hooks/
│   │   ├── useContributor.ts
│   │   ├── useRepoAnalysis.ts
│   │   ├── useQuests.ts
│   │   ├── useIssueExplain.ts
│   │   ├── useXPAnimation.ts
│   │   ├── useToast.ts
│   │   └── useMapInteraction.ts
│   │
│   ├── store/
│   │   ├── appStore.ts            # Zustand root store
│   │   ├── sessionSlice.ts
│   │   ├── xpSlice.ts
│   │   └── mapSlice.ts
│   │
│   ├── lib/
│   │   ├── api.ts                 # Axios instance + interceptors
│   │   ├── queryClient.ts         # React Query client config
│   │   ├── auth.ts                # JWT cookie helpers
│   │   └── utils.ts
│   │
│   ├── types/
│   │   ├── contributor.ts
│   │   ├── quest.ts
│   │   ├── repository.ts
│   │   ├── issue.ts
│   │   ├── guild.ts
│   │   ├── academy.ts
│   │   └── api.ts
│   │
│   └── styles/
│       ├── globals.css            # CSS custom properties + base
│       └── animations.css         # Framer Motion variants as CSS
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 14. Security Design

### 14.1 Authentication

- GitHub OAuth 2.0 with PKCE flow
- JWT tokens: RS256 signed, 30-day expiry, stored in **HttpOnly + Secure + SameSite=Strict** cookie
- Refresh token rotation: new refresh token issued on each use
- JWT never exposed to `localStorage` or accessible via JavaScript

### 14.2 Authorization

- All API routes protected by JWT middleware (except `/auth/`, public profile `GET /contributors/{username}`)
- Rate limiting: 60 requests/minute per contributor (Redis sliding window)
- RBAC: `contributor`, `moderator`, `admin` roles; enforced at service layer

### 14.3 Input Validation

- All API inputs validated with Pydantic models (FastAPI)
- GitHub repo URL validated against regex `^https://github\.com/[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$`
- PR URL validated against `^https://github\.com/.+/pull/\d+$`
- All text inputs sanitized server-side before persistence
- SQL injection prevented via SQLAlchemy ORM parameterized queries

### 14.4 Webhook Security

- GitHub webhook payloads verified with HMAC-SHA256 (`X-Hub-Signature-256` header)
- Webhook secret stored in environment variable, never in code

### 14.5 AI Prompt Security

- User-supplied text (issue body, repo description) is sanitized before injection into AI prompts
- Prompt injection mitigations: system role instructions prepended, user content wrapped in delimiters
- AI responses treated as untrusted content, parsed with strict schemas before display

---

## 15. Testing Strategy

### 15.1 Frontend

| Type | Tool | Coverage Target |
|------|------|----------------|
| Unit tests | Vitest | Components, hooks, utils |
| Integration tests | Testing Library | User interaction flows |
| E2E tests | Playwright | Critical user journeys |

Critical E2E paths:
1. GitHub OAuth → Onboarding → Dashboard
2. Repository URL → Analysis → Issue Explainer → Quest Start
3. Quest complete → XP animation → Achievement unlock

### 15.2 Backend

| Type | Tool | Coverage Target |
|------|------|----------------|
| Unit tests | pytest | Service logic, utilities |
| Integration tests | pytest + TestClient | API route handlers |
| Property-based tests | Hypothesis | XP calculation, level formula, score normalization |

### 15.3 Property-Based Tests

```python
# XP Calculation Properties
# 1. XP is always non-negative
# 2. Level is a monotonically non-decreasing function of XP
# 3. Completing any valid action increases total_xp
# 4. Beginner Friendliness Score is always in [0, 100]
# 5. Streak resets to 0 after 48h inactivity, never below 0
```

---

## 16. Deployment Architecture

### 16.1 Production Stack

```
[Vercel CDN]  ← Next.js frontend (edge runtime, ISR)
      ↓
[Railway / Render]
  ├── FastAPI API (uvicorn, 2+ workers)
  ├── Celery Worker (2+ instances)
  └── Celery Beat (1 instance — scheduled tasks)
      ↓
[PostgreSQL]  (Railway managed or Supabase)
[Redis]       (Railway Redis or Upstash)
[AWS S3]      (certificate assets, avatars)
```

### 16.2 Environment Variables

```bash
# Auth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_WEBHOOK_SECRET=
JWT_PRIVATE_KEY=          # RS256 PEM
JWT_PUBLIC_KEY=

# Database
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://...

# AI
GEMINI_API_KEY=

# Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# App
NEXT_PUBLIC_API_BASE_URL=
ALLOWED_ORIGINS=
```

### 16.3 Docker Compose (Development)

```yaml
services:
  api:
    build: ./backend
    ports: ["8000:8000"]
    depends_on: [postgres, redis]
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:postgres@postgres/contribquest
      REDIS_URL: redis://redis:6379

  worker:
    build: ./backend
    command: celery -A app.celery_app worker --loglevel=info
    depends_on: [postgres, redis]

  beat:
    build: ./backend
    command: celery -A app.celery_app beat --loglevel=info
    depends_on: [redis]

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://localhost:8000

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: contribquest
      POSTGRES_PASSWORD: postgres

  redis:
    image: redis:7-alpine
```

---

## 17. Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Property-based tests are implemented using **Hypothesis** (backend/Python) and **fast-check** (frontend/TypeScript). Each test runs a minimum of **100 iterations** with randomized inputs. Every property maps directly to one or more acceptance criteria.

---

### 17.1 XP and Leveling Properties

#### Property 1: XP Non-Negativity Invariant

*For any* sequence of valid contributor actions (lesson completions, repo explorations, PR submissions, community help), the contributor's cumulative `total_xp` is always ≥ 0.

**Validates: Requirements 2.2, 8.4, 3.9, 7.5**

```python
# Feature: contrib-quest, Property 1: XP non-negativity
from hypothesis import given, settings
import hypothesis.strategies as st
from app.services.gamification.service import XP_AWARDS

@given(actions=st.lists(
    st.sampled_from(list(XP_AWARDS.keys())),
    min_size=0, max_size=200
))
@settings(max_examples=500)
def test_xp_never_negative(actions):
    xp = 0
    for action in actions:
        xp += XP_AWARDS[action]
    assert xp >= 0
```

---

#### Property 2: Level Monotonicity

*For any* two XP totals `a` and `b` where `a ≤ b`, `level(a) ≤ level(b)`. Gaining XP must never decrease a contributor's level.

**Validates: Requirement 2.2**

```python
# Feature: contrib-quest, Property 2: Level monotonicity
@given(
    xp_a=st.integers(min_value=0, max_value=1_000_000),
    delta=st.integers(min_value=0, max_value=50_000)
)
@settings(max_examples=500)
def test_level_monotone(xp_a, delta):
    xp_b = xp_a + delta
    assert calculate_level(xp_a) <= calculate_level(xp_b)
```

---

#### Property 3: XP Progress Fraction Bounded

*For any* XP value, the fractional progress toward the next level is always in [0.0, 1.0). A contributor can never appear to have "more than 100%" progress or negative progress.

**Validates: Requirement 2.2**

```python
# Feature: contrib-quest, Property 3: XP progress fraction bounded
@given(xp=st.integers(min_value=0, max_value=10_000_000))
@settings(max_examples=500)
def test_xp_progress_fraction_bounded(xp):
    fraction = calculate_level_progress_fraction(xp)
    assert 0.0 <= fraction < 1.0
```

---

### 17.2 Streak Logic Properties

#### Property 4: Streak State Machine

*For any* contributor streak value and any sequence of daily challenge completion events with associated timestamps, the streak value obeys these two rules simultaneously:
- Completing all daily challenges on a given day increments the streak by exactly 1
- Any gap of ≥ 48 hours between daily challenge completions resets the streak to exactly 0

**Validates: Requirements 8.8, 8.9**

```python
# Feature: contrib-quest, Property 4: Streak state machine
from datetime import timedelta

@given(
    initial_streak=st.integers(min_value=0, max_value=1000),
    gap_hours=st.integers(min_value=0, max_value=120)
)
@settings(max_examples=500)
def test_streak_state_machine(initial_streak, gap_hours):
    streak = initial_streak
    last_completion = datetime.utcnow()

    # Simulate completing all daily challenges today → streak +1
    streak = update_streak(streak, last_completion, completed_all_today=True)
    assert streak == initial_streak + 1

    # Simulate a gap
    new_time = last_completion + timedelta(hours=gap_hours)
    streak = update_streak(streak, new_time, completed_all_today=False)

    if gap_hours >= 48:
        assert streak == 0
    else:
        assert streak >= 0  # no reset, streak preserved
```

---

#### Property 5: Streak Non-Negative Floor

*For any* streak value and any combination of inactivity periods, the streak count is always ≥ 0 and never wraps below zero.

**Validates: Requirements 8.8, 8.9**

```python
# Feature: contrib-quest, Property 5: Streak non-negative floor
@given(
    initial_streak=st.integers(min_value=0, max_value=10000),
    resets=st.integers(min_value=1, max_value=20)
)
@settings(max_examples=300)
def test_streak_never_negative(initial_streak, resets):
    streak = initial_streak
    for _ in range(resets):
        streak = reset_streak(streak)
    assert streak == 0
```

---

### 17.3 Quest State Machine Properties

#### Property 6: Quest XP Award Exactness

*For any* quest with any `xp_reward` value, when the quest transitions to `complete` status, the XP added to the contributor's `total_xp` equals exactly `quest.xp_reward` — never more, never less.

**Validates: Requirement 8.4**

```python
# Feature: contrib-quest, Property 6: Quest XP award exactness
@given(
    initial_xp=st.integers(min_value=0, max_value=1_000_000),
    xp_reward=st.integers(min_value=1, max_value=10_000)
)
@settings(max_examples=500)
def test_quest_xp_award_exact(initial_xp, xp_reward, db_session):
    contributor = make_contributor(total_xp=initial_xp)
    quest = make_quest(xp_reward=xp_reward)
    complete_quest(contributor, quest, db_session)
    assert contributor.total_xp == initial_xp + xp_reward
```

---

#### Property 7: Quest Prerequisite Locking Invariant

*For any* quest graph, if quest B declares quest A as its prerequisite, and A's status is anything other than `complete`, then B's computed status must be `locked`. The locked state is a strict invariant of the prerequisite relationship.

**Validates: Requirement 8.6**

```python
# Feature: contrib-quest, Property 7: Quest prerequisite locking
@given(
    prerequisite_status=st.sampled_from(['locked','available','active','submitted','failed'])
)
@settings(max_examples=100)
def test_quest_prerequisite_locking(prerequisite_status, db_session):
    prereq = make_quest(status=prerequisite_status)
    dependent = make_quest(prerequisite_id=prereq.id)

    computed_status = compute_quest_status(dependent, contributor_id=TEST_CONTRIBUTOR_ID)

    # Dependent must be locked unless prerequisite is complete
    if prerequisite_status != 'complete':
        assert computed_status == 'locked'
```

---

#### Property 8: Quest Status Transition Validity

*For any* quest progress record, the status transitions follow a valid directed graph: `locked → available → active → (submitted | complete | failed)`. No status can transition backward (e.g., `complete → active` is forbidden).

**Validates: Requirements 8.4, 8.6, 7.5**

```python
# Feature: contrib-quest, Property 8: Quest status transition validity
VALID_TRANSITIONS = {
    'locked':    {'available'},
    'available': {'active'},
    'active':    {'submitted', 'complete', 'failed'},
    'submitted': {'complete', 'failed'},
    'complete':  set(),   # terminal
    'failed':    {'available'},  # retry allowed
}

@given(
    from_status=st.sampled_from(list(VALID_TRANSITIONS.keys())),
    to_status=st.sampled_from(['locked','available','active','submitted','complete','failed'])
)
@settings(max_examples=300)
def test_quest_transition_validity(from_status, to_status):
    is_valid_transition = to_status in VALID_TRANSITIONS[from_status]
    result = attempt_quest_transition(from_status, to_status)

    if is_valid_transition:
        assert result.success is True
    else:
        assert result.success is False
        assert result.error_code == 'INVALID_TRANSITION'
```

---

### 17.4 Achievement Unlock Properties

#### Property 9: Achievement Unlock Idempotency

*For any* contributor and any achievement, triggering the unlock condition N times (N ≥ 1) results in exactly one `contributor_achievements` row. The achievement engine is fully idempotent — repeated triggers never create duplicate records or award XP more than once.

**Validates: Requirement 9.2**

```python
# Feature: contrib-quest, Property 9: Achievement unlock idempotency
@given(trigger_count=st.integers(min_value=1, max_value=50))
@settings(max_examples=200)
def test_achievement_unlock_idempotent(trigger_count, db_session):
    contributor = make_contributor()
    achievement = make_achievement(unlock_condition={"type": "pr_merged_count", "threshold": 1})

    for _ in range(trigger_count):
        check_and_unlock_achievement(contributor, achievement, db_session)

    unlock_count = db_session.query(ContributorAchievement).filter_by(
        contributor_id=contributor.id,
        achievement_id=achievement.id
    ).count()

    assert unlock_count == 1
```

---

#### Property 10: Achievement XP Awarded At Most Once

*For any* contributor and achievement, the XP bonus attached to an achievement is added to `total_xp` exactly once, regardless of how many times the unlock trigger fires.

**Validates: Requirements 9.2, 2.2**

```python
# Feature: contrib-quest, Property 10: Achievement XP awarded once
@given(
    initial_xp=st.integers(min_value=0, max_value=500_000),
    achievement_xp=st.integers(min_value=0, max_value=1000),
    trigger_count=st.integers(min_value=1, max_value=20)
)
@settings(max_examples=300)
def test_achievement_xp_awarded_once(initial_xp, achievement_xp, trigger_count, db_session):
    contributor = make_contributor(total_xp=initial_xp)
    achievement = make_achievement(xp_reward=achievement_xp)

    for _ in range(trigger_count):
        check_and_unlock_achievement(contributor, achievement, db_session)

    assert contributor.total_xp == initial_xp + achievement_xp
```

---

### 17.5 Repository Analysis Cache Properties

#### Property 11: Cache Round-Trip Equivalence

*For any* `RepositoryIntelligenceReport` object, serializing it to JSON for Redis and then deserializing it produces an object that is structurally equal to the original. The cache is a transparent store — no data is lost or mutated in transit.

**Validates: Requirements 3.8, NFR-1.3**

```python
# Feature: contrib-quest, Property 11: Cache round-trip equivalence
from hypothesis import given, settings
import hypothesis.strategies as st
from app.utils.cache import serialize_report, deserialize_report
from tests.factories import repo_intelligence_report_strategy

@given(report=repo_intelligence_report_strategy())
@settings(max_examples=300)
def test_cache_round_trip(report):
    serialized = serialize_report(report)
    deserialized = deserialize_report(serialized)
    assert deserialized == report
```

---

#### Property 12: Cache TTL Within Bounds

*For any* repository analysis result stored in Redis, the time-to-live (TTL) set at insertion is ≤ 86400 seconds (24 hours) and > 0 seconds. No cache entry is inserted with an infinite or zero TTL.

**Validates: Requirement 3.8**

```python
# Feature: contrib-quest, Property 12: Cache TTL within bounds
@given(
    owner=st.text(min_size=1, max_size=64, alphabet=st.characters(whitelist_categories=('Lu','Ll','Nd'))),
    repo=st.text(min_size=1, max_size=128, alphabet=st.characters(whitelist_categories=('Lu','Ll','Nd')))
)
@settings(max_examples=200)
def test_cache_ttl_bounded(owner, repo, redis_client):
    report = make_mock_report(owner=owner, repo=repo)
    store_report_in_cache(redis_client, owner, repo, report)
    ttl = redis_client.ttl(f"repo_analysis:{owner}:{repo}")
    assert 0 < ttl <= 86400
```

---

### 17.6 Issue Filter Response Time Property

#### Property 13: Issue Filter Latency Invariant

*For any* combination of valid filter parameters (difficulty, language, repository, label) applied to a dataset of up to 10,000 issues, the `filter_issues()` function returns within 300ms. This validates that filter performance degrades gracefully with data volume.

**Validates: Requirement 5.3, NFR-1.2**

```python
# Feature: contrib-quest, Property 13: Issue filter latency
import time

@given(
    filters=st.fixed_dictionaries({
        'difficulty': st.one_of(st.none(), st.sampled_from(['easy','medium','hard'])),
        'language':   st.one_of(st.none(), st.text(min_size=1, max_size=32)),
        'label':      st.one_of(st.none(), st.sampled_from(['good first issue','help wanted','documentation'])),
    }),
    issue_count=st.integers(min_value=0, max_value=10_000)
)
@settings(max_examples=200, deadline=None)
def test_issue_filter_latency(filters, issue_count):
    issues = generate_mock_issues(issue_count)
    start = time.monotonic()
    filter_issues(issues, **filters)
    elapsed_ms = (time.monotonic() - start) * 1000
    assert elapsed_ms < 300
```

---

### 17.7 JWT and Auth Token Lifecycle Properties

#### Property 14: JWT Claims Round-Trip

*For any* valid contributor claims payload, signing the payload into a JWT and then verifying and decoding it produces a claims dict that is equal to the original. The JWT encode → decode cycle is lossless.

**Validates: Requirements 1.3, 1.7**

```python
# Feature: contrib-quest, Property 14: JWT claims round-trip
from tests.factories import contributor_claims_strategy
from app.utils.security import sign_jwt, verify_jwt

@given(claims=contributor_claims_strategy())
@settings(max_examples=300)
def test_jwt_round_trip(claims):
    token = sign_jwt(claims)
    decoded = verify_jwt(token)
    # All original fields must survive the round trip
    for key, value in claims.items():
        assert decoded[key] == value
```

---

#### Property 15: JWT Expiry Enforcement

*For any* JWT token whose `exp` claim is strictly less than the current timestamp, `verify_jwt()` must raise an `ExpiredTokenError` and must never return a valid claims dict. Expired tokens are unconditionally rejected.

**Validates: Requirements 1.9, NFR-2.1**

```python
# Feature: contrib-quest, Property 15: JWT expiry enforcement
from freezegun import freeze_time

@given(
    seconds_in_past=st.integers(min_value=1, max_value=60 * 60 * 24 * 365)
)
@settings(max_examples=300)
def test_expired_jwt_rejected(seconds_in_past):
    issue_time = datetime.utcnow() - timedelta(seconds=seconds_in_past + 1)
    with freeze_time(issue_time):
        token = sign_jwt(make_claims(), expiry_seconds=1)

    # Token was issued and expired in the past; verifying now must fail
    with pytest.raises(ExpiredTokenError):
        verify_jwt(token)
```

---

#### Property 16: JWT 30-Day Expiry Invariant

*For any* token issued by the Auth Service, the `exp` claim equals the issuance time plus exactly 30 days (2,592,000 seconds). Tokens issued at any point in time must have this consistent lifetime.

**Validates: Requirement 1.7**

```python
# Feature: contrib-quest, Property 16: JWT 30-day expiry invariant
THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60

@given(
    issue_offset_hours=st.integers(min_value=0, max_value=24 * 365)
)
@settings(max_examples=300)
def test_jwt_thirty_day_expiry(issue_offset_hours):
    issue_time = datetime(2024, 1, 1, tzinfo=timezone.utc) + timedelta(hours=issue_offset_hours)
    with freeze_time(issue_time):
        token = issue_contributor_token(make_claims())
        decoded = decode_jwt_unverified(token)

    expected_exp = int(issue_time.timestamp()) + THIRTY_DAYS_SECONDS
    assert decoded['exp'] == expected_exp
```

---

### 17.8 Beginner Friendliness Score Property

#### Property 17: Beginner Score Bounded and Composed Correctly

*For any* combination of five sub-score inputs each in [0, 100], the composite `calculate_beginner_score()` output is always an integer in [0, 100]. Sub-scores at extreme values (all 0 or all 100) must produce outputs at the corresponding boundary.

**Validates: Requirement 3.4**

```python
# Feature: contrib-quest, Property 17: Beginner score bounded
@given(
    doc_score=st.floats(min_value=0.0, max_value=100.0, allow_nan=False),
    label_coverage=st.floats(min_value=0.0, max_value=100.0, allow_nan=False),
    complexity=st.floats(min_value=0.0, max_value=100.0, allow_nan=False),
    community=st.floats(min_value=0.0, max_value=100.0, allow_nan=False),
    setup=st.floats(min_value=0.0, max_value=100.0, allow_nan=False)
)
@settings(max_examples=500)
def test_beginner_score_bounded(doc_score, label_coverage, complexity, community, setup):
    score = calculate_beginner_score(doc_score, label_coverage, complexity, community, setup)
    assert isinstance(score, int)
    assert 0 <= score <= 100
```

---

### 17.9 Rate Limiting Property

#### Property 18: Rate Limit Threshold Enforcement

*For any* authenticated contributor making requests, once they have consumed exactly 60 requests within a sliding 60-second window, the next (61st) request must receive HTTP 429 with a `Retry-After` header present. No contributor can exceed 60 requests/minute regardless of request timing distribution.

**Validates: NFR-2.4**

```python
# Feature: contrib-quest, Property 18: Rate limit enforcement
@given(
    burst_size=st.integers(min_value=61, max_value=120)
)
@settings(max_examples=100)
def test_rate_limit_enforced(burst_size, test_client, redis_client):
    contributor_id = str(uuid.uuid4())
    headers = make_auth_headers(contributor_id)

    responses = []
    for _ in range(burst_size):
        r = test_client.get("/contributors/me", headers=headers)
        responses.append(r.status_code)

    # At least one response in the burst must be 429
    assert 429 in responses

    # The first 60 must all be 200
    assert all(s == 200 for s in responses[:60])

    # Response 61 onwards must include Retry-After
    rate_limited = [r for r in test_client.responses if r.status_code == 429]
    for r in rate_limited:
        assert 'Retry-After' in r.headers
```

---

### 17.10 Summary Table

| # | Property | Pattern | Validates |
|---|----------|---------|-----------|
| 1 | XP Non-Negativity | Invariant | Req 2.2, 8.4 |
| 2 | Level Monotonicity | Metamorphic | Req 2.2 |
| 3 | XP Progress Fraction Bounded | Invariant | Req 2.2 |
| 4 | Streak State Machine | State machine | Req 8.8, 8.9 |
| 5 | Streak Non-Negative Floor | Invariant | Req 8.8, 8.9 |
| 6 | Quest XP Award Exactness | Invariant | Req 8.4 |
| 7 | Quest Prerequisite Locking | State machine | Req 8.6 |
| 8 | Quest Status Transition Validity | State machine | Req 8.4, 8.6, 7.5 |
| 9 | Achievement Unlock Idempotency | Idempotence | Req 9.2 |
| 10 | Achievement XP Awarded Once | Idempotence | Req 9.2, 2.2 |
| 11 | Cache Round-Trip Equivalence | Round-trip | Req 3.8, NFR-1.3 |
| 12 | Cache TTL Within Bounds | Invariant | Req 3.8 |
| 13 | Issue Filter Latency | Performance invariant | Req 5.3, NFR-1.2 |
| 14 | JWT Claims Round-Trip | Round-trip | Req 1.3, 1.7 |
| 15 | JWT Expiry Enforcement | Error condition | Req 1.9, NFR-2.1 |
| 16 | JWT 30-Day Expiry Invariant | Invariant | Req 1.7 |
| 17 | Beginner Score Bounded | Invariant | Req 3.4 |
| 18 | Rate Limit Threshold | Invariant | NFR-2.4 |

---

*Document version 1.1 — ContribQuest Platform*
