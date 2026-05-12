# Gemini Project Context: my-link

## Project Overview
`my-link` is a repository containing a modern web application, primarily located in the `my-profile` directory. It is built using a futuristic or customized stack featuring Next.js 16 and React 19.

### Core Technologies
- **Framework:** Next.js 16.2.4 (Note: This version contains breaking changes compared to standard versions; refer to `my-profile/AGENTS.md`).
- **Library:** React 19.2.4
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Environment:** Node.js

## Project Structure
The repository is structured with the main application logic residing in the `my-profile` subdirectory.

- `my-profile/`: The core Next.js application.
  - `app/`: Contains the App Router logic (layouts, pages, components).
  - `public/`: Static assets like images and SVGs.
  - `next.config.ts`: Next.js configuration.
  - `tsconfig.json`: TypeScript configuration with `@/*` path aliases.
  - `AGENTS.md`: Crucial instructions for AI agents regarding version-specific breaking changes.

## Building and Running
All primary development commands should be executed within the `my-profile` directory.

| Task | Command |
| :--- | :--- |
| Install Dependencies | `npm install` |
| Development Server | `npm run dev` |
| Production Build | `npm run build` |
| Start Production | `npm run start` |
| Linting | `npm run lint` |

## Development Conventions
- **AI Agent Guidance:** Always consult `my-profile/AGENTS.md` before making architectural changes or using Next.js APIs, as this project uses a version with significant breaking changes.
- **Path Aliases:** Use the `@/` prefix to reference files within the `my-profile` directory (e.g., `@/app/globals.css`).
- **Styling:** Adhere to Tailwind CSS 4 conventions.
- **Strict Typing:** TypeScript is configured with `strict: true`. Ensure all new code maintains high type safety.
