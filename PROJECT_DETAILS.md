# My Reading Goals - Project Details

## Overview

`My Reading Goals` is a responsive React web app for tracking books a user wants to read and books they have completed.

Core capabilities:
- Email/password authentication with Supabase
- User-specific cloud book storage in Supabase
- Add books with Google Books autocomplete
- Cover image fetching, saving, and display
- Book status management (`To Read` / `Completed`)
- Mobile-optimized UI with compact cards and modal details view

---

## Tech Stack

- **Frontend:** React 19 + Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS utility classes
- **Backend/Auth/DB:** Supabase (`@supabase/supabase-js`)
- **Autocomplete API:** Google Books API
- **Linting:** ESLint

---

## Project Structure (Key Files)

- `src/App.jsx`
  - Main router setup
  - Protected routes for authenticated pages
- `src/lib/supabaseClient.js`
  - Supabase client initialization from environment variables
- `src/lib/authContext.jsx`
  - Global auth context (`user`, `loading`)
- `src/lib/bookService.js`
  - Supabase CRUD operations for books
- `src/routes/LoginRoute.jsx`
  - Login/signup page and auth actions
- `src/routes/HomeRoute.jsx`
  - Dashboard, stats cards, search/filter, books grid
- `src/routes/AddBookRoute.jsx`
  - Add-book form and Google Books autocomplete
- `src/components/Navbar.jsx`
  - Responsive top navigation and auth controls
- `src/components/BookCard.jsx`
  - Individual book card with status and actions
- `src/components/BookDetailsModal.jsx`
  - Detailed book modal with cover/title/author/status
- `src/lib/storage.js`
  - LocalStorage helpers (guest flow + migration support)
- `src/App.css`
  - Global styles (includes horizontal overflow protection)

---

## Routing & Access Control

Defined in `src/App.jsx`:

- `/login` -> Public route
- `/` -> Protected route (`HomeRoute`)
- `/add` -> Protected route (`AddBookRoute`)

`ProtectedRoute` redirects unauthenticated users to `/login`.

---

## Authentication Flow

Implemented via Supabase and `AuthProvider`:

1. App starts and fetches current session (`supabase.auth.getSession()`).
2. `AuthProvider` sets `user` and `loading` state.
3. `onAuthStateChange` listens for login/logout updates.
4. UI and route protection respond to auth state automatically.

---

## Data Model (Books)

Expected core fields in `books` table:

- `id` (primary key)
- `user_id` (owner)
- `title` (string)
- `author` (string)
- `is_read` (boolean)
- `cover_image` (string URL)
- `created_at` (timestamp)

### Notes

- The app prefers `cover_image` and includes fallback handling for legacy `coverImage`.
- `bookService.addBook()` writes `cover_image` and has compatibility fallback behavior.

---

## Add Book & Autocomplete Flow

In `AddBookRoute`:

1. User types in title input.
2. Input is debounced (300ms).
3. Google Books API queried: `https://www.googleapis.com/books/v1/volumes?q=...`
4. Top results mapped into suggestion list (title, first author, cover).
5. On selection:
   - title autofilled
   - author autofilled
   - cover URL normalized to HTTPS and saved in `coverImage` state
6. On submit:
   - Authenticated users -> Supabase insert via `bookService.addBook()`
   - Guests -> LocalStorage fallback

---

## Book Display Flow

In `HomeRoute` + `BookCard` + `BookDetailsModal`:

1. Books fetched from Supabase for logged-in user.
2. DB rows mapped to UI objects:
   - `is_read` -> `isRead`
   - `cover_image` -> `cover_image` and `coverImage` for compatibility
3. Book cards show cover, title, author, status, and actions.
4. Clicking a card opens modal details.
5. Cover rendering uses:
   - HTTPS normalization
   - placeholder fallback (`/placeholder.png`)
   - `onError` handling for broken URLs

---

## UI/UX Summary

- Modern gradient style with soft shadows and rounded cards
- Compact mobile navbar with icon-first behavior
- Mobile-first dashboard cards and controls
- Responsive grid for books:
  - mobile: 1 column
  - small: 2 columns
  - medium: 3 columns
- Modal designed to fit smaller screens (`w-[90%]` on mobile)

---

## Current Stats Card Design

Top stats cards (`Total Books`, `Completed`, `To Read`) are:

- Compact (`grid-cols-3` on mobile)
- Centered icon + text
- Small gradient icon block
- Emphasized numeric values
- Small descriptive labels
- Hover micro-interaction (`hover:scale-[1.02]`)

---

## Environment Variables

Required for Supabase client:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Set in `.env` or `.env.local` at project root.

---

## Scripts

From `package.json`:

- `npm run dev` -> start development server
- `npm run build` -> production build
- `npm run preview` -> preview built app
- `npm run lint` -> lint codebase

---

## Known Lint State

App currently builds successfully.  
Linting has no blocking errors, but includes non-blocking warnings related to unused eslint-disable directives in a few files.

---

## Troubleshooting

### 1) Supabase env issues
- Ensure env variable names begin with `VITE_`
- Restart dev server after env changes

### 2) Cover image not visible
- Confirm `cover_image` is populated in Supabase row
- Verify URL is valid and accessible
- Modal/card fallback uses `/placeholder.png` when unavailable

### 3) Auth redirects unexpectedly
- Check active session in Supabase Auth
- Verify route protection behavior in `App.jsx`

---

## Future Improvements (Optional)

- Add unit/integration tests for auth and CRUD flow
- Remove temporary debug `console.log` lines in add-book flow
- Clean lint warnings for a fully clean lint report
- Add pagination for larger book collections
- Add optimistic UI updates and toast notifications

