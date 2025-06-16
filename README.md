# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0e90ca9c-e0b4-49b0-84e2-b4e24f5ed678

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0e90ca9c-e0b4-49b0-84e2-b4e24f5ed678) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0e90ca9c-e0b4-49b0-84e2-b4e24f5ed678) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

# Fractional First – UX & Design System (Mobile-First)

This guide defines the **visual identity**, **UX/UI patterns**, and **accessibility-first rules** for Fractional First's digital experiences.

---

## Brand Colors

| Purpose          | Color Name          | Hex                                      | Notes                                |
| ---------------- | ------------------- | ---------------------------------------- | ------------------------------------ |
| Primary Accent   | Fractional Teal     | #449889                                  | Core CTA, links, buttons, highlights |
| Gradient Accent  | Warm Orange → Peach | linear-gradient(90deg, #FF8A00, #FFC27A) | Hero backgrounds, CTA panels         |
| Text             | Charcoal            | #1A1A1A                                  | For all readable text                |
| Background       | Light Gray          | #F9F9F9                                  | Section backgrounds, FAQ accordion   |
| Border / Divider | Muted Gray          | #E6E6E6                                  | Card edges, input borders, dividers  |

Ensure **WCAG AA color contrast** across text and background.

---

## Typography

**Primary Font:** Inter (system fallback: Helvetica Neue, sans-serif)

| Element         | Style     | Size (Mobile → Desktop) | Weight  | Line Height |
| --------------- | --------- | ----------------------- | ------- | ----------- |
| H1 (Hero Title) | Bold      | 32px → 48px             | 700     | 1.2         |
| H2 (Section)    | Semi-bold | 24px → 36px             | 600     | 1.3         |
| H3 (Subhead)    | Medium    | 20px → 28px             | 500–600 | 1.4         |
| Body Text       | Regular   | 16px → 18px             | 400–500 | 1.6         |
| Caption/Label   | Light     | 14px                    | 400     | 1.5         |
| Button Text     | Medium    | 16px                    | 500–600 | 1.4         |

Best Practices:

- Keep line length to **60–70 characters** for readability.
- Use generous white space to improve cognitive scanning.

---

## Mobile-First UX Rules

1. **Stacked Layouts**: All sections stack vertically by default.
2. **Spacing**: `24px` top/bottom padding, `16px` horizontal margin.
3. **Responsive Typography**: Use fluid font scaling (e.g., `clamp()` in CSS).
4. **Touch Targets**: Buttons, links, toggles = minimum **48px** height/tappable space.
5. **Performance**: Lazy-load images, compress assets, defer animations until in viewport.
6. **Navigation**: Sticky top nav with hamburger menu on mobile. Prioritize "Contact Us" and key actions.

---

## Desktop Scaling

- **Container Max Width**: `1200px`
- **12-column responsive grid**: Used for content, cards, image layouts.
- **Cards/Sections**:
  - Single-column on mobile.
  - Two-column on tablet.
  - Three-column (max) on desktop for leader/service cards.

---

## UI Components

### 🔘 Buttons

| Variant      | Color         | Style                                |
| ------------ | ------------- | ------------------------------------ |
| Primary      | #449889       | White text, 8px rounded, hover scale |
| Secondary    | Transparent   | #449889 text + border                |
| Gradient CTA | Warm gradient | White or dark text, max contrast     |

🪄 **Animation**: 0.2s ease-in-out scale and shadow on hover.

---

### Cards

- Use **real human imagery** (smiling, natural expressions)
- Icon areas: warm accent tones with soft backgrounds
- Rounded corners: `16px`
- Shadow: subtle elevation (`box-shadow: 0 1px 3px rgba(0,0,0,0.06)`)

---

### FAQ / Accordion

- Expandable rows, default collapsed
- Chevron rotates `0° → 180°`
- Content fade/expand transition: `0.25s ease`
- Background: #F9F9F9, Border: #E6E6E6

---

## Microinteractions

| Interaction          | Pattern                  | Behavior                               |
| -------------------- | ------------------------ | -------------------------------------- |
| Section fade-in      | On scroll                | Delay-based staggered animation        |
| Button hover         | Scale + shadow           | `transform: scale(1.03)` + subtle glow |
| Carousel (scenarios) | Swipe on mobile / arrows | Horizontal scroll snap                 |
| FAQ accordion        | Expand                   | Smooth height transition + fade        |

---

## UX Best Practices

- **Accessible**: All interactive elements must have keyboard and screen reader support.
- **Consistent CTAs**: Always lead with action — "Get Started", "Learn More", "Meet Your Leader".
- **Progressive Disclosure**: Break content into digestible, expandable sections (like FAQs).
- **Emotional Clarity**: Use imagery and copy that conveys confidence, empathy, and momentum.
- **Zero Clutter**: Remove unnecessary UI; focus users on 1–2 primary actions per page.
- **Speed Matters**: Optimize all media (image compression, deferred loading).

---

## Visual Identity Principles

- **Empathetic Authority**: Be human, but confident. Our leaders are friendly experts.
- **Calm Confidence**: Use soft tones, whitespace, and clean lines.
- **Focus on Impact**: Every component should push a user toward clarity, action, or insight.

---

## Implementation Notes

- Use **auto-layouts** in Figma (mobile up to desktop)
- Establish responsive typography tokens in your design system
- Tailwind CSS or modern BEM/SASS frameworks are preferred for dev
