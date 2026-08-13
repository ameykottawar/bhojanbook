# Landing Page

## Goal
Add a public marketing landing page at the root (`/`) so that opening `https://bhojanbook.vercel.app/` shows the landing page first. Visitors can sign up or sign in from the top-right corner, and authenticated users are taken straight to the dashboard.

## Current state
- The app currently has auth at `/auth` and the protected dashboard at `/`.
- All protected routes use `ProtectedRoute`, which redirects unauthenticated users to `/auth`.
- Navigation in `AppLayout` links `/` as the Home route.

## Changes

### Routing
- Create a new public route `/` that renders a `LandingPage` component.
- Move the existing dashboard from `/` to `/dashboard`.
- Keep `/auth` as the authentication page.
- Update `ProtectedRoute` so unauthenticated users redirect to `/` (landing page) instead of `/auth`.
- Update `App.tsx` to register the new route layout.

### Landing page
- Build a new `src/pages/LandingPage.tsx` component:
  - Header with BhojanBook logo on the left and two corner buttons on the right: **Sign Up** and **Sign In** (both route to `/auth`).
  - Hero section with headline, subheadline, and primary CTA buttons.
  - Feature highlights for meal punching, student management, billing/invoicing, and multilingual support.
  - Use existing design tokens and warm food-inspired palette; no hardcoded colors.
- Use `lucide-react` icons for the feature cards.

### Navigation
- Update `AppLayout` nav items so the Home route points to `/dashboard` instead of `/`.
- Keep the mobile bottom nav consistent with the updated route.

### Translations
- Add new landing page translation keys to `LanguageContext` (`en`, `hi`, `mr`) for:
  - Hero headline, subtitle, CTA buttons, feature titles, and descriptions.
- Keep existing auth keys unchanged.

### Auth flow
- `AuthPage` already redirects authenticated users to `/`. After this change, authenticated users will be redirected from `/auth` to `/`, and the landing page will redirect authenticated users to `/dashboard` (or skip the landing page entirely).
- `ProtectedRoute` redirect target changes from `/auth` to `/` so unauthenticated users hit the landing page first.

## Acceptance criteria
1. Opening `/` shows the landing page (not the dashboard) when logged out.
2. Landing page has a top-right **Sign Up** button and **Sign In** button that navigate to `/auth`.
3. Authenticated users are redirected from `/` to `/dashboard`.
4. Unauthenticated users attempting any protected route are redirected to `/`.
5. App navigation links to `/dashboard` as the home view.
6. Translations are provided for English, Hindi, and Marathi.
7. Build passes and the landing page uses existing design tokens.
