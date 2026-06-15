# 🍕 Pizza Delivery App — Design Specification

> **Version:** 1.0.0 | **Date:** June 2026  
> **Design Philosophy:** Dark, premium, food-first with warm accents

---

## 1. Brand Identity

| Attribute | Value |
|-----------|-------|
| Brand Name | PizzaCraft |
| Tagline | "Build. Bake. Bliss." |
| Personality | Warm, bold, modern, appetizing |
| Tone | Friendly yet professional |

---

## 2. Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Pizza Orange | `#FF6B35` | Primary CTA buttons, accents |
| Golden Yellow | `#FFB800` | Highlights, active states |
| Tomato Red | `#E63946` | Alerts, destructive actions |
| Charcoal Black | `#1A1A2E` | Page background |
| Deep Navy | `#16213E` | Card backgrounds |
| Card Surface | `#0F3460` | Elevated cards |

### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| White | `#FFFFFF` | Primary text |
| Light Gray | `#E8E8E8` | Secondary text |
| Muted Gray | `#9A9A9A` | Placeholder, captions |
| Border Gray | `#2A2A4A` | Dividers, input borders |

### Status Colors
| Status | Color | Hex |
|--------|-------|-----|
| Order Received | Blue | `#3B82F6` |
| In Kitchen | Amber | `#F59E0B` |
| Sent to Delivery | Green | `#10B981` |
| Out of Stock | Red | `#EF4444` |
| Low Stock | Orange | `#F97316` |

### Gradient Tokens
```css
--gradient-hero: linear-gradient(135deg, #1A1A2E 0%, #0F3460 50%, #1A1A2E 100%);
--gradient-card: linear-gradient(145deg, #16213E, #0F3460);
--gradient-cta: linear-gradient(90deg, #FF6B35, #FFB800);
--gradient-success: linear-gradient(90deg, #10B981, #059669);
```

---

## 3. Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Display / Hero | Poppins | 800 | 3.5rem–5rem |
| H1 | Poppins | 700 | 2.5rem |
| H2 | Poppins | 600 | 2rem |
| H3 | Poppins | 600 | 1.5rem |
| Body | Inter | 400 | 1rem (16px) |
| Body Bold | Inter | 600 | 1rem |
| Caption | Inter | 400 | 0.875rem |
| Button | Inter | 700 | 0.95rem |
| Price | Poppins | 700 | 1.25rem |

```html
<!-- Google Fonts Import -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
```

---

## 4. Spacing & Layout

```css
/* Spacing Scale (rem) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */

/* Border Radius */
--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 20px;
--radius-xl: 28px;
--radius-full: 9999px;

/* Shadows */
--shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
--shadow-glow-orange: 0 0 20px rgba(255, 107, 53, 0.3);
--shadow-glow-yellow: 0 0 20px rgba(255, 184, 0, 0.3);
```

---

## 5. Component Design Guidelines

### 5.1 Navbar
- Background: `#1A1A2E` with `backdrop-filter: blur(10px)`
- Logo: "PizzaCraft 🍕" in Poppins 700, gradient text
- Nav links: Inter 500, `#E8E8E8` → hover `#FF6B35`
- CTA button: Gradient pill button (orange → yellow)
- Sticky on scroll with subtle border-bottom

### 5.2 Pizza Cards (Menu)
- Background: `--gradient-card`
- Border: 1px solid `#2A2A4A`
- Border-radius: `--radius-lg` (20px)
- Image: Top, full-width, aspect-ratio 4:3, object-fit cover
- Hover: Transform scale(1.03) + `--shadow-glow-orange`
- Badge: "VEG / NON-VEG" in top-left corner (rounded pill)
- Price: Poppins 700, `#FFB800`
- Button: Full-width gradient CTA

### 5.3 Pizza Builder Wizard
- Container: Centered card with max-width 700px
- Progress bar: Step indicator (1/2/3/4) at top with orange fill
- Option pills: `#16213E` border cards, selecting makes border `#FF6B35`
- Selected item: Glowing border + checkmark icon + orange bg tint
- Navigation: "← Back" ghost button + "Next →" gradient button
- Live price: Sticky bottom bar showing running total

### 5.4 Buttons
```
Primary CTA:
  bg: gradient(#FF6B35 → #FFB800)
  text: white, bold
  radius: --radius-full
  padding: 0.75rem 2rem
  hover: opacity 0.9 + scale(1.02)

Secondary:
  bg: transparent
  border: 1px solid #FF6B35
  text: #FF6B35
  hover: bg #FF6B3520

Danger:
  bg: #E63946
  text: white

Ghost:
  bg: transparent
  text: #9A9A9A
  hover: text #FFFFFF
```

### 5.5 Forms & Inputs
- Background: `#16213E`
- Border: 1px solid `#2A2A4A`
- Focus border: `#FF6B35` with glow
- Border-radius: `--radius-md`
- Text: `#FFFFFF`
- Placeholder: `#9A9A9A`
- Label: Inter 500, `#E8E8E8`

### 5.6 Status Badges
```
Pill badge design:
  padding: 0.25rem 0.75rem
  border-radius: full
  font: Inter 600, 0.8rem

Colors by status:
  Order Received → bg: #3B82F620, text: #3B82F6, border: #3B82F640
  In Kitchen     → bg: #F59E0B20, text: #F59E0B, border: #F59E0B40
  Sent to Delivery → bg: #10B98120, text: #10B981, border: #10B98140
```

### 5.7 Toast Notifications
- Position: Top-right
- Background: Dark card with colored left border
- Success: `#10B981` border
- Error: `#E63946` border
- Info: `#3B82F6` border
- Warning: `#F59E0B` border
- Auto-dismiss: 3 seconds

### 5.8 Admin Dashboard
- Sidebar navigation: `#16213E`, 250px width
- Active nav item: Orange left border + orange text
- Stats cards: KPI widgets (total orders, revenue, low stock alerts)
- Data tables: Zebra striping with `#0F3460`
- Inventory progress bars: Color-coded by stock level

---

## 6. Page-Specific Layouts

### 6.1 Landing / Home Page
- Hero section: Full-viewport, dark gradient bg, pizza illustration, H1 + CTA
- Features section: 3-column icon grid
- How it works: Numbered step cards
- Popular Pizzas: Horizontal scroll cards on mobile

### 6.2 Menu Dashboard
- Responsive grid: 3 cols (desktop) → 2 cols (tablet) → 1 col (mobile)
- Sticky filter bar below navbar

### 6.3 Pizza Builder
- Single centered card layout
- Mobile: Full-screen wizard with swipe navigation
- Desktop: Wizard card + right sidebar summary panel

### 6.4 Cart Page
- 2-column layout: Cart items (left) + Order summary (right)
- Mobile: Stacked layout, summary at bottom

### 6.5 Admin Dashboard
- Sidebar (fixed) + main content area
- Mobile: Collapsible hamburger sidebar

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640px–1024px | 2 columns, condensed nav |
| Desktop | > 1024px | Full layout, sidebar visible |

---

## 8. Micro-Animations

| Element | Animation |
|---------|-----------|
| Page transitions | Fade-in 200ms ease |
| Card hover | Scale(1.03) + shadow 200ms ease |
| Button press | Scale(0.97) 100ms |
| Builder step change | Slide-left/right 300ms ease |
| Status badge update | Pulse animation on change |
| Toast appear | Slide-in from right 300ms |
| Progress bar | Width transition 400ms ease |
| Pizza image on card | Subtle scale on hover |

---

## 9. Iconography
- Library: **Lucide React** or **React Icons**
- Style: Outline icons, 20–24px
- Color: Inherit from text or explicit accent

---

## 10. Loading States
- Skeleton screens for pizza cards (not spinner)
- Button loading: Spinner icon inside button + disabled state
- Full-page loader: Centered pizza spinner animation on route change
