---
name: Civic Trust System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#444651'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#4b1c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#6e2c00'
  on-tertiary-container: '#f39461'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#773205'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style
The design system is anchored in the principles of **Institutional Minimalism**. It aims to evoke a sense of reliability, transparency, and calm efficiency, which are critical for citizens interacting with government services. The aesthetic is professional and modern, avoiding unnecessary decorative elements to ensure the focus remains on accessibility and information clarity.

The visual style utilizes a "Surface-on-Surface" approach, where light-gray backgrounds provide a foundation for crisp white cards. This creates a clear hierarchy of information without overwhelming the user. Subtle depth is used to indicate interactivity, ensuring the interface feels responsive and approachable for users of all digital literacy levels.

## Colors
The palette is built on a foundation of **Deep Blue**, symbolizing stability and authority. **Teal** serves as an secondary accent, used sparingly for supportive actions or specific highlights to prevent visual fatigue.

### Semantic Palette
Color is used functionally to communicate urgency and status. 
- **Status Indicators:** Use soft background tints with high-contrast text for badges (e.g., a light amber background with dark amber text).
- **Priority Levels:** Use bold, saturated colors for "Critical" and "High" levels to ensure they stand out during triage, while "Low" remains neutral to reduce visual noise.

### Accessibility Note
All color combinations between text and background must maintain a minimum contrast ratio of 4.5:1 (WCAG AA). For interactive elements in the primary blue, use white text.

## Typography
This design system utilizes **Inter** for all roles to ensure maximum legibility and a systematic, clean feel. 

- **Hierarchy:** Use `headline-lg` for page titles and `headline-md` for card titles.
- **Body Text:** The standard for all user-submitted content and descriptions is `body-md`. 
- **Labels:** Use `label-sm` in all-caps for category headers or metadata labels to differentiate them from interactive body text.
- **Spacing:** Maintain generous paragraph spacing (1.5x line-height) to assist users with cognitive disabilities.

## Layout & Spacing
The layout follows a **8px square grid system** to ensure mathematical consistency. 

### Grid System
- **Desktop:** A 12-column fluid grid with a maximum container width of 1280px. Gutters are fixed at 24px.
- **Tablet:** 8-column grid with 24px margins.
- **Mobile:** 4-column grid with 16px margins.

### Spacing Philosophy
Content heavy pages (like complaint lists) should use `md` (16px) spacing between related items, while section breaks should use `xl` (32px) to provide clear visual breathing room.

## Elevation & Depth
The design system uses a **Tonal Layering** strategy to define hierarchy.

- **Level 0 (Background):** `#F8FAFC` — Used for the main canvas.
- **Level 1 (Cards/Surface):** `#FFFFFF` — Used for the primary content containers. These feature a subtle, diffused shadow: `0px 1px 3px rgba(15, 23, 42, 0.1), 0px 1px 2px rgba(15, 23, 42, 0.06)`.
- **Level 2 (Interactive/Overlays):** Used for modals or menus. These feature a more pronounced shadow to indicate they sit above the page content.

Avoid heavy borders; instead, use a 1px stroke in `#E2E8F0` for cards to define boundaries on white backgrounds if necessary.

## Shapes
The shape language is "Rounded" to soften the institutional feel and make the portal feel approachable.

- **Standard Elements:** Buttons, input fields, and small components use a 0.5rem (8px) radius.
- **Containers:** Large cards and content areas use `rounded-lg` (16px) to emphasize the "clean and modern" aesthetic.
- **Status Tags:** Use a fully rounded pill shape to distinguish them from clickable buttons.

## Components

### Buttons
- **Primary:** Deep Blue background with white text. High emphasis.
- **Secondary:** White background with Deep Blue border and text. Medium emphasis.
- **Ghost:** No background/border, Teal text. Used for "Cancel" or "Go Back" actions.
- **Sizing:** Minimum touch target height of 44px for accessibility.

### Input Fields
- **Default State:** White background, 1px border (#CBD5E1), 8px corner radius.
- **Focus State:** 2px Blue border (#1E3A8A) with a soft outer glow.
- **Labels:** Always visible above the field in `label-md`. Do not rely on placeholder text.

### Status Badges & Priority Tags
- **Badges:** Small, pill-shaped, using the semantic color palette. Text should be bold and centered.
- **Priority Tags:** Use an icon (e.g., a flag or circle) next to the text for redundant coding (color + shape/icon) to support colorblind users.

### Cards
- White background, 16px corner radius, subtle shadow.
- Padding should be consistent at 24px (`lg`) for desktop and 16px (`md`) for mobile.

### Progress Indicators
- For "In Progress" complaints, use a step-indicator component showing "Received," "In Review," and "Resolved" to set user expectations.