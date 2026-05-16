# Project My Link (마이링크) - Project Instructions

This project is a minimal link management service for developers and creators, allowing them to integrate and manage their social and portfolio links in one place.

## Project Overview

- **Core Goal**: Provide a fast, minimal, and easy-to-manage link-in-bio service.
- **Key Features**:
  - **Firebase Google Auth**: Exclusive login/signup using Google accounts.
  - **Inline Editing**: Direct editing of profiles (nicknames, bio) and links (titles, URLs) without page transitions or modals.
  - **Automatic Favicons**: Using Google Favicon API (`https://www.google.com/s2/favicons?domain={domain}&sz=64`).
  - **Public Profile**: Minimalist, mobile-first profile page for visitors.
  - **Dashboard**: Two-pane layout with management on the left and live preview on the right.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4+
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Backend/Auth**: Firebase (Auth, Firestore)

## Development Workflow

### Key Commands

- **Development**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Format**: `npm run format` (Prettier)
- **Typecheck**: `npm run typecheck`
- **Add UI Components**: `npx shadcn@latest add [component-name]`

### Coding Conventions

- **Next.js App Router**: Follow standard App Router patterns (Server Components by default, `'use client'` where needed).
- **Styling**: Use Tailwind CSS utility classes. Prefer vanilla CSS variables if complex customization is needed beyond Tailwind.
- **UI Components**: Use shadcn/ui components located in `@/components/ui`.
- **Inline Editing**: Implement editing features as inline-swappable components (Text -> Input/Textarea) to maintain UX speed and simplicity.
- **Firebase**: 
  - `users` collection: Stores user profiles.
  - `links` sub-collection: `users/{uid}/links` stores the individual links.

## Architecture

- `app/`: Contains the routes and layout.
- `components/`:
  - `ui/`: shadcn/ui base components.
  - Custom components for the dashboard and profile pages.
- `lib/`: Utility functions and Firebase configuration.
- `docs/`: Project documentation (PRD, User Scenario, Wireframes).

## Current Status

- Initial Next.js template with shadcn/ui initialized.
- Firebase integration is planned but not yet implemented.
- Base layout and a placeholder landing page are present.
