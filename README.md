# Adoptify 🐾

A pet adoption web app built with **React + Vite + Tailwind CSS v4**. It uses
**Firebase** for authentication and user-submitted pets, and a **local
`db.json` catalog** for the adoptable pets shown on the home, Discover, and
Adoptable pages.

> No external API keys are needed to browse, search, view pet details, or save
> pets — the catalog and all pet photos are bundled with the app, so everything
> loads immediately.

## Features

- **Home page** — hero plus a row of **featured pets** with real photos. Click
  any featured pet to open a detail modal.
- **Discover page** (`/discover`) — a grid of every pet in the catalog. Click
  any pet for details.
- **Adoptable page** (`/adoptable`) — filter the catalog by **type**
  (dog / cat / all) or **breed**, then click any pet for details.
- **Pet detail modal** — shows the pet's photo, name, breed, age, gender,
  location, and story, with two actions:
  - **Adopt** — opens the Petfinder breed-search page for that pet in a new tab
    (a real adoption starting point; no API key needed).
  - **Save for later** — stores the pet in your browser's `localStorage`.
- **Saved pets page** (`/saved`) — pets you saved, in one place. They persist
  after a page refresh. No login required.
- **Firebase** — email/password + Google sign-in, plus full CRUD for pets that
  users add themselves (`/add-pet`, `/dashboard`, `/pets/:id` edit).

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run test     # run the test suite (Vitest)
npm run lint     # ESLint
```

The home / discover / adoptable / saved pages work **immediately**, with no
configuration.

### Firebase setup (only needed for login + user-submitted pets)

1. Create a project at <https://console.firebase.google.com/>.
2. Enable **Authentication** → Sign-in methods → **Email/Password** and **Google**.
3. Create a **Firestore** database.
4. Copy `.env.example` to `.env` and fill in your Firebase web config values
   (Firebase Console → Project settings → Your apps → SDK setup and
   configuration).

You can still browse, search, and save pets from the catalog before Firebase is
configured.

## How the catalog works

- `src/data/db.json` — 18 pets (12 dogs, 6 cats), each with `id, name, type,
  breed, age, gender, size, city, state, photo, description, tags, goodWith,
  vaccinated, neutered, houseTrained, url`.
- `public/images/pets/` — the real pet photos, bundled locally so they always
  load.
- `src/api/catalog.js` — a small data layer that reads `db.json` and exposes:
  - `fetchCatalogPets({ type, breed })` — list/filter pets
  - `getCatalogPetById(id)` — a single pet
  - `getFeaturedPets(n)` — the curated featured set for the home page

  A tiny artificial delay keeps the loading spinners visible so the data flow
  feels like a real API call.

## Project structure

```
src/
  api/catalog.js          local catalog data layer (reads db.json)
  components/              Navbar, Footer, PetCard, PetDetailModal, Spinner, ...
  context/AuthContext.jsx  Firebase auth context
  data/db.json             the pet catalog
  hooks/                   usePets, usePet, useSavedPets
  pages/                   Home, Discover, Adoptable, Saved, Pets, PetDetail,
                           AddPet, Dashboard, Login, Register, EditPet, NotFound
  firebase.js              Firebase init
```

## Tech

- React 19 + React Router 7
- Vite 8
- Tailwind CSS v4
- Firebase (Auth + Firestore)
- Vitest + @testing-library/react for tests
